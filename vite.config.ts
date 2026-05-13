import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { readFileSync, existsSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const swapyInstalled = existsSync(path.resolve(__dirname, "node_modules/swapy/package.json"));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
