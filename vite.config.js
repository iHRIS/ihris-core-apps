import { fileURLToPath, URL } from "node:url";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "^/fhir": {
        target: "http://localhost:3000/",
        logLevel: "debug",
      },
      "^/translator": {
        target: "http://localhost:3000/",
        logLevel: "debug",
      },
      "^/auth": {
        target: "http://localhost:3000/",
        logLevel: "debug",
      },
      "^/config": {
        target: "http://localhost:3000/",
        logLevel: "debug",
      },
      "^/es": {
        target: "http://localhost:3000/",
        logLevel: "debug",
      },
      "^/fhir2sql": {
        target: "http://localhost:3000/",
        logLevel: "debug",
      },
    },
  },
});
