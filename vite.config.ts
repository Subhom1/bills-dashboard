import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": process.env,
  },
});
