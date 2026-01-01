import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import daisyui, { type Config as DaisyUIConfig } from "daisyui";

type DaisyuiThemeExtend = {
  borderRadius: {
    badge: string;
    btn: string;
    box: string;
  };
  colors: {
    "base-100": string;
    "base-200": string;
    "base-300": string;
    "base-content": string;
    primary: string;
    "primary-content": string;
    secondary: string;
    "secondary-content": string;
    accent: string;
    "accent-content": string;
    neutral: string;
    "neutral-content": string;
    info: string;
    "info-content": string;
    success: string;
    "success-content": string;
    warning: string;
    "warning-content": string;
    error: string;
    "error-content": string;
  };
};

const daisyuiThemeExtend = daisyui.config!.theme!.extend as DaisyuiThemeExtend;

const shadcnThemeExtend = {
  borderRadius: {
    lg: daisyuiThemeExtend.borderRadius.badge,
    md: daisyuiThemeExtend.borderRadius.btn,
    sm: daisyuiThemeExtend.borderRadius.box,
  },
  colors: {
    background: daisyuiThemeExtend.colors["base-100"],
    foreground: daisyuiThemeExtend.colors["base-content"],
    card: {
      DEFAULT: daisyuiThemeExtend.colors["base-100"],
      foreground: daisyuiThemeExtend.colors["base-content"],
    },
    popover: {
      DEFAULT: daisyuiThemeExtend.colors["base-100"],
      foreground: daisyuiThemeExtend.colors["base-content"],
    },
    primary: {
      DEFAULT: daisyuiThemeExtend.colors.primary,
      foreground: daisyuiThemeExtend.colors["primary-content"],
    },
    secondary: {
      DEFAULT: daisyuiThemeExtend.colors.secondary,
      foreground: daisyuiThemeExtend.colors["secondary-content"],
    },
    muted: {
      DEFAULT: daisyuiThemeExtend.colors["base-300"],
      foreground: daisyuiThemeExtend.colors["base-content"],
    },
    accent: {
      DEFAULT: daisyuiThemeExtend.colors.accent,
      foreground: daisyuiThemeExtend.colors["accent-content"],
    },
    destructive: {
      DEFAULT: daisyuiThemeExtend.colors.error,
      foreground: daisyuiThemeExtend.colors["error-content"],
    },
    border: daisyuiThemeExtend.colors["base-300"],
    input: daisyuiThemeExtend.colors["base-300"],
    ring: daisyuiThemeExtend.colors.primary,
    chart: {
      "1": "hsl(var(--chart-1))",
      "2": "hsl(var(--chart-2))",
      "3": "hsl(var(--chart-3))",
      "4": "hsl(var(--chart-4))",
      "5": "hsl(var(--chart-5))",
    },
  },
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      peyda: ["var(--font-peyda)", ...fontFamily.sans],
      poppins: ["var(--font-poppins)", ...fontFamily.sans],
      inter: ["'Inter'", ...fontFamily.sans],
    },
    extend: {
      ...shadcnThemeExtend,
      
      colors: {
        ...shadcnThemeExtend.colors,
        
        'fariboorz': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        'dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-red": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-red": "pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    'gradient-red': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    'gradient-dark': 'linear-gradient(135deg, #111827 0%, #000000 100%)',
    'gradient-primary': 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
      },
       boxShadow: {
    'glow': '0 0 20px rgba(220, 38, 38, 0.3)',
    'glow-lg': '0 0 40px rgba(220, 38, 38, 0.5)',
  }
    },
  },
  plugins: [require("tailwindcss-animate"), require("daisyui")],
  daisyui: {
    styled: true,
    darkTheme: "dark",
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["cupcake"],
          primary: "#dc2626",
          secondary: "#b91c1c",
          accent: "#ef4444",
          neutral: "#1e293b",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0f172a",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#dc2626",
          "--radius": "0.75rem",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["forest"],
          primary: "#dc2626",
          secondary: "#b91c1c",
          accent: "#ef4444",
          neutral: "#1e293b",
          "base-100": "#000000",
          "base-200": "#111827",
          "base-300": "#1f2937",
          "base-content": "#f8fafc",
          info: "#3b82f6",
          success: "#22c55e",
          warning: "#f59e0b",
          error: "#dc2626",
          "--radius": "0.75rem",
        },
      },
    ],
  },
};

export default config;
