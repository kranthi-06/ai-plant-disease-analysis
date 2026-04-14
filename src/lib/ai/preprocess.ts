import sharp from "sharp";

import { clamp } from "@/lib/utils";
import type { ExplainabilityRegion, ImageSignals } from "@/types/diagnosis";

export function dataUrlToBuffer(dataUrl: string) {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    throw new Error("Invalid image payload.");
  }

  return Buffer.from(parsed.data, "base64");
}

export function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    data: match[2]
  };
}

function rgbToHsv(r: number, g: number, b: number) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  if (hue < 0) {
    hue += 360;
  }

  const saturation = max === 0 ? 0 : delta / max;
  return { h: hue, s: saturation, v: max };
}

function luminance(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function createRegions(
  cellScores: number[],
  columns: number,
  rows: number,
  lesionCoverage: number
): ExplainabilityRegion[] {
  const sorted = cellScores
    .map((score, index) => ({ score, index }))
    .filter((item) => item.score > Math.max(0.14, lesionCoverage * 0.38))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return sorted.map(({ index, score }, regionIndex) => {
    const x = index % columns;
    const y = Math.floor(index / columns);
    return {
      id: `region-${regionIndex + 1}`,
      x: x / columns,
      y: y / rows,
      width: 1 / columns,
      height: 1 / rows,
      intensity: clamp(score),
      label: score > 0.45 ? "High activity" : "Potential lesion cluster"
    };
  });
}

export async function extractImageSignals(imageDataUrl: string): Promise<ImageSignals> {
  const baseImage = sharp(dataUrlToBuffer(imageDataUrl)).rotate();
  const meta = await baseImage.metadata();
  const { data, info } = await baseImage
    .resize(160, 160, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const totalPixels = width * height;

  let green = 0;
  let yellow = 0;
  let brown = 0;
  let dark = 0;
  let totalLuminance = 0;
  let totalSaturation = 0;
  let edgeSignal = 0;
  const hueAccumulator = new Array(12).fill(0) as number[];
  const luminances = new Array(totalPixels).fill(0) as number[];

  const cellColumns = 6;
  const cellRows = 6;
  const cellScores = new Array(cellColumns * cellRows).fill(0) as number[];

  for (let i = 0; i < data.length; i += 3) {
    const pixelIndex = i / 3;
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const { h, s, v } = rgbToHsv(r, g, b);
    const lum = luminance(r, g, b);
    luminances[pixelIndex] = lum;
    totalLuminance += lum;
    totalSaturation += s;

    const isGreen = h >= 70 && h <= 165 && s > 0.18 && v > 0.18;
    const isYellow = h >= 32 && h <= 68 && s > 0.22 && v > 0.22;
    const isBrown = ((h >= 10 && h <= 32) || (r > g && g > b)) && s > 0.15 && v < 0.72;
    const isDark = v < 0.24;

    if (isGreen) green += 1;
    if (isYellow) yellow += 1;
    if (isBrown) brown += 1;
    if (isDark) dark += 1;

    if (s > 0.15 && v > 0.18) {
      const hueBin = Math.min(11, Math.floor(h / 30));
      hueAccumulator[hueBin] += 1;
    }

    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const cellX = Math.min(cellColumns - 1, Math.floor((x / width) * cellColumns));
    const cellY = Math.min(cellRows - 1, Math.floor((y / height) * cellRows));
    const cellIndex = cellY * cellColumns + cellX;

    const lesionSignal =
      (isBrown ? 1 : 0) +
      (isYellow ? 0.72 : 0) +
      (isDark ? 0.38 : 0) +
      (!isGreen && s < 0.14 && v < 0.66 ? 0.18 : 0);
    cellScores[cellIndex] += lesionSignal;

    if (x > 0) {
      const previousOffset = i - 3;
      const prevR = data[previousOffset] ?? 0;
      const prevG = data[previousOffset + 1] ?? 0;
      const prevB = data[previousOffset + 2] ?? 0;
      edgeSignal +=
        (Math.abs(r - prevR) + Math.abs(g - prevG) + Math.abs(b - prevB)) / (255 * 3);
    }
  }

  const meanLuminance = totalLuminance / totalPixels;
  const meanSaturation = totalSaturation / totalPixels;
  let variance = 0;

  for (const lum of luminances) {
    variance += (lum - meanLuminance) ** 2;
  }

  const greenRatio = green / totalPixels;
  const yellowRatio = yellow / totalPixels;
  const brownRatio = brown / totalPixels;
  const darkRatio = dark / totalPixels;
  const contrast = clamp(Math.sqrt(variance / totalPixels) / 0.32);
  const textureVariance = clamp(edgeSignal / totalPixels / 0.2);
  const lesionCoverage = clamp(yellowRatio * 0.55 + brownRatio * 0.95 + darkRatio * 0.3 + contrast * 0.16);
  const healthyCoverage = clamp(greenRatio - lesionCoverage * 0.18, 0, 1);
  const moistureStress = clamp(
    yellowRatio * 0.28 +
      darkRatio * 0.22 +
      contrast * 0.18 +
      (1 - meanSaturation) * 0.12 +
      (1 - greenRatio) * 0.2
  );

  const normalizedCells = cellScores.map((score) =>
    clamp(score / ((totalPixels / (cellColumns * cellRows)) * 1.18))
  );
  const hotspotDensity =
    normalizedCells.filter((score) => score > Math.max(0.16, lesionCoverage * 0.35)).length /
    normalizedCells.length;

  const dominantHueIndex = hueAccumulator.indexOf(Math.max(...hueAccumulator));
  const dominantHue = dominantHueIndex * 30 + 15;

  return {
    width: meta.width ?? width,
    height: meta.height ?? height,
    greenRatio,
    yellowRatio,
    brownRatio,
    darkRatio,
    lesionCoverage,
    healthyCoverage,
    moistureStress,
    textureVariance,
    hotspotDensity,
    contrast,
    dominantHue,
    regions: createRegions(normalizedCells, cellColumns, cellRows, lesionCoverage)
  };
}
