/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensures Tailwind scans all your source files for classes
  ],
  theme: {
    extend: {
      spacing: {
        128: "32rem",
        112: "29rem",
      },
      margin: {
        18: "72px",
      },
      aspectRatio: { // Correctly use 'aspectRatio' here
        '4/3': '4 / 3', // Add custom 4/3 aspect ratio
        '16/9': '16 / 9', // Retain the existing 16/9 aspect ratio if needed
      },
    },
  },
  plugins: [],
};
