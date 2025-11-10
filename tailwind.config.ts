import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          glass: "hsl(var(--card-glass))",
        },
        profitiv: {
          purple: {
            DEFAULT: "hsl(var(--profitiv-purple))",
            light: "hsl(var(--profitiv-purple-light))",
            dark: "hsl(var(--profitiv-purple-dark))",
          },
          cyan: {
            DEFAULT: "hsl(var(--profitiv-cyan))",
            light: "hsl(var(--profitiv-cyan-light))",
            dark: "hsl(var(--profitiv-cyan-dark))",
          },
          violet: "hsl(var(--profitiv-violet))",
          aqua: "hsl(var(--profitiv-aqua))",
        },
        graphite: {
          DEFAULT: "hsl(var(--graphite))",
          2: "hsl(var(--graphite-2))",
        },
        'holo-purple': "hsl(var(--holo-purple))",
        'holo-cyan': "hsl(var(--holo-cyan))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "baseMove": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "stripes": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "900px 900px" },
        },
        "orb1": {
          "0%": { transform: "translateY(0) rotate(0)" },
          "50%": { transform: "translateY(22px) rotate(6deg)" },
          "100%": { transform: "translateY(0) rotate(0)" },
        },
        "orb2": {
          "0%": { transform: "translateY(0) rotate(0)" },
          "50%": { transform: "translateY(-16px) rotate(-6deg)" },
          "100%": { transform: "translateY(0) rotate(0)" },
        },
        "wavePulse": {
          "0%": { filter: "blur(0px)" },
          "50%": { filter: "blur(6px)" },
          "100%": { filter: "blur(0px)" },
        },
        "gradientMove": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "baseMove": "baseMove 26s linear infinite",
        "stripes": "stripes 9s linear infinite",
        "orb1": "orb1 18s ease-in-out infinite",
        "orb2": "orb2 22s ease-in-out infinite",
        "wavePulse": "wavePulse 22s ease-in-out infinite",
        "gradientMove": "gradientMove 6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
