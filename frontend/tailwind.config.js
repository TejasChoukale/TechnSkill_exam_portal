/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      colors: {
        bg: {
          primary: "#0a0e1a",
          secondary: "#111827",
          card: "#0e1829",
        },
        accent: {
          DEFAULT: "#4f8dff",
          danger: "#ff4d6d",
          success: "#00d68f",
          warning: "#ffc107",
          teal: "#00e5c8",
        },
        brand: {
          border: "#1f2937",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(79,141,255,0.18)",
        "glow-sm": "0 0 20px rgba(79,141,255,0.25)",
        card: "0 8px 32px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #4f8dff 0%, #00e5c8 100%)",
        "gradient-dark":
          "linear-gradient(135deg, #0b1528 0%, #0d1f3c 50%, #091428 100%)",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "spin-slow": "spin 1.2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
