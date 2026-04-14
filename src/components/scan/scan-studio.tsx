"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, CameraOff, ImagePlus, LoaderCircle, ScanLine, UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { GlassCard } from "@/components/shared/glass-card";
import { Chip } from "@/components/shared/chip";
import { plantChoices } from "@/lib/ai/catalog";
import { saveReport } from "@/lib/history/storage";
import type { AnalysisResponse } from "@/types/diagnosis";

const MAX_IMAGE_SIZE = 1400;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function optimizeDataUrl(dataUrl: string) {
  const image = await loadImage(dataUrl);
  const ratio = Math.min(1, MAX_IMAGE_SIZE / Math.max(image.width, image.height));
  const width = Math.round(image.width * ratio);
  const height = Math.round(image.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    return dataUrl;
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.86);
}

export function ScanStudio() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState("No image selected yet");
  const [plantHint, setPlantHint] = useState<(typeof plantChoices)[number]>("Auto");
  const [notes, setNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraState, setCameraState] = useState<"idle" | "active" | "error">("idle");

  const hasImage = Boolean(imageDataUrl);
  const canAnalyze = hasImage && !isAnalyzing;
  const statusText = useMemo(() => {
    if (isAnalyzing) return "Running vision analysis and assembling your diagnosis report...";
    if (cameraState === "active") return "Camera is live. Capture a sharp leaf image when the frame looks stable.";
    return "Use a clear close-up of the affected leaf for the best diagnosis quality.";
  }, [cameraState, isAnalyzing]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function handleImageSelection(dataUrl: string, label: string) {
    const optimized = await optimizeDataUrl(dataUrl);
    setImageDataUrl(optimized);
    setFileLabel(label);
  }

  async function onDrop(files: File[]) {
    const file = files[0];
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      await handleImageSelection(dataUrl, file.name);
      toast.success("Leaf image loaded and optimized.");
    } catch {
      toast.error("We could not read that image. Please try another file.");
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    onDrop
  });

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      setCameraState("active");
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraState("error");
      toast.error("Camera access was blocked. You can still upload an existing image.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraState("idle");
  }

  async function captureFrame() {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    await handleImageSelection(canvas.toDataURL("image/jpeg", 0.9), "Live camera capture");
    toast.success("Frame captured.");
  }

  async function analyzeImage() {
    if (!imageDataUrl) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl,
          plantHint,
          notes: notes.trim() || undefined
        })
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = (await response.json()) as AnalysisResponse;
      saveReport(data.report);
      toast.success("Diagnosis report ready.");
      startTransition(() => {
        router.push(`/results/${data.report.id}`);
      });
    } catch {
      toast.error("We could not complete the analysis. Please retry with a clearer leaf photo.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <GlassCard className="rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Chip>Scan Studio</Chip>
            <h1 className="mt-4 text-4xl font-semibold">Capture a plant image and generate an actionable diagnosis.</h1>
          </div>
          <div className="inline-flex rounded-full border border-border/70 bg-background/70 p-1 dark:bg-white/5">
            {(["upload", "camera"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${mode === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item === "upload" ? "Upload" : "Camera"}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{statusText}</p>

        {mode === "upload" ? (
          <div
            {...getRootProps()}
            className={`mt-6 rounded-[28px] border border-dashed p-6 transition sm:p-10 ${isDragActive ? "border-primary bg-primary/10" : "border-border/70 bg-background/50 dark:bg-white/5"}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                {isDragActive ? <UploadCloud className="h-8 w-8" /> : <ImagePlus className="h-8 w-8" />}
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Drop your crop image here</h2>
                <p className="text-sm text-muted-foreground">PNG, JPG, or HEIC converted by the browser after upload.</p>
              </div>
              <button
                type="button"
                className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                Choose image
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="overflow-hidden rounded-[28px] border border-border/70 bg-background/70 dark:bg-white/5">
              <video ref={videoRef} className="aspect-[4/3] w-full object-cover" muted playsInline />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={cameraState === "active" ? stopCamera : startCamera}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border/70 bg-background/70 px-5 text-sm font-semibold dark:bg-white/5"
              >
                {cameraState === "active" ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                {cameraState === "active" ? "Stop camera" : "Start camera"}
              </button>
              <button
                type="button"
                onClick={captureFrame}
                disabled={cameraState !== "active"}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                Capture frame
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-border/70 bg-background/60 p-5 dark:bg-white/5">
            <p className="text-sm font-semibold text-muted-foreground">Selected image</p>
            <p className="mt-2 text-sm">{fileLabel}</p>
            <div className="mt-4 overflow-hidden rounded-[24px] border border-border/70 bg-muted/30">
              {imageDataUrl ? (
                <Image src={imageDataUrl} alt="Selected plant" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">
                  Your optimized preview will appear here.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-border/70 bg-background/60 p-5 dark:bg-white/5">
              <label className="text-sm font-semibold text-muted-foreground">Plant type hint</label>
              <select
                value={plantHint}
                onChange={(event) => setPlantHint(event.target.value as (typeof plantChoices)[number])}
                className="mt-3 h-12 w-full rounded-2xl border border-border/70 bg-background px-4 text-sm outline-none ring-0 dark:bg-background"
              >
                {plantChoices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
              <p className="mt-3 text-sm text-muted-foreground">
                Selecting the crop species tightens the candidate disease set and improves report relevance.
              </p>
            </div>

            <div className="rounded-[28px] border border-border/70 bg-background/60 p-5 dark:bg-white/5">
              <label htmlFor="scan-notes" className="text-sm font-semibold text-muted-foreground">
                Field notes
              </label>
              <textarea
                id="scan-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional: mention weather, irrigation, crop age, or recent disease history."
                className="mt-3 min-h-28 w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm outline-none dark:bg-background"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6">
        <GlassCard className="rounded-[32px] p-6 sm:p-8">
          <Chip>AI readout</Chip>
          <h2 className="mt-4 text-3xl font-semibold">What the report will deliver</h2>
          <div className="mt-6 grid gap-3">
            {[
              "Detected disease and confidence meter",
              "Plant type, severity, and risk indicator",
              "Symptoms, causes, and preventive measures",
              "Organic and chemical treatment guidance",
              "Step-by-step recommended next actions",
              "Explainable hotspot overlays on the leaf image"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground dark:bg-white/5">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="rounded-[32px] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
              {isAnalyzing ? <LoaderCircle className="h-6 w-6 animate-spin" /> : <ScanLine className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-3xl font-semibold">Run diagnosis</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                The scan will preprocess the image, identify disease candidates, generate an explainability map, and assemble a structured report.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={analyzeImage}
            disabled={!canAnalyze}
            className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ScanLine className="h-5 w-5" />}
            {isAnalyzing ? "Analyzing image..." : "Generate diagnosis report"}
          </button>
        </GlassCard>
      </div>
    </div>
  );
}
