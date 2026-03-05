import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/election-api": {
        target: "https://result.election.gov.np",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/election-api/, ""),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // The Election Commission's SecureJson endpoint requires a Referer 
            // to prevent hotlinking/unauthorized API access.
            proxyReq.setHeader('Referer', 'https://result.election.gov.np/');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
          });
        }
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
