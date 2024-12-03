export default {
  plugins: [
    require("postcss-nesting"), // Optional: Enables nested CSS syntax
    require("tailwindcss"), // Include Tailwind CSS as a plugin
    require("autoprefixer"), // Automatically adds vendor prefixes
  ],
};
