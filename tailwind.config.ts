import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        card: "hsl(var(--card))",
        ring: "hsl(var(--ring))",
        danger: "hsl(var(--danger))",
        warning: "hsl(var(--warning))"
      },
      boxShadow: {
        glow: "0 30px 80px rgba(20, 73, 40, 0.18)",
        panel: "0 14px 40px rgba(15, 23, 42, 0.14)"
      },
      backgroundImage: {
        orchard:
          "radial-gradient(circle at top left, rgba(145, 201, 138, 0.34), transparent 35%), radial-gradient(circle at bottom right, rgba(255, 211, 130, 0.22), transparent 28%), linear-gradient(140deg, rgba(255,255,255,0.88), rgba(242,250,243,0.78))"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" }
        }
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;

