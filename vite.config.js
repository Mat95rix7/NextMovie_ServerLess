import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createSitemap } from 'vite-plugin-sitemap';
import fetch from 'node-fetch';


// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // Permet l'accès via le réseau local
    port: 3000, // Port par défaut (vous pouvez le changer)
  },
  build: {
    outDir: "dist" // Par défaut, Vite construit dans "dist"
  },
  plugins: [
    react(), 
    createSitemap(
      {
        hostname: "https://my-cineapp.vercel.app/",
        routes: [
          '/', 
          '/about',
          '/contact',
          '/register',
          '/login',
          '/profile',
          '/admin',
          '/search'
        ],
        dynamicRoutes: async () => {
          try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=import.meta.VITE_API_TOKEN`);
            const data = await response.json();
  
            // Récupérer les IDs des films populaires
            return data.results.map(movie => `/movie/${movie.id}`);
          } catch (error) {
            console.error('Erreur lors de la récupération des films TMDb:', error);
            return [];
          }
        }
      }
    )],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
