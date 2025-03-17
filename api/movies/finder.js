import { setCorsHeaders } from "../../utils/setHeaders.js";
import tmdbApi from "../../lib/tmdb-api.js";

export default async function handler(req, res) {
  
  setCorsHeaders(res);
  
  const { type, query, page = 1, genreId } = req.query;
  
  switch(type) {
    case 'search':
      try {
        // Vérifier si un terme de recherche est fourni
        if (!query) {
          return res.status(400).json({ error: "Search query is required" });
        }
        
        const response = await tmdbApi.get("/search/movie", {
          params: {
            query,
            page
          }
        });
        res.status(200).json(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to search movies" });
      }
      break;

    case 'discover':
        try {
            const response = await tmdbApi.get(`/discover/movie`, { 
              params: { with_genres: genreId, page } 
            });
            res.status(200).json(response.data);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch movies by genre" });
          }
          break;

    case 'genres':
      try {
        const response = await tmdbApi.get("/genre/movie/list");
        res.status(200).json(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch genres list" });
      }
      break;
      
    default:
      return res.status(400).json({ error: 'Type de recherche invalide' });
  }
}