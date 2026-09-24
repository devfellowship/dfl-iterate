import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { readFileSync, existsSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const swapyInstalled = existsSync(path.resolve(__dirname, "node_modules/swapy/package.json"));

// https://vitejs.dev/config/
// Umami analytics tag — config-driven, BUILD time
// (plan 20260918-umami-traffic-report-and-tracking-coverage, P4).
// Set VITE_UMAMI_WEBSITE_ID (Dokploy build arg or build env) to the Umami website
// id. When the value is unset or empty, the plugin adds NOTHING to index.html.
// Do not use a raw `%VITE_UMAMI_WEBSITE_ID%` in index.html instead: with the var
// unset, Vite keeps the literal text and every page loads a broken tag.
const UMAMI_SRC = "https://analytics.devfellowship.com/script.js";

function umamiTag(): Plugin {
  let websiteId = "";
  return {
    name: "dfl-umami-tag",
    configResolved(config) {
      const env = loadEnv(config.mode, config.envDir || config.root, "");
      websiteId = (process.env.VITE_UMAMI_WEBSITE_ID || env.VITE_UMAMI_WEBSITE_ID || "").trim();
      if (websiteId && !/^[A-Za-z0-9-]+$/.test(websiteId)) {
        throw new Error(`VITE_UMAMI_WEBSITE_ID is not a valid Umami website id: ${JSON.stringify(websiteId)}`);
      }
    },
    transformIndexHtml() {
      if (!websiteId) return [];
      return [
        {
          tag: "script",
          attrs: { defer: true, src: UMAMI_SRC, "data-website-id": websiteId },
          injectTo: "head",
        },
      ];
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger(), umamiTag()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      ...(swapyInstalled
        ? {}
        : {
            swapy: path.resolve(__dirname, "./src/shims/swapy.ts"),
          }),
    },
  },
  define: {
    "import.meta.env.VITE_APP_NAME": JSON.stringify(pkg.name),
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
  },
}));
