/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  // mode: "jit",
  purge: ["./web*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        "19/40": "47.5%",
        "1/40": "2.5%",
        "2/40": "5%"
      },
    },
  },
  variants: {
    extend: {
    }
  },
  plugins: [],
}