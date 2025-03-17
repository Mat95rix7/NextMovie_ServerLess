import axios from 'axios';

const BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_TOKEN;

// Créer une instance axios réutilisable
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${TMDB_API_KEY}`
  },
  params: {
    include_adult: false,
    language: 'fr-FR'
  }
});

// Intercepteur pour gérer les erreurs globalement
tmdbApi.interceptors.response.use(
  response => response,
  error => {
    console.error("Erreur API TMDB:", error.message);
    return Promise.reject(error);
  }
);

export default tmdbApi;