import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // 컨테이너 외부 접근 허용
    port: 5173,
    allowedHosts: true,
    cors: true,

    // ✅ nginx 거치더라도 내부적으로 프록시 가능하게 유지
    proxy: {
      "/api": {
        target: "http://backend:8080", // Docker 네트워크 내부 백엔드 컨테이너
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://backend:8080", // WebSocket 백엔드
        changeOrigin: true,
        ws: true,
      },
    },
  },
});