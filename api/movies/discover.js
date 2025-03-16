import tmdbApi from "../../lib/tmdb-api.js";
export default async function handler(req, res) {
    const { genreId, page = 1 } = req.query;
    try {
        const response = await tmdbApi.get(`/discover/movie`, { params: { with_genres: genreId, page } });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch movies by genre" });
    }
}