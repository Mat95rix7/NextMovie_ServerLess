// api/movies/top-rated.js
import tmdbApi from "../../lib/tmdb-api.js";
export default async function handler(req, res) {
    try {
        const response = await tmdbApi.get("/movie/top_rated");
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch top-rated movies" });
    }
}