// Fichier: api/sitemap.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, limit } from 'firebase/firestore';
import sallesCinema from '../src/data/cinemas.json';
import { Fetching } from '../src/services/tmdb';

// Configuration Firebase
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID
};

// Initialisation de Firebase (avec vérification pour éviter les réinitialisations multiples)
let app;
let db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  // Si Firebase est déjà initialisé
  if (!/already exists/.test(error.message)) {
    console.error("Firebase initialization error", error);
  }
}

export default async function handler(req, res) {
  // Définir l'en-tête comme XML
  res.setHeader('Content-Type', 'application/xml');
  
  try {
    // Récupérer les films populaires de TMDB pour les pages de détails
    const popularMovies = Fetching('/movie/popular') || [];
    
    // Récupérer les films les mieux notés
    const topRatedMovies = Fetching('/movie/top_rated') || [];
    
    // Combiner les films sans doublons
    const allMovies = [...popularMovies];
    topRatedMovies.forEach(movie => {
      if (!allMovies.some(m => m.id === movie.id)) {
        allMovies.push(movie);
      }
    });
    
    // Récupérer jusqu'à 50 utilisateurs publics de Firebase
    let publicUsers = [];
    try {
      const userQuery = query(
        collection(db, 'users'), 
        where('profilePublic', '==', true),
        limit(50)
      );
      const userDocs = await getDocs(userQuery);
      
      userDocs.forEach(doc => {
        publicUsers.push({
          id: doc.id,
          lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
        });
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      // Continuer sans les utilisateurs en cas d'erreur
    }
    
    // Générer le XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // URL de base
    const domain = 'https://my-cineapp.vercel.app';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Pages principales basées sur vos routes exactes
    const mainPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/about', changefreq: 'monthly', priority: '0.6' },
      { url: '/contact', changefreq: 'monthly', priority: '0.6' },
      { url: '/search', changefreq: 'daily', priority: '0.8' }
    ];
    
    // Pages d'authentification (avec priorité basse car pas intéressantes pour SEO)
    const authPages = [
      { url: '/login', changefreq: 'monthly', priority: '0.3' },
      { url: '/register', changefreq: 'monthly', priority: '0.3' }
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
    
    // Ajouter les pages d'authentification
    authPages.forEach(page => {
      xml += `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });
    
    // Ajouter les détails des films
    allMovies.forEach(movie => {
      xml += `  <url>
    <loc>${domain}/movie/${movie.id}</loc>
    <lastmod>${movie.release_date || currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });
    
    // Ajouter les salles de cinéma si elles existent dans le JSON
    if (sallesCinema && Array.isArray(sallesCinema)) {
      sallesCinema.forEach(salle => {
        const salleId = salle.id || salle._id;
        if (salleId) {
          xml += `  <url>
    <loc>${domain}/cinema/${salleId}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
        }
      });
    }
    
    // Fermer le XML
    xml += '</urlset>';
    
    // Renvoyer le XML
    res.status(200).send(xml);
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    
    // Générer un sitemap minimal en cas d'erreur avec vos routes exactes
    let fallbackXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    fallbackXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Pages essentielles en cas d'erreur
    const essentialPages = ['/', '/about', '/contact', '/search'];
    const currentDate = new Date().toISOString().split('T')[0];
    
    essentialPages.forEach(page => {
      fallbackXml += `  <url>
    <loc>https://my-cineapp.vercel.app${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '/' ? '1.0' : '0.7'}</priority>
  </url>\n`;
    });
    
    fallbackXml += '</urlset>';
    
    res.status(200).send(fallbackXml);
  }
}