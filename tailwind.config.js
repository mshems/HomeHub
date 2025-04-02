import animate from "tailwindcss-animate"
import typography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"]
export const safelist = ["dark"]
export const prefix = ""
export const content = [
  './pages/**/*.{ts,tsx,vue}',
  './views/**/*.{ts,tsx,vue}',
  './components/**/*.{ts,tsx,vue}',
  './app/**/*.{ts,tsx,vue}',
  './src/**/*.{ts,tsx,vue}',
]
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    fontFamily: {
      title: ['Montserrat', 'sans-serif'],
      sans: ['Noto Sans', 'sans-serif'],
      serif: ['Roboto Slab', 'serif'],
    },
    colors: {
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
        focus: "hsl(var(--secondary-focus))",
      },
      destructive: {
        DEFAULT: "hsl(var(--destructive))",
        foreground: "hsl(var(--destructive-foreground))",
        typography: "hsl(var(--destructive-typography))",
        focus: "hsl(var(--destructive-focus))",

      },
      positive: {
        DEFAULT: "hsl(var(--positive))",
        foreground: "hsl(var(--positive-foreground))",
        typography: "hsl(var(--positive-typography))",
        focus: "hsl(var(--positive-focus))",
      }, 
      warning: {
        DEFAULT: "hsl(var(--warning))",
        foreground: "hsl(var(--warning-foreground))",
        typography: "hsl(var(--warning-typography))",
        focus: "hsl(var(--warning-focus))",
      },
      negative: {
        DEFAULT: "hsl(var(--negative))",
        foreground: "hsl(var(--negative-foreground))",
        typography: "hsl(var(--negative-typography))",
        focus: "hsl(var(--negative-focus))",
      },
      muted: {
        DEFAULT: "hsl(var(--muted))",
        foreground: "hsl(var(--muted-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
        typography: "hsl(var(--accent-typography))",
        focus: "hsl(var(--accent-focus))",
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
        focus: "hsl(var(--card-focus))",
      },
    },
    borderRadius: {
      xl: "calc(var(--radius) + 4px)",
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    keyframes: {
      "accordion-down": {
        from: { height: 0 },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: 0 },
      },
      "collapsible-down": {
        from: { height: 0 },
        to: { height: 'var(--radix-collapsible-content-height)' },
      },
      "collapsible-up": {
        from: { height: 'var(--radix-collapsible-content-height)' },
        to: { height: 0 },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "collapsible-down": "collapsible-down 0.2s ease-in-out",
      "collapsible-up": "collapsible-up 0.2s ease-in-out",
    },
  },
}
export const plugins = [animate, typography]