import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
 
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:      "http://localhost",
        changeOrigin: true,
        // Rewrites /api/auth/login.php  -->  /barterbayan/api/auth/login.php
        rewrite: (path) => path.replace(/^\/api/, "/barterbayan/api"),
      },
    },
  },
});
