// api/trending/[timeWindow].js
import tmdbApi from "../../../lib/tmdb-api.js";
export default async function handler(req, res) {
    const { timeWindow } = req.query;
    try {
        const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch trending movies for ${timeWindow}` });
    }
}

