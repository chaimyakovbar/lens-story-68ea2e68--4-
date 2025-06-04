import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import emailServer from "./src/server/emailServer.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "email-server",
      configureServer(server) {
        server.middlewares.use("/api", emailServer);
      },
    },
  ],
  server: {
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
});
