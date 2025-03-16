// api/movies/search.js
import tmdbApi from "../../lib/tmdb-api.js";
export default async function handler(req, res) {
    const { query, page = 1 } = req.query;
    try {
        const response = await tmdbApi.get(`/search/movie`, { params: { query, page } });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to search movies" });
    }
}