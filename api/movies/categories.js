import tmdbApi from "../../lib/tmdb-api.js";
import { setCorsHeaders } from "../../utils/setHeaders.js";
export default async function handler(req, res) {
  
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Répondre rapidement pour les pré-requêtes CORS
  }

    const { category, timeWindow } = req.query;
    
    switch(category) {
      case 'popular':
        try {
            const response = await tmdbApi.get("/movie/popular");
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch popular movies" });
        }
        break;

      case 'now-playing':
        try {
            const response = await tmdbApi.get("/movie/now_playing");
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch now playing movies" });
        }
        break;

      case 'top-rated':
        try {
            const response = await tmdbApi.get("/movie/top_rated");
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch top-rated movies" });
        }
        break;

      case 'upcoming':
        try {
            const response = await tmdbApi.get("/movie/upcoming");
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch upcoming movies" });
        }

        break;

      case 'trending':
        try {
            const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Failed to fetch trending movies for ${timeWindow}` });
        }
        break;

      default:
        return res.status(400).json({ error: 'Catégorie invalide' });
    }
  };