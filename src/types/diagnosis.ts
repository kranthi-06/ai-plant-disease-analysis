export type PlantType =
  | "Tomato"
  | "Potato"
  | "Apple"
  | "Grape"
  | "Corn"
  | "Pepper"
  | "Mixed Crop";

export type SeverityLevel = "Low" | "Medium" | "High";
export type RiskLevel = "Low" | "Moderate" | "Elevated" | "Critical";

export interface ExplainabilityRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  intensity: number;
  label: string;
}

export interface ReferenceAsset {
  title: string;
  caption: string;
  image: string;
}

export interface DiagnosisReport {
  id: string;
  analyzedAt: string;
  source: "knowledge-engine" | "remote-model";
  model: string;
  diseaseId: string;
  diseaseName: string;
  plantType: PlantType;
  confidence: number;
  severity: SeverityLevel;
  riskLevel: RiskLevel;
  summary: string;
  visualSummary: string;
  symptoms: string[];
  causes: string[];
  preventiveMeasures: string[];
  treatments: {
    organic: string[];
    chemical: string[];
  };
  recommendedActions: string[];
  nextSteps: string[];
  explainability: {
    summary: string;
    regions: ExplainabilityRegion[];
  };
  referenceAssets: ReferenceAsset[];
  insights: string[];
  metrics: {
    lesionCoverage: number;
    healthyCoverage: number;
    moistureStress: number;
    textureVariance: number;
    imageWidth: number;
    imageHeight: number;
    processingTimeMs: number;
  };
  imagePreview: string;
}

export interface AnalysisRequest {
  imageDataUrl: string;
  plantHint?: PlantType | "Auto" | null;
  notes?: string;
}

export interface AnalysisResponse {
  report: DiagnosisReport;
}

export interface ImageSignals {
  width: number;
  height: number;
  greenRatio: number;
  yellowRatio: number;
  brownRatio: number;
  darkRatio: number;
  lesionCoverage: number;
  healthyCoverage: number;
  moistureStress: number;
  textureVariance: number;
  hotspotDensity: number;
  contrast: number;
  dominantHue: number;
  regions: ExplainabilityRegion[];
}

export interface DiseaseRecord {
  id: string;
  diseaseName: string;
  plantType: PlantType;
  summary: string;
  visualSummaryTemplate: string;
  symptoms: string[];
  causes: string[];
  preventiveMeasures: string[];
  treatments: {
    organic: string[];
    chemical: string[];
  };
  recommendedActions: string[];
  nextStepsTemplate: string[];
  insightTemplates: string[];
  contagiousness: number;
  profile: {
    greenRatio: number;
    yellowRatio: number;
    brownRatio: number;
    lesionCoverage: number;
    moistureStress: number;
    textureVariance: number;
    hotspotDensity: number;
    tolerance: number;
  };
  palette: [string, string, string];
}
