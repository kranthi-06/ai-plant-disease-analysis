# Verdant AI

Verdant AI is a premium, Vercel-ready plant disease detection web application built with Next.js App Router. It combines a polished mobile-first UI with a structured diagnosis engine, explainability overlays, local report history, and a pluggable AI integration layer.

## Highlights

- Responsive landing, scan, results, history, and about pages
- Drag-and-drop upload plus live camera capture support
- Structured diagnosis cards instead of plain prediction text
- Explainability overlays for suspected lesion regions
- Local history persistence for recent reports
- Serverless analysis API with Gemini multimodal inference and model-ready runtime abstraction
- Clean deployment path for Vercel

## Tech Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Next Themes
- Sharp for server-side image preprocessing
- Zod for request validation

## Architecture

### Frontend

- `src/app` contains route-level pages and the serverless API route.
- `src/components` holds shared UI, layout, landing, scan, and results components.
- `src/lib/history` manages browser persistence for recent diagnosis reports.

### Backend

- `src/app/api/analyze/route.ts` accepts optimized image payloads and validates input.
- `src/lib/ai/preprocess.ts` extracts image signals such as lesion coverage, color distribution, moisture stress, and hotspot density.
- `src/lib/ai/analyze.ts` orchestrates inference, explainability, confidence scoring, and report assembly.

### AI Layer

- `src/lib/ai/catalog.ts` contains disease intelligence for supported crop conditions.
- Local fallback inference is powered by a knowledge-engine that maps image signals to disease profiles.
- If `GEMINI_API_KEY` is configured, the app will call Gemini first for multimodal disease selection and image-grounded explanation.
- If Gemini is unavailable, the app can still use `MODEL_API_URL` as a generic remote model hook, then fall back to the local diagnosis engine.

## Folder Structure

```text
.
├── public/
├── src/
│   ├── app/
│   │   ├── api/analyze/
│   │   ├── about/
│   │   ├── history/
│   │   ├── results/[id]/
│   │   └── scan/
│   ├── components/
│   │   ├── landing/
│   │   ├── layout/
│   │   ├── providers/
│   │   ├── results/
│   │   ├── scan/
│   │   └── shared/
│   ├── lib/
│   │   ├── ai/
│   │   └── history/
│   └── types/
├── .env.example
├── package.json
└── README.md
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` into `.env.local` when you want to connect Gemini or another inference service.

```bash
GEMINI_API_KEY=your-google-ai-api-key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODELS=gemini-flash-latest,gemini-2.5-flash-lite
MODEL_API_URL=https://your-model-service.example/api/predict
MODEL_API_KEY=optional-secret
```

If no remote model is configured, Verdant AI uses the built-in diagnosis engine so the full product experience still works locally and on Vercel.

## Gemini Integration

The app now supports direct Gemini multimodal analysis out of the box.

- Default model: `gemini-2.5-flash`
- Configurable via `GEMINI_MODEL`
- Automatic fallback support via `GEMINI_FALLBACK_MODELS`
- Image and prompt are sent from the server-side analysis route, not from the browser
- Gemini selects the best disease candidate from the internal catalog and returns image-grounded explanations
- The local engine still provides a safe fallback if Gemini is unavailable

Tested against the Google AI model listing on April 14, 2026 with these working examples available to the supplied key:

- `gemini-2.5-flash`
- `gemini-2.5-pro`
- `gemini-2.0-flash`
- `gemini-2.0-flash-lite`
- `gemini-flash-latest`
- `gemini-pro-latest`

## Connecting a Real Model

Recommended production path:

1. Start with Gemini for multimodal disease triage and product iteration speed.
2. Fine-tune a plant disease classifier using PlantVillage plus field images from your target crop conditions if you need higher field-specific accuracy.
3. Deploy that specialized model behind a lightweight inference API on a GPU-friendly platform such as Modal, Runpod, FastAPI, or a private container service.
4. Point `MODEL_API_URL` to that service.
5. Return a payload shaped like:

```json
{
  "diseaseId": "tomato-late-blight",
  "diseaseName": "Tomato Late Blight",
  "plantType": "Tomato",
  "confidence": 0.93,
  "model": "vit-plant-disease-v3",
  "explainability": {
    "summary": "High activation on necrotic leaf margins.",
    "regions": [
      {
        "id": "region-1",
        "x": 0.28,
        "y": 0.16,
        "width": 0.22,
        "height": 0.19,
        "intensity": 0.88,
        "label": "High activity"
      }
    ]
  }
}
```

The UI and local history system will automatically consume that standardized response.

## Sample Dataset Guidance

For a production model, start with:

- PlantVillage for broad disease class bootstrapping
- Your own field images for real-world lighting, occlusion, and background noise
- Balanced examples of healthy foliage and early-stage infections
- Region labels or saliency validation samples if explainability quality matters

## Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set `GEMINI_API_KEY` and optionally `GEMINI_MODEL` in the Vercel project settings.
4. If you also have a custom model service, set `MODEL_API_URL` and `MODEL_API_KEY`.
5. Deploy with the default Next.js build settings.

This app already builds successfully with:

```bash
npm run lint
npm run build
```

## Notes

- Analysis history is currently stored in browser local storage.
- The UI is intentionally designed to feel like a premium agritech product rather than a default dashboard template.
- The AI contract is stable, so swapping Gemini or the fallback engine for a crop-specific model does not require UI rewrites.
