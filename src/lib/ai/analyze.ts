import { randomUUID } from "node:crypto";

import { clamp } from "@/lib/utils";
import type {
  AnalysisRequest,
  DiagnosisReport,
  DiseaseRecord,
  ImageSignals,
  PlantType,
  RiskLevel,
  SeverityLevel
} from "@/types/diagnosis";

import { diseaseCatalog, findDiseaseRecord, getCandidateDiseases } from "./catalog";
import { inferWithGemini, type RemoteInferenceResult } from "./gemini";
import { extractImageSignals } from "./preprocess";
import { buildReferenceAssets } from "./reference-assets";

function scoreFeature(actual: number, target: number, tolerance: number) {
  return clamp(1 - Math.abs(actual - target) / tolerance);
}

function scoreDisease(record: DiseaseRecord, signals: ImageSignals, plantHint?: PlantType | "Auto" | null) {
  const tolerance = record.profile.tolerance;
  let score =
    scoreFeature(signals.greenRatio, record.profile.greenRatio, tolerance) * 0.12 +
    scoreFeature(signals.yellowRatio, record.profile.yellowRatio, tolerance) * 0.14 +
    scoreFeature(signals.brownRatio, record.profile.brownRatio, tolerance) * 0.14 +
    scoreFeature(signals.lesionCoverage, record.profile.lesionCoverage, tolerance) * 0.18 +
    scoreFeature(signals.moistureStress, record.profile.moistureStress, tolerance + 0.04) * 0.12 +
    scoreFeature(signals.textureVariance, record.profile.textureVariance, tolerance + 0.03) * 0.15 +
    scoreFeature(signals.hotspotDensity, record.profile.hotspotDensity, tolerance + 0.04) * 0.15;

  if (plantHint && plantHint !== "Auto") {
    score += record.plantType === plantHint ? 0.08 : -0.05;
  }

  if (record.id.includes("healthy")) {
    score += clamp((signals.greenRatio - signals.lesionCoverage) * 0.25);
  }

  return clamp(score);
}

function severityFromSignals(record: DiseaseRecord, signals: ImageSignals): SeverityLevel {
  const index = signals.lesionCoverage * 0.66 + record.contagiousness * 0.18 + signals.hotspotDensity * 0.16;
  if (index < 0.28) return "Low";
  if (index < 0.56) return "Medium";
  return "High";
}

function riskFromSignals(record: DiseaseRecord, severity: SeverityLevel, confidence: number): RiskLevel {
  const score =
    record.contagiousness * 0.48 +
    (severity === "High" ? 0.35 : severity === "Medium" ? 0.2 : 0.08) +
    confidence * 0.17;

  if (score < 0.34) return "Low";
  if (score < 0.52) return "Moderate";
  if (score < 0.74) return "Elevated";
  return "Critical";
}

function buildExplainabilitySummary(record: DiseaseRecord, signals: ImageSignals) {
  if (signals.regions.length === 0) {
    return `No single aggressive lesion cluster dominated the frame. The diagnosis leaned on overall color balance and tissue uniformity typical of ${record.diseaseName.toLowerCase()}.`;
  }

  return `The analysis focused on ${signals.regions.length} high-signal region${signals.regions.length > 1 ? "s" : ""} with lesion-like discoloration, reduced healthy green coverage, and texture shifts aligned with ${record.diseaseName.toLowerCase()}.`;
}

function buildSummary(record: DiseaseRecord, signals: ImageSignals, severity: SeverityLevel) {
  return `${record.summary} Estimated lesion coverage is ${Math.round(signals.lesionCoverage * 100)}% with ${Math.round(signals.healthyCoverage * 100)}% healthy tissue remaining, resulting in a ${severity.toLowerCase()}-severity response profile.`;
}

function buildInsights(record: DiseaseRecord, signals: ImageSignals, confidence: number) {
  return [
    ...record.insightTemplates,
    `Estimated healthy tissue coverage remains at ${Math.round(signals.healthyCoverage * 100)}%, which informs recovery potential.`,
    `Confidence is ${Math.round(confidence * 100)}%, supported by ${Math.max(1, signals.regions.length)} explainability hotspot${signals.regions.length === 1 ? "" : "s"}.`
  ].slice(0, 4);
}

function buildNextSteps(record: DiseaseRecord, riskLevel: RiskLevel) {
  const steps = [...record.nextStepsTemplate];
  if (riskLevel === "Critical" || riskLevel === "Elevated") {
    steps.unshift("Escalate field inspection priority and verify spread across nearby plants today.");
  }
  return steps.slice(0, 4);
}

function createGenericRecord(remote: RemoteInferenceResult): DiseaseRecord {
  return {
    id: remote.diseaseId ?? "remote-diagnosis",
    diseaseName: remote.diseaseName ?? "Detected condition",
    plantType: remote.plantType ?? "Mixed Crop",
    summary: "The connected model reported a disease condition outside the local knowledge catalog.",
    visualSummaryTemplate:
      "The diagnosis was supplied by the connected external model and enriched with a general treatment response framework.",
    symptoms: ["Model-reported abnormal tissue condition", "Visible stress likely present in the supplied image"],
    causes: ["External model classification indicates an actionable crop issue"],
    preventiveMeasures: [
      "Review local agronomy guidance for the detected condition",
      "Isolate affected plants until the diagnosis is confirmed"
    ],
    treatments: {
      organic: ["Consult a crop-specific organic treatment aligned with the detected disease"],
      chemical: ["Use a crop-specific labeled treatment after confirming the diagnosis"]
    },
    recommendedActions: [
      "Review the connected model output with a local expert",
      "Inspect neighboring plants for similar symptoms"
    ],
    nextStepsTemplate: [
      "Capture additional images from multiple angles to improve confidence",
      "Record field conditions and compare against recent weather events"
    ],
    insightTemplates: ["This diagnosis originated from the configured external inference service."],
    contagiousness: 0.65,
    profile: {
      greenRatio: 0.4,
      yellowRatio: 0.2,
      brownRatio: 0.2,
      lesionCoverage: 0.4,
      moistureStress: 0.5,
      textureVariance: 0.5,
      hotspotDensity: 0.45,
      tolerance: 0.3
    },
    palette: ["#41644A", "#D6CDA4", "#A27B5C"]
  };
}

async function inferFromRemote(payload: AnalysisRequest) {
  const endpoint = process.env.MODEL_API_URL;
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.MODEL_API_KEY ? { Authorization: `Bearer ${process.env.MODEL_API_KEY}` } : {})
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Remote inference failed with status ${response.status}.`);
  }

  return (await response.json()) as RemoteInferenceResult;
}

function buildReport({
  record,
  confidence,
  signals,
  imagePreview,
  processingTimeMs,
  source,
  model,
  explainability,
  visualSummary,
  observedSymptoms
}: {
  record: DiseaseRecord;
  confidence: number;
  signals: ImageSignals;
  imagePreview: string;
  processingTimeMs: number;
  source: DiagnosisReport["source"];
  model: string;
  explainability?: RemoteInferenceResult["explainability"];
  visualSummary?: string;
  observedSymptoms?: string[];
}) {
  const severity = severityFromSignals(record, signals);
  const riskLevel = riskFromSignals(record, severity, confidence);

  return {
    id: randomUUID(),
    analyzedAt: new Date().toISOString(),
    source,
    model,
    diseaseId: record.id,
    diseaseName: record.diseaseName,
    plantType: record.plantType,
    confidence,
    severity,
    riskLevel,
    summary: buildSummary(record, signals, severity),
    visualSummary: visualSummary ?? record.visualSummaryTemplate,
    symptoms: observedSymptoms?.length ? Array.from(new Set([...observedSymptoms, ...record.symptoms])).slice(0, 6) : record.symptoms,
    causes: record.causes,
    preventiveMeasures: record.preventiveMeasures,
    treatments: record.treatments,
    recommendedActions: record.recommendedActions,
    nextSteps: buildNextSteps(record, riskLevel),
    explainability: {
      summary: explainability?.summary ?? buildExplainabilitySummary(record, signals),
      regions: explainability?.regions?.length ? explainability.regions : signals.regions
    },
    referenceAssets: buildReferenceAssets(record),
    insights: buildInsights(record, signals, confidence),
    metrics: {
      lesionCoverage: signals.lesionCoverage,
      healthyCoverage: signals.healthyCoverage,
      moistureStress: signals.moistureStress,
      textureVariance: signals.textureVariance,
      imageWidth: signals.width,
      imageHeight: signals.height,
      processingTimeMs
    },
    imagePreview
  } satisfies DiagnosisReport;
}

export async function analyzePlantImage(payload: AnalysisRequest): Promise<DiagnosisReport> {
  const start = performance.now();
  const signals = await extractImageSignals(payload.imageDataUrl);

  try {
    const remote = await inferWithGemini(payload, signals);
    if (remote) {
      const record =
        findDiseaseRecord(remote.diseaseId, remote.diseaseName) ?? createGenericRecord(remote);
      return buildReport({
        record,
        confidence: clamp(remote.confidence, 0.5, 0.99),
        signals,
        imagePreview: payload.imageDataUrl,
        processingTimeMs: Math.round(performance.now() - start),
        source: "remote-model",
        model: remote.model ?? "gemini",
        explainability: remote.explainability,
        visualSummary: remote.visualSummary,
        observedSymptoms: remote.observedSymptoms
      });
    }
  } catch (error) {
    console.error("Gemini inference unavailable. Falling back to alternate providers.", error);
  }

  try {
    const remote = await inferFromRemote(payload);
    if (remote) {
      const record =
        findDiseaseRecord(remote.diseaseId, remote.diseaseName) ?? createGenericRecord(remote);
      return buildReport({
        record,
        confidence: clamp(remote.confidence, 0.5, 0.99),
        signals,
        imagePreview: payload.imageDataUrl,
        processingTimeMs: Math.round(performance.now() - start),
        source: "remote-model",
        model: remote.model ?? "remote-connected-model",
        explainability: remote.explainability,
        visualSummary: remote.visualSummary,
        observedSymptoms: remote.observedSymptoms
      });
    }
  } catch (error) {
    console.error("Remote inference unavailable. Falling back to local engine.", error);
  }

  const ranked = getCandidateDiseases(payload.plantHint)
    .map((record) => ({ record, score: scoreDisease(record, signals, payload.plantHint) }))
    .sort((a, b) => b.score - a.score);

  const winner = ranked[0] ?? { record: diseaseCatalog[0], score: 0.6 };
  const runnerUp = ranked[1]?.score ?? 0.45;
  const gap = clamp(winner.score - runnerUp);
  const signalClarity = clamp(1 - Math.abs(signals.lesionCoverage - winner.record.profile.lesionCoverage));
  const confidence = clamp(0.54 + winner.score * 0.22 + gap * 0.18 + signalClarity * 0.12, 0.58, 0.96);

  return buildReport({
    record: winner.record,
    confidence,
    signals,
    imagePreview: payload.imageDataUrl,
    processingTimeMs: Math.round(performance.now() - start),
    source: "knowledge-engine",
    model: "verdant-knowledge-engine-v1"
  });
}
