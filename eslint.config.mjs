import js from "@eslint/js";

export default [
  js.configs.recommended, // <--- This adds standard JS best practices
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    ignores: ["node_modules", "dist", "build", ".internal"],

    languageOptions: {
      ecmaVersion: 2022, // ⬅️ UPDATED HERE
      sourceType: "module",
      globals: {
        console: true,
        process: true,
        // Add others like global, Buffer, etc., if needed
      },
    },
  },
];
