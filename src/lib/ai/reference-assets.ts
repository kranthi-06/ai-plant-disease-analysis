import type { DiseaseRecord, ReferenceAsset } from "@/types/diagnosis";

function svgDataUri(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createReferenceSvg(title: string, palette: DiseaseRecord["palette"], accentText: string) {
  return svgDataUri(`
    <svg width="640" height="420" viewBox="0 0 640 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="60" y1="30" x2="560" y2="390" gradientUnits="userSpaceOnUse">
          <stop stop-color="${palette[0]}"/>
          <stop offset="0.5" stop-color="${palette[1]}"/>
          <stop offset="1" stop-color="${palette[2]}"/>
        </linearGradient>
      </defs>
      <rect width="640" height="420" rx="36" fill="url(#bg)"/>
      <circle cx="152" cy="128" r="90" fill="rgba(255,255,255,0.18)"/>
      <circle cx="492" cy="88" r="56" fill="rgba(255,255,255,0.14)"/>
      <path d="M185 296C244 214 326 176 455 162C400 232 323 289 202 318L185 296Z" fill="rgba(255,255,255,0.85)"/>
      <path d="M280 104C272 178 261 235 220 305" stroke="rgba(255,255,255,0.72)" stroke-width="8" stroke-linecap="round"/>
      <rect x="36" y="316" width="568" height="68" rx="24" fill="rgba(8,18,13,0.22)"/>
      <text x="62" y="352" fill="white" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700">${title}</text>
      <text x="62" y="376" fill="rgba(255,255,255,0.9)" font-family="Segoe UI, Arial, sans-serif" font-size="18">${accentText}</text>
    </svg>
  `);
}

export function buildReferenceAssets(record: DiseaseRecord): ReferenceAsset[] {
  return [
    {
      title: "Visual reference",
      caption: `Reference plate for ${record.diseaseName}.`,
      image: createReferenceSvg(record.diseaseName, record.palette, "Field visual reference")
    },
    {
      title: "Treatment companion",
      caption: "Use alongside scouting notes and treatment planning.",
      image: createReferenceSvg(record.plantType, [...record.palette].reverse() as DiseaseRecord["palette"], "Recommended action support")
    }
  ];
}
