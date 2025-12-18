import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import svgLoader from "vite-svg-loader";
import { resolve } from 'path'

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [
    vue(),
    tailwindcss(),
    svgLoader(),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ]
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  }
}));
