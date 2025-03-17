import tmdbApi from "../../lib/tmdb-api.js";
// Pour le Edge Runtime, nous utilisons un cache en mémoire simple
const cache = new Map();
const cacheTTLs = {
  'popular': 30 * 60 * 1000,      // 30 minutes (en millisecondes)
  'now-playing': 30 * 60 * 1000,  // 30 minutes
  'top-rated': 60 * 60 * 1000,    // 1 heure 
  'upcoming': 60 * 60 * 1000,     // 1 heure
  'trending': 15 * 60 * 1000      // 15 minutes
};

export default async function handler(req, res) {
  // Dans les Edge Functions, res est un objet Response différent
  // Nous créerons la réponse nous-mêmes
  
  // Gérer la requête CORS OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
  
  // Extraire les paramètres de l'URL
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  const timeWindow = url.searchParams.get('timeWindow') || 'day';
  const page = url.searchParams.get('page') || '1';
  
  // Valider la catégorie
  if (!category || !['popular', 'now-playing', 'top-rated', 'upcoming', 'trending'].includes(category)) {
    return new Response(
      JSON.stringify({ error: 'Catégorie invalide' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
  
  // Créer la clé de cache
  const cacheKey = `${category}-${timeWindow}-p${page}`;
  
  // Vérifier si nous avons des données en cache
  const cachedEntry = cache.get(cacheKey);
  if (cachedEntry && cachedEntry.expiry > Date.now()) {
    console.log(`Cache hit for ${cacheKey}`);
    return new Response(
      JSON.stringify(cachedEntry.data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300', // Client-side caching (5 minutes)
        },
      }
    );
  }
  
  try {
    // Construire le chemin d'endpoint approprié
    let endpoint;
    switch (category) {
      case 'popular':
        endpoint = "/movie/popular";
        break;
      case 'now-playing':
        endpoint = "/movie/now_playing";
        break;
      case 'top-rated':
        endpoint = "/movie/top_rated";
        break;
      case 'upcoming':
        endpoint = "/movie/upcoming";
        break;
      case 'trending':
        endpoint = `/trending/movie/${timeWindow}`;
        break;
    }
    
    // Faire la requête à l'API TMDb
    const response = await tmdbApi.get(endpoint, { 
      params: { page: parseInt(page) } 
    });
    
    const data = response.data;
    
    // Mettre en cache avec une date d'expiration
    const ttl = cacheTTLs[category] || 30 * 60 * 1000; // Défaut à 30 minutes
    cache.set(cacheKey, {
      data,
      expiry: Date.now() + ttl
    });
    
    console.log(`Cache miss for ${cacheKey}`);
    
    // Retourner les données
    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300', // Client-side caching
        },
      }
    );
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    
    // Construire un message d'erreur approprié
    const errorMessage = error.response 
      ? `TMDb API error: ${error.response.status}` 
      : `Failed to fetch data for ${category}`;
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        message: error.message 
      }),
      {
        status: error.response?.status || 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export const config = {
  runtime: 'edge',
};