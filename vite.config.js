import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon-180x180.png",
        "icon-source.svg",
      ],
      manifest: {
        name: "Lo-Fi Focus · 뽀모도로 타이머",
        short_name: "Lo-Fi Focus",
        description: "Lofi 음악과 뽀모도로 타이머로 집중을 돕는 아늑한 웹앱",
        theme_color: "#100d1a",
        background_color: "#100d1a",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "ko",
        categories: ["productivity", "lifestyle"],
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
      },
    }),
  ],
});
