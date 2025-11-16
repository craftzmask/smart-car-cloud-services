import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",   // 12px
          small: "0.875rem", // 14px
          medium: "0.9375rem", // 15px
          large: "1.125rem", // 18px
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.5rem", 
          large: "1.75rem", 
        },
        radius: {
          small: "6px", 
          medium: "8px", 
          large: "12px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", 
          large: "2px", 
        },
      },
      themes: {
        light: {
          colors: {
            primary: {
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#8b5cf6",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
              DEFAULT: "#7c3aed",
              foreground: "#ffffff"
            },
            secondary: {
              50: "#faf5ff",
              100: "#f3e8ff",
              200: "#e9d5ff",
              300: "#d8b4fe",
              400: "#c084fc",
              500: "#a855f7",
              600: "#9333ea",
              700: "#7e22ce",
              800: "#6b21a8",
              900: "#581c87",
              DEFAULT: "#9333ea",
              foreground: "#ffffff"
            }
          }
        },
        dark: {
          colors: {
            primary: {
              50: "#4c1d95",
              100: "#5b21b6",
              200: "#6d28d9",
              300: "#7c3aed",
              400: "#8b5cf6",
              500: "#a78bfa",
              600: "#c4b5fd",
              700: "#ddd6fe",
              800: "#ede9fe",
              900: "#f5f3ff",
              DEFAULT: "#a78bfa",
              foreground: "#000000"
            },
            secondary: {
              50: "#581c87",
              100: "#6b21a8",
              200: "#7e22ce",
              300: "#9333ea",
              400: "#a855f7",
              500: "#c084fc",
              600: "#d8b4fe",
              700: "#e9d5ff",
              800: "#f3e8ff",
              900: "#faf5ff",
              DEFAULT: "#c084fc",
              foreground: "#000000"
            }
          }
        }
      }
    })
  ]
}
