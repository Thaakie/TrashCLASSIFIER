/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trash: {
          dark: "#37353E",
          grey: "#44444E",
          accent: "#715A5A",
          silver: "#D3DAD9",
        },
        organik: "#22c55e", // Hijau
        anorganik: "#eab308", // Kuning
        b3: "#ef4444", // Merah
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
