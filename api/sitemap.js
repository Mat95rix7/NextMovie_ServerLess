// Fichier: api/sitemap.js

import axios from 'axios';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
// import sallesCinema from '../data/salles.json';

// Initialiser Firebase une seule fois avec les variables d'environnement de Vercel
let db;
if (!getApps().length) {
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
  };
  
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  db = getFirestore();
}

// Récupérer les catégories TMDB avec pagination
async function fetchMoviesByCategory(category, page = 1, maxPages = 3) {
  const results = [];
  let currentPage = page;
  
  // Récupérer le token API TMDB depuis les variables d'environnement Vite
  const apiToken = process.env.VITE_TMDB_API_TOKEN;
  
  while (currentPage <= maxPages) {
    try {
      const response = await axios.get(category.path, {
        baseURL: 'https://api.themoviedb.org/3',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        },
        params: {
          language: 'fr-FR',
          page: currentPage,
          region: 'FR'
        }
      });
      
      const movies = response.data.results || [];
      if (movies.length === 0) break;
      
      movies.forEach(movie => {
        movie.category = category.name;
      });
      
      results.push(...movies);
      
      if (currentPage >= response.data.total_pages) break;
      currentPage++;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${category.name}, page ${currentPage}:`, error);
      break;
    }
  }
  
  return results;
}

// Récupérer les genres pour enrichir le sitemap
async function fetchGenres() {
  try {
    const apiToken = process.env.VITE_TMDB_API_TOKEN;
    
    const response = await axios.get('/genre/movie/list', {
      baseURL: 'https://api.themoviedb.org/3',
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      params: {
        language: 'fr-FR'
      }
    });
    
    return response.data.genres || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error);
    return [];
  }
}

// Récupérer les événements récents
async function fetchEvents() {
  try {
    const eventsQuery = query(
      collection(db, 'events'),
      where('date', '>=', new Date()),
      orderBy('date', 'asc'),
      limit(30)
    );
    
    const eventDocs = await getDocs(eventsQuery);
    const events = [];
    
    eventDocs.forEach(doc => {
      events.push({
        id: doc.id,
        lastUpdated: doc.data().updatedAt?.toDate() || new Date()
      });
    });
    
    return events;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  
  try {
    // Vérifier que les variables d'environnement sont disponibles
    if (!process.env.VITE_TMDB_API_TOKEN) {
      console.warn('VITE_TMDB_API_TOKEN non défini. Certaines fonctionnalités peuvent être limitées.');
    }
    
    // Définir les catégories
    const categories = [
      { path: '/movie/popular', name: 'popular' },
      { path: '/movie/top_rated', name: 'top-rated' },
      { path: '/movie/upcoming', name: 'upcoming' },
      { path: '/movie/now_playing', name: 'now-playing' },
      { path: '/trending/movie/week', name: 'trending' }
    ];
    
    // Récupérer les données en parallèle pour optimiser les performances
    const [genresPromise, moviesPromises, usersPromise, eventsPromise] = [
      fetchGenres(),
      Promise.all(categories.map(category => fetchMoviesByCategory(category))),
      // Requête pour les utilisateurs publics
      getDocs(query(
        collection(db, 'users'),
        where('profilePublic', '==', true),
        limit(100)
      )).catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return { docs: [] };
      }),
      fetchEvents()
    ];
    
    // Attendre toutes les données
    const [genresData, moviesData, usersData, eventsData] = await Promise.all([
      genresPromise, 
      moviesPromises, 
      usersPromise, 
      eventsPromise
    ]);
    
    // Traiter les résultats
    const allMovies = moviesData.flat();
    const uniqueMovieIds = new Set();
    
    // Traiter les utilisateurs
    const publicUsers = [];
    usersData.docs?.forEach(doc => {
      publicUsers.push({
        id: doc.id,
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      });
    });
    
    // Générer le XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const domain = 'https://my-cineapp.vercel.app';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Pages principales
    const mainPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/movies', changefreq: 'daily', priority: '0.9' },
      // { url: '/cinemas', changefreq: 'weekly', priority: '0.8' },
      { url: '/search', changefreq: 'daily', priority: '0.8' },
      { url: '/events', changefreq: 'daily', priority: '0.8' },
      { url: '/trending', changefreq: 'daily', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.6' },
      { url: '/about', changefreq: 'monthly', priority: '0.5' },
      { url: '/faq', changefreq: 'monthly', priority: '0.5' }
    ];
    
    // Ajouter les pages principales
    mainPages.forEach(page => {
      xml += `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });
    
    // Ajouter les pages de catégories de films
    categories.forEach(category => {
      xml += `  <url>
    <loc>${domain}/movies/${category.name}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });
    
    // Ajouter les pages de genres
    genresData.forEach(genre => {
      xml += `  <url>
    <loc>${domain}/genre/${genre.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });
    
    // Ajouter les films (sans doublons)
    allMovies.forEach(movie => {
      if (!uniqueMovieIds.has(movie.id)) {
        uniqueMovieIds.add(movie.id);
        xml += `  <url>
    <loc>${domain}/movie/${movie.id}</loc>
    <lastmod>${movie.release_date || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
      }
    });
    
    // Ajouter les salles de cinéma
  //   if (sallesCinema && Array.isArray(sallesCinema)) {
  //     sallesCinema.forEach(salle => {
  //       const salleId = salle.id || salle._id;
  //       if (salleId) {
  //         xml += `  <url>
  //   <loc>${domain}/cinema/${salleId}</loc>
  //   <lastmod>${currentDate}</lastmod>
  //   <changefreq>monthly</changefreq>
  //   <priority>0.6</priority>
  // </url>\n`;
  //       }
  //     });
  //   }
    
    // Ajouter les événements
    eventsData.forEach(event => {
      xml += `  <url>
    <loc>${domain}/event/${event.id}</loc>
    <lastmod>${event.lastUpdated instanceof Date ? event.lastUpdated.toISOString().split('T')[0] : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });
    
    // Ajouter les profils publics des utilisateurs
    publicUsers.forEach(user => {
      xml += `  <url>
    <loc>${domain}/profile/${user.id}</loc>
    <lastmod>${user.lastUpdated instanceof Date ? user.lastUpdated.toISOString().split('T')[0] : currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>\n`;
    });
    
    // Fermer le XML
    xml += '</urlset>';
    
    // Renvoyer le XML
    res.status(200).send(xml);
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    
    // Générer un sitemap minimal en cas d'erreur
    let fallbackXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    fallbackXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Pages essentielles pour le fallback
    const essentialPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/movies', changefreq: 'daily', priority: '0.9' },
      // { url: '/cinemas', changefreq: 'weekly', priority: '0.8' },
      { url: '/search', changefreq: 'daily', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.6' }
    ];
    
    const currentDate = new Date().toISOString().split('T')[0];
    const domain = 'https://my-cineapp.vercel.app';
    
    essentialPages.forEach(page => {
      fallbackXml += `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });
    
    fallbackXml += '</urlset>';
    
    res.status(200).send(fallbackXml);
  }
}