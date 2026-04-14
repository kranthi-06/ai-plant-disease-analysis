import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzePlantImage } from "@/lib/ai/analyze";

export const runtime = "nodejs";
export const maxDuration = 30;

const requestSchema = z.object({
  imageDataUrl: z.string().min(40),
  plantHint: z
    .enum(["Auto", "Tomato", "Potato", "Apple", "Grape", "Corn", "Pepper", "Mixed Crop"])
    .optional()
    .nullable(),
  notes: z.string().max(500).optional()
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = requestSchema.parse(json);
    const report = await analyzePlantImage(payload);

    return NextResponse.json(
      { report },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: error.flatten()
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Analysis failed",
        message: "We could not analyze this image. Please retry with a clearer plant photo."
      },
      { status: 500 }
    );
  }
}
