import tmdbApi from "../../lib/tmdb-api.js";
import { setCorsHeaders } from "../../utils/setHeaders.js";
export default async function handler(req, res) {

    setCorsHeaders(res);
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end(); // Répondre rapidement pour les pré-requêtes CORS
    }
    const { id } = req.query;
    try {
        const response = await tmdbApi.get(`/movie/${id}`, {
            params: {
                append_to_response: 'credits'
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `Failed to fetch movie with id ${id}` });
    }
}