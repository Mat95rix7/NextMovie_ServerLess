import tmdbApi from "../../lib/tmdb-api.js";
export default async function handler(req, res) {
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