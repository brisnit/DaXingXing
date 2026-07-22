import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        // Da Xing Xing military earth-tone spectrum.
        // Variable-backed so the whole app can switch between the light theme
        // (default) and the industrial dark theme (`.dark` on <html>) without
        // touching any page. Channel values live in globals.css.
        forest: {
          DEFAULT: "hsl(var(--brand-forest))",
          deep: "hsl(var(--brand-forest-deep))",
        },
        military: "hsl(var(--brand-military))",
        olive: "hsl(var(--brand-olive))",
        mustard: {
          DEFAULT: "hsl(var(--brand-mustard))",
          bright: "hsl(var(--brand-mustard-bright))",
        },
        khaki: "hsl(var(--brand-khaki))",
        earth: "hsl(var(--brand-earth))",
        sand: "hsl(var(--brand-sand))",
        charcoal: "hsl(var(--brand-charcoal))",
        bone: "hsl(var(--brand-bone))",

        // Semantic tokens (driven by CSS variables in globals.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "blueprint-grid":
          "linear-gradient(rgba(200,185,140,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(200,185,140,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        blueprint: "28px 28px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-status": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-status": "pulse-status 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
