// sitemap.js
import axios from 'axios';

export function generateSitemapXSL() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:template match="/">
    <html>
      <head>
        <title>Sitemap</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Sitemap</h1>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Change Frequency</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="urlset/url">
              <tr>
                <td><a href="{loc}"><xsl:value-of select="loc"/></a></td>
                <td><xsl:value-of select="lastmod"/></td>
                <td><xsl:value-of select="changefreq"/></td>
                <td><xsl:value-of select="priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
}

export async function generateSitemap() {
  try {
    // Vérifier que les variables d'environnement sont disponibles
    if (!import.meta.env.VITE_API_TOKEN) {
      console.warn('VITE_API_TOKEN non défini. Certaines fonctionnalités peuvent être limitées.');
    }
    
    // Définir les catégories
    const categories = [
      { path: '/movie/popular', name: 'popular' },
      { path: '/movie/top_rated', name: 'top-rated' },
      { path: '/movie/upcoming', name: 'upcoming' },
      { path: '/movie/now_playing', name: 'now-playing' },
      { path: '/trending/movie/week', name: 'trending' }
    ];
    
    // Récupérer les données
    const [genresData, moviesData] = await Promise.all([
      fetchGenres(),
      Promise.all(categories.map(category => fetchMoviesByCategory(category)))
    ]);
    
    // Traiter les résultats
    const allMovies = moviesData.flat();
    const uniqueMovieIds = new Set();
    
    // Générer le XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const domain = 'https://my-cineapp.vercel.app';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Pages principales
    const mainPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/movies', changefreq: 'daily', priority: '0.9' },
      { url: '/search', changefreq: 'daily', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.6' },
      { url: '/about', changefreq: 'monthly', priority: '0.5' },
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
    
    // Fermer le XML
    xml += '</urlset>';
    
    return xml;
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    
    // Générer un sitemap minimal en cas d'erreur
    return generateFallbackSitemap();
  }
}

function generateFallbackSitemap() {
  let fallbackXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  fallbackXml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
  fallbackXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Pages essentielles pour le fallback
  const essentialPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/movies', changefreq: 'daily', priority: '0.9' },
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
  
  return fallbackXml;
}

// Fonctions de récupération des données (à adapter de votre code existant)
async function fetchMoviesByCategory(category, page = 1, maxPages = 3) {
  const results = [];
  let currentPage = page;
  
  const apiToken = import.meta.env.VITE_API_TOKEN;
  
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

async function fetchGenres() {
  try {
    const apiToken = import.meta.env.VITE_API_TOKEN;
    
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