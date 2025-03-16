import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Permet l'accès via le réseau local
    port: 3000, // Port par défaut (vous pouvez le changer)
    open: true, // Ouvre le navigateur automatiquement
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  build: {
    outDir: "dist" // Par défaut, Vite construit dans "dist"
  },
  plugins: [
    react()  
    ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
