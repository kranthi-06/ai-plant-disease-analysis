import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Verdant AI",
    short_name: "Verdant",
    description: "AI-powered plant disease diagnosis platform",
    start_url: "/",
    display: "standalone",
    background_color: "#f3faf4",
    theme_color: "#2b6b47",
    icons: [
      {
        src: "/logo-mark.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}

