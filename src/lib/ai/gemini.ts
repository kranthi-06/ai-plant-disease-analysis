import { z } from "zod";

import type { AnalysisRequest, DiagnosisReport, ImageSignals, PlantType } from "@/types/diagnosis";

import { getCandidateDiseases } from "./catalog";
import { parseDataUrl } from "./preprocess";

const geminiResponseSchema = z.object({
  diseaseId: z.string().nullable().optional(),
  diseaseName: z.string().nullable().optional(),
  plantType: z
    .enum(["Tomato", "Potato", "Apple", "Grape", "Corn", "Pepper", "Mixed Crop"])
    .nullable()
    .optional(),
  confidence: z.number().min(0).max(1).optional(),
  visualSummary: z.string().optional(),
  explainabilitySummary: z.string().optional(),
  observedSymptoms: z.array(z.string()).max(6).optional()
});

export interface RemoteInferenceResult {
  diseaseId?: string;
  diseaseName?: string;
  plantType?: PlantType;
  confidence: number;
  visualSummary?: string;
  observedSymptoms?: string[];
  explainability?: {
    summary?: string;
    regions?: DiagnosisReport["explainability"]["regions"];
  };
  model?: string;
}

function normalizeModelName(model: string) {
  return model.startsWith("models/") ? model : `models/${model}`;
}

function getOrderedModels() {
  const primary = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const envFallbacks = process.env.GEMINI_FALLBACK_MODELS?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
  const defaults = ["gemini-flash-latest", "gemini-2.5-flash-lite"];

  return Array.from(new Set([primary, ...envFallbacks, ...defaults].map(normalizeModelName)));
}

function extractJson(text: string) {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const codeBlock = trimmed.match(/```json\s*([\s\S]+?)```/i) ?? trimmed.match(/```\s*([\s\S]+?)```/i);
  if (codeBlock?.[1]) {
    return codeBlock[1].trim();
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  throw new Error("Gemini did not return JSON.");
}

function buildPrompt(payload: AnalysisRequest, signals: ImageSignals) {
  const candidates = getCandidateDiseases(payload.plantHint).map((record) => ({
    diseaseId: record.id,
    diseaseName: record.diseaseName,
    plantType: record.plantType,
    summary: record.summary,
    symptoms: record.symptoms.slice(0, 3)
  }));

  return `
You are a plant pathology image triage model inside a production crop diagnosis web app.

Task:
1. Inspect the plant image.
2. Choose the best matching disease from the provided candidate list.
3. If the image does not clearly match any candidate, return null for diseaseId and diseaseName.
4. Return JSON only. No markdown.

Candidate diseases:
${JSON.stringify(candidates, null, 2)}

Image-derived signals:
${JSON.stringify(
    {
      lesionCoverage: Number(signals.lesionCoverage.toFixed(3)),
      healthyCoverage: Number(signals.healthyCoverage.toFixed(3)),
      moistureStress: Number(signals.moistureStress.toFixed(3)),
      textureVariance: Number(signals.textureVariance.toFixed(3)),
      hotspotDensity: Number(signals.hotspotDensity.toFixed(3)),
      dominantHue: Number(signals.dominantHue.toFixed(1)),
      imageSize: `${signals.width}x${signals.height}`
    },
    null,
    2
  )}

Plant hint from user:
${payload.plantHint ?? "Auto"}

Field notes from user:
${payload.notes?.trim() || "None"}

Return this JSON shape exactly:
{
  "diseaseId": "candidate disease id or null",
  "diseaseName": "candidate disease name or null",
  "plantType": "Tomato | Potato | Apple | Grape | Corn | Pepper | Mixed Crop | null",
  "confidence": 0.0,
  "visualSummary": "short image-grounded visual explanation",
  "explainabilitySummary": "short explanation of which regions or symptoms influenced the choice",
  "observedSymptoms": ["up to 4 short bullets"]
}
`;
}

export function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY;
  const models = getOrderedModels();

  if (!apiKey) {
    return null;
  }

  return { apiKey, models };
}

export async function inferWithGemini(
  payload: AnalysisRequest,
  signals: ImageSignals
): Promise<RemoteInferenceResult | null> {
  const config = getGeminiConfig();
  if (!config) {
    return null;
  }

  const parsedImage = parseDataUrl(payload.imageDataUrl);
  if (!parsedImage) {
    throw new Error("Invalid image payload for Gemini.");
  }

  let lastError: Error | null = null;

  for (const model of config.models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: buildPrompt(payload, signals) },
                  {
                    inline_data: {
                      mime_type: parsedImage.mimeType,
                      data: parsedImage.data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.15,
              responseMimeType: "application/json"
            }
          }),
          signal: AbortSignal.timeout(25000),
          cache: "no-store"
        }
      );

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Gemini model ${model} failed with status ${response.status}: ${detail}`);
      }

      const json = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const text = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
      if (!text) {
        throw new Error(`Gemini model ${model} returned an empty response.`);
      }

      const parsed = geminiResponseSchema.parse(JSON.parse(extractJson(text)));

      return {
        diseaseId: parsed.diseaseId ?? undefined,
        diseaseName: parsed.diseaseName ?? undefined,
        plantType: parsed.plantType ?? undefined,
        confidence: parsed.confidence ?? 0.7,
        visualSummary: parsed.visualSummary,
        observedSymptoms: parsed.observedSymptoms,
        explainability: {
          summary: parsed.explainabilitySummary
        },
        model
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("All Gemini models failed.");
}
