import type { DiseaseRecord, PlantType } from "@/types/diagnosis";

export const plantChoices: Array<PlantType | "Auto"> = [
  "Auto",
  "Tomato",
  "Potato",
  "Apple",
  "Grape",
  "Corn",
  "Pepper",
  "Mixed Crop"
];

export const diseaseCatalog: DiseaseRecord[] = [
  {
    id: "tomato-early-blight",
    diseaseName: "Tomato Early Blight",
    plantType: "Tomato",
    summary: "Classic early blight pattern with brown ringed lesions and yellowing tissue.",
    visualSummaryTemplate:
      "Brown concentric lesions and surrounding chlorosis suggest early blight pressure on tomato foliage.",
    symptoms: [
      "Brown circular lesions with faint concentric rings",
      "Yellow halos around infected tissue",
      "Lower canopy weakening and defoliation"
    ],
    causes: [
      "Alternaria infection during warm humid periods",
      "Leaf wetness from irrigation or rain splash",
      "Crop residue carrying inoculum between cycles"
    ],
    preventiveMeasures: [
      "Rotate away from solanaceous crops and remove infected residue",
      "Improve airflow and avoid extended canopy wetness",
      "Water near the root zone instead of over the foliage"
    ],
    treatments: {
      organic: [
        "Apply approved copper fungicides or biofungicide support products",
        "Prune infected lower leaves before lesions spread further"
      ],
      chemical: [
        "Use a protectant fungicide labeled for Alternaria control",
        "Rotate fungicide groups to avoid resistance pressure"
      ]
    },
    recommendedActions: [
      "Prune the worst lesions and inspect nearby plants",
      "Begin a fungicide rotation immediately if disease is expanding",
      "Rescan after 48 to 72 hours to track spread"
    ],
    nextStepsTemplate: [
      "Scout the lower canopy for newly forming ring lesions",
      "Reduce canopy humidity through spacing and irrigation timing",
      "Track treatment response with repeat image captures"
    ],
    insightTemplates: [
      "Early blight often intensifies on older leaves before moving upward.",
      "Warm weather combined with moisture usually accelerates lesion growth."
    ],
    contagiousness: 0.62,
    profile: {
      greenRatio: 0.34,
      yellowRatio: 0.2,
      brownRatio: 0.28,
      lesionCoverage: 0.42,
      moistureStress: 0.48,
      textureVariance: 0.62,
      hotspotDensity: 0.5,
      tolerance: 0.26
    },
    palette: ["#8B5E34", "#D3B36A", "#58763B"]
  },
  {
    id: "tomato-late-blight",
    diseaseName: "Tomato Late Blight",
    plantType: "Tomato",
    summary: "Dark water-soaked lesions and rapid tissue decline indicate late blight risk.",
    visualSummaryTemplate:
      "Dark irregular lesions with moisture-linked stress are aligned with tomato late blight behavior.",
    symptoms: [
      "Dark greasy lesions near leaf edges",
      "Rapid collapse of infected tissue",
      "Water-soaked appearance and irregular spread"
    ],
    causes: [
      "Phytophthora pressure during cool wet conditions",
      "Dense humid canopies and prolonged leaf wetness",
      "Airborne spread from nearby infected plants"
    ],
    preventiveMeasures: [
      "Monitor blight-favorable weather and inspect aggressively",
      "Increase airflow and remove heavily infected tissue quickly",
      "Avoid leaving foliage wet overnight"
    ],
    treatments: {
      organic: [
        "Use labeled copper materials preventively where allowed",
        "Quarantine and remove high-pressure foliage fast"
      ],
      chemical: [
        "Deploy late-blight-specific fungicides immediately",
        "Maintain tight intervals and rotate FRAC groups"
      ]
    },
    recommendedActions: [
      "Treat urgently due to aggressive spread potential",
      "Inspect stems and adjacent plants for new lesions",
      "Escalate field monitoring after wet weather"
    ],
    nextStepsTemplate: [
      "Capture another scan after the next irrigation or rain event",
      "Check for stem darkening or canopy collapse nearby",
      "Alert the grower team if symptoms appear field-wide"
    ],
    insightTemplates: [
      "Late blight risk rises sharply when foliage remains wet overnight.",
      "High-confidence edge lesions often justify immediate response."
    ],
    contagiousness: 0.9,
    profile: {
      greenRatio: 0.3,
      yellowRatio: 0.16,
      brownRatio: 0.18,
      lesionCoverage: 0.58,
      moistureStress: 0.72,
      textureVariance: 0.48,
      hotspotDensity: 0.64,
      tolerance: 0.26
    },
    palette: ["#463F3A", "#73877B", "#A8C686"]
  },
  {
    id: "tomato-septoria-leaf-spot",
    diseaseName: "Tomato Septoria Leaf Spot",
    plantType: "Tomato",
    summary: "Dense small lesions with yellow margins indicate Septoria-like spotting.",
    visualSummaryTemplate:
      "Multiple small dark lesions with chlorotic halos match Septoria leaf spot characteristics.",
    symptoms: [
      "Many small dark spots with pale centers",
      "Yellowing around lesion clusters",
      "Defoliation beginning on older leaves"
    ],
    causes: [
      "Splash-dispersed fungal spores from crop debris",
      "Warm wet conditions sustaining infection",
      "Repeated tomato planting in the same area"
    ],
    preventiveMeasures: [
      "Mulch soil and remove lower infected foliage",
      "Rotate crops and improve sanitation",
      "Reduce rain splash and overhead watering"
    ],
    treatments: {
      organic: [
        "Use copper-based products and sanitation together",
        "Cut back heavily infected lower leaves"
      ],
      chemical: [
        "Apply fungicides labeled for Septoria management",
        "Maintain interval discipline during wet weather"
      ]
    },
    recommendedActions: [
      "Remove infected lower leaves first",
      "Document lesion density for follow-up scans",
      "Reduce splash dispersal around the crop base"
    ],
    nextStepsTemplate: [
      "Monitor older leaves for rapidly increasing spot counts",
      "Disinfect pruning tools between rows",
      "Pair spray programs with strong sanitation"
    ],
    insightTemplates: [
      "Septoria often presents as numerous small lesions instead of a few dominant ones.",
      "Defoliation risk increases when lower leaves become saturated with spots."
    ],
    contagiousness: 0.68,
    profile: {
      greenRatio: 0.33,
      yellowRatio: 0.24,
      brownRatio: 0.16,
      lesionCoverage: 0.46,
      moistureStress: 0.56,
      textureVariance: 0.58,
      hotspotDensity: 0.58,
      tolerance: 0.24
    },
    palette: ["#6D7A45", "#CDC98B", "#545B3A"]
  },
  {
    id: "tomato-healthy",
    diseaseName: "Tomato Healthy Foliage",
    plantType: "Tomato",
    summary: "Foliage appears healthy with dominant green tissue and minimal lesion pressure.",
    visualSummaryTemplate:
      "Healthy green coverage dominates the frame and lesion indicators remain low.",
    symptoms: ["Uniform green coloration", "Minimal spotting", "Strong apparent tissue vigor"],
    causes: ["No major disease signature detected"],
    preventiveMeasures: [
      "Continue routine scouting and sanitation",
      "Maintain balanced irrigation and nutrition",
      "Keep airflow healthy through canopy management"
    ],
    treatments: {
      organic: ["No direct treatment required beyond preventive crop care"],
      chemical: ["No immediate chemical intervention recommended"]
    },
    recommendedActions: [
      "Store this scan as a healthy baseline",
      "Continue preventive monitoring",
      "Rescan if new discoloration appears"
    ],
    nextStepsTemplate: [
      "Repeat scanning weekly during high-risk weather",
      "Use healthy scans as a baseline for comparison",
      "Preserve canopy airflow and clean residue"
    ],
    insightTemplates: [
      "High green coverage and low hotspot density support a healthy diagnosis.",
      "Baseline healthy scans improve future change detection."
    ],
    contagiousness: 0.1,
    profile: {
      greenRatio: 0.78,
      yellowRatio: 0.06,
      brownRatio: 0.03,
      lesionCoverage: 0.08,
      moistureStress: 0.22,
      textureVariance: 0.18,
      hotspotDensity: 0.1,
      tolerance: 0.2
    },
    palette: ["#5FAA58", "#9ED46A", "#D8F4C7"]
  },
  {
    id: "potato-late-blight",
    diseaseName: "Potato Late Blight",
    plantType: "Potato",
    summary: "High-moisture necrotic spread is consistent with potato late blight pressure.",
    visualSummaryTemplate:
      "Dark expanding lesions paired with moisture stress point toward late blight in potato crops.",
    symptoms: [
      "Dark lesions with pale green margins",
      "Fast spread under wet field conditions",
      "Possible stem involvement and collapse"
    ],
    causes: [
      "Phytophthora infestans during cool wet weather",
      "Persistent humidity and dense canopy cover",
      "Regional inoculum pressure across neighboring plots"
    ],
    preventiveMeasures: [
      "Scout aggressively during conducive weather windows",
      "Destroy infected cull piles and volunteers",
      "Maintain a preventive protectant schedule"
    ],
    treatments: {
      organic: [
        "Use approved copper products and remove heavily infected tissue",
        "Increase sanitation frequency during outbreaks"
      ],
      chemical: [
        "Deploy late-blight fungicides on tight intervals",
        "Use resistance-aware rotations"
      ]
    },
    recommendedActions: [
      "Respond rapidly because spread can be explosive",
      "Check stems and nearby plants for synchronized lesions",
      "Review full-block disease pressure, not just one plant"
    ],
    nextStepsTemplate: [
      "Capture another scan after the next wet weather event",
      "Document intervention timing to evaluate control response",
      "Escalate field monitoring across the block"
    ],
    insightTemplates: [
      "High hotspot density often reflects multiple infection centers.",
      "Late blight risk becomes severe when cool temperatures and moisture overlap."
    ],
    contagiousness: 0.92,
    profile: {
      greenRatio: 0.29,
      yellowRatio: 0.17,
      brownRatio: 0.16,
      lesionCoverage: 0.59,
      moistureStress: 0.74,
      textureVariance: 0.47,
      hotspotDensity: 0.66,
      tolerance: 0.24
    },
    palette: ["#424A44", "#8C9B6E", "#B6D487"]
  },
  {
    id: "apple-scab",
    diseaseName: "Apple Scab",
    plantType: "Apple",
    summary: "Olive-to-brown surface spotting is aligned with apple scab activity.",
    visualSummaryTemplate:
      "Irregular olive-brown lesions and roughened surface texture suggest apple scab.",
    symptoms: [
      "Olive-green to brown lesions on leaf surfaces",
      "Velvety scab-like patches",
      "Possible distortion or premature leaf drop"
    ],
    causes: [
      "Venturia infection during wet spring conditions",
      "Poor orchard sanitation and fallen leaf inoculum",
      "Frequent infection periods tied to wetness"
    ],
    preventiveMeasures: [
      "Sanitize orchard residue and prune for airflow",
      "Track wetness-driven infection windows",
      "Use resistant varieties where possible"
    ],
    treatments: {
      organic: [
        "Use sulfur or copper-based products where appropriate",
        "Support orchard sanitation and canopy drying"
      ],
      chemical: [
        "Apply fungicides timed to scab infection periods",
        "Rotate active ingredients across the season"
      ]
    },
    recommendedActions: [
      "Inspect nearby leaves and young fruit for matching lesions",
      "Review spray timing against recent rainfall",
      "Improve airflow with selective pruning"
    ],
    nextStepsTemplate: [
      "Track lesion expansion after rainy periods",
      "Remove residue sources beneath infected trees",
      "Use follow-up scans after the next protection window"
    ],
    insightTemplates: [
      "Apple scab often correlates strongly with orchard wetness.",
      "Roughened lesion texture is a useful visual clue."
    ],
    contagiousness: 0.74,
    profile: {
      greenRatio: 0.42,
      yellowRatio: 0.18,
      brownRatio: 0.19,
      lesionCoverage: 0.34,
      moistureStress: 0.5,
      textureVariance: 0.54,
      hotspotDensity: 0.39,
      tolerance: 0.25
    },
    palette: ["#667C52", "#A88D57", "#CADCA0"]
  },
  {
    id: "grape-black-rot",
    diseaseName: "Grape Black Rot",
    plantType: "Grape",
    summary: "Dark clustered lesions suggest grape black rot progression.",
    visualSummaryTemplate:
      "Black-to-brown lesion clusters with moderate canopy stress match grape black rot behavior.",
    symptoms: [
      "Dark circular lesions with defined margins",
      "Tan centers or black specks in advanced stages",
      "Potential spread toward fruiting structures"
    ],
    causes: [
      "Warm wet conditions driving infection pressure",
      "Mummified fruit or debris serving as inoculum",
      "Storm-driven splash dispersal"
    ],
    preventiveMeasures: [
      "Remove mummified fruit and sanitize the canopy",
      "Prune for light and airflow penetration",
      "Maintain timely fungicide protection during infection windows"
    ],
    treatments: {
      organic: [
        "Use suitable sulfur or copper programs where permitted",
        "Tighten sanitation to lower inoculum pressure"
      ],
      chemical: [
        "Apply fungicides with black rot activity during key windows",
        "Rotate chemistry classes to preserve efficacy"
      ]
    },
    recommendedActions: [
      "Inspect clusters and tendrils for secondary spread",
      "Remove infected debris from the vineyard floor",
      "Prioritize treatment if warm wet weather persists"
    ],
    nextStepsTemplate: [
      "Follow up with scans after rainfall events",
      "Compare lesion counts across vine rows",
      "Track sanitation progress with scouting notes"
    ],
    insightTemplates: [
      "Black rot risk rises when inoculum remains in the vineyard.",
      "Clustered dark lesions often indicate active disease pressure."
    ],
    contagiousness: 0.79,
    profile: {
      greenRatio: 0.37,
      yellowRatio: 0.14,
      brownRatio: 0.24,
      lesionCoverage: 0.41,
      moistureStress: 0.52,
      textureVariance: 0.56,
      hotspotDensity: 0.52,
      tolerance: 0.25
    },
    palette: ["#5E503F", "#8F6D46", "#88A670"]
  },
  {
    id: "pepper-bacterial-spot",
    diseaseName: "Pepper Bacterial Spot",
    plantType: "Pepper",
    summary: "Angular dark lesions and yellowing suggest bacterial spot on pepper.",
    visualSummaryTemplate:
      "Dark defined spotting with moderate chlorosis aligns with bacterial spot symptoms.",
    symptoms: [
      "Small dark angular lesions",
      "Yellowing around infected spots",
      "Shot-hole effect in advanced cases"
    ],
    causes: [
      "Bacterial spread through splash or infected transplants",
      "Warm wet conditions and leaf injury",
      "Tool or handling transfer when foliage is wet"
    ],
    preventiveMeasures: [
      "Use clean planting material and sanitize tools",
      "Reduce overhead watering and splash transfer",
      "Improve airflow around the crop"
    ],
    treatments: {
      organic: [
        "Use copper-based bactericides within label recommendations",
        "Pair treatment with strict sanitation"
      ],
      chemical: [
        "Use labeled bactericide programs with resistance awareness",
        "Act early before lesions become widespread"
      ]
    },
    recommendedActions: [
      "Remove the worst infected leaves from isolated plants",
      "Reduce handling when foliage is wet",
      "Monitor nearby pepper plants for similar lesions"
    ],
    nextStepsTemplate: [
      "Rescan after sanitation and copper applications",
      "Inspect recent transplants for a possible source",
      "Review irrigation methods to cut splash transmission"
    ],
    insightTemplates: [
      "Angular lesions help differentiate bacterial spot from softer fungal spotting.",
      "Warm wet conditions can accelerate spread quickly."
    ],
    contagiousness: 0.69,
    profile: {
      greenRatio: 0.41,
      yellowRatio: 0.19,
      brownRatio: 0.14,
      lesionCoverage: 0.31,
      moistureStress: 0.53,
      textureVariance: 0.52,
      hotspotDensity: 0.42,
      tolerance: 0.24
    },
    palette: ["#4F5D2F", "#D2B97A", "#839B55"]
  }
];

export function getCandidateDiseases(plantHint?: PlantType | "Auto" | null) {
  if (!plantHint || plantHint === "Auto" || plantHint === "Mixed Crop") {
    return diseaseCatalog;
  }

  const candidates = diseaseCatalog.filter((record) => record.plantType === plantHint);
  return candidates.length > 0 ? candidates : diseaseCatalog;
}

export function findDiseaseRecord(diseaseId?: string | null, diseaseName?: string | null) {
  return diseaseCatalog.find((record) => {
    const matchesId = diseaseId ? record.id.toLowerCase() === diseaseId.toLowerCase() : false;
    const matchesName = diseaseName
      ? record.diseaseName.toLowerCase() === diseaseName.toLowerCase()
      : false;

    return matchesId || matchesName;
  });
}
