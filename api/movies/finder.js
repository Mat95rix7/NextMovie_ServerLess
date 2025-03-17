import { setCorsHeaders } from "../../utils/setHeaders.js";
import tmdbApi from "../../lib/tmdb-api.js";

// Configuration du cache en mémoire pour Edge Runtime
const cache = new Map();
const cacheTTLs = {
  'search': 15 * 60 * 1000,       // 15 minutes (en millisecondes)
  'discover': 30 * 60 * 1000,     // 30 minutes
  'genres': 24 * 60 * 60 * 1000,  // 24 heures (les genres changent rarement)
};

// Fonction utilitaire pour nettoyer le cache périodiquement
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expiry < now) {
      cache.delete(key);
    }
  }
};

export default async function handler(req, res) {
  // Pour Edge Functions, on utilise des objets Response
  // Si la fonction est exécutée en mode Node.js, on conserve l'API res traditionnelle
  const isEdgeRuntime = typeof Response !== 'undefined';
  
  if (isEdgeRuntime && req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } else if (!isEdgeRuntime) {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  }
  
  // Extraire les paramètres selon l'environnement
  let type, query, page, genreId;
  
  if (isEdgeRuntime) {
    const url = new URL(req.url);
    type = url.searchParams.get('type');
    query = url.searchParams.get('query');
    page = url.searchParams.get('page') || '1';
    genreId = url.searchParams.get('genreId');
  } else {
    ({ type, query, page = 1, genreId } = req.query);
  }
  
  // Vérifier la validité du type
  if (!['search', 'discover', 'genres'].includes(type)) {
    if (isEdgeRuntime) {
      return new Response(
        JSON.stringify({ error: 'Type de recherche invalide' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } else {
      return res.status(400).json({ error: 'Type de recherche invalide' });
    }
  }
  
  // Créer une clé de cache unique selon le type de requête
  let cacheKey;
  switch (type) {
    case 'search':
      cacheKey = `search-${query}-p${page}`;
      break;
    case 'discover':
      cacheKey = `discover-g${genreId}-p${page}`;
      break;
    case 'genres':
      cacheKey = 'genres-list';
      break;
  }
  
  // Nettoyer le cache occasionnellement (avec une chance de 5%)
  if (Math.random() < 0.05) {
    cleanupCache();
  }
  
  // Vérifier le cache
  const cachedEntry = cache.get(cacheKey);
  if (cachedEntry && cachedEntry.expiry > Date.now()) {
    console.log(`Cache hit for ${cacheKey}`);
    
    if (isEdgeRuntime) {
      return new Response(
        JSON.stringify(cachedEntry.data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300',
          },
        }
      );
    } else {
      return res.status(200).json(cachedEntry.data);
    }
  }
  
  // Cas où il n'y a pas de données en cache
  try {
    let response;
    
    switch(type) {
      case 'search':
        if (!query) {
          const errorMsg = { error: "Search query is required" };
          if (isEdgeRuntime) {
            return new Response(JSON.stringify(errorMsg), {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          } else {
            return res.status(400).json(errorMsg);
          }
        }
        
        response = await tmdbApi.get("/search/movie", {
          params: { query, page: parseInt(page) }
        });
        break;
        
      case 'discover':
        response = await tmdbApi.get("/discover/movie", {
          params: { with_genres: genreId, page: parseInt(page) }
        });
        break;
        
      case 'genres':
        response = await tmdbApi.get("/genre/movie/list");
        break;
    }
    
    // Mettre en cache avec date d'expiration
    const ttl = cacheTTLs[type] || 15 * 60 * 1000; // Défaut à 15 minutes
    cache.set(cacheKey, {
      data: response.data,
      expiry: Date.now() + ttl
    });
    
    console.log(`Cache miss for ${cacheKey}`);
    
    // Retourner les données selon l'environnement
    if (isEdgeRuntime) {
      return new Response(
        JSON.stringify(response.data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300',
          },
        }
      );
    } else {
      return res.status(200).json(response.data);
    }
    
  } catch (error) {
    console.error(`Error in ${type} request:`, error);
    
    const errorMsg = {
      error: `Failed to ${type === 'search' ? 'search movies' : 
              type === 'discover' ? 'fetch movies by genre' : 
              'fetch genres list'}`,
      message: error.message
    };
    
    if (isEdgeRuntime) {
      return new Response(
        JSON.stringify(errorMsg),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } else {
      return res.status(500).json(errorMsg);
    }
  }
}

export const config = {
  runtime: 'edge',
};