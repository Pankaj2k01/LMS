/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#133c8b",
          blue: "#2156c8",
          sky: "#60a5fa",
          gold: "#f5b942",
          paper: "#f8f4eb",
          slate: "#213047"
        }
      },
      boxShadow: {
        panel: "0 20px 45px rgba(19, 60, 139, 0.12)"
      },
      backgroundImage: {
        hero: "linear-gradient(135deg, rgba(19,60,139,0.94), rgba(33,86,200,0.78))"
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
