import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache pour 1 heure

const axiosInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000, // 10 secondes
});

async function fetchMoviesByCategory(category, page = 1, maxPages = 3) {
  const results = [];
  let currentPage = page;
  
  const apiToken = process.env.VITE_API_TOKEN;
  if (!apiToken) {
    throw new Error('API Token non défini');
  }
  
  while (currentPage <= maxPages) {
    try {
      const response = await axiosInstance.get(category.path, {
        headers: { 'Authorization': `Bearer ${apiToken}` },
        params: { language: 'fr-FR', page: currentPage, region: 'FR' }
      });

      const movies = response.data.results || [];
      if (movies.length === 0) break;

      movies.forEach(movie => (movie.category = category.name));
      results.push(...movies);

      if (currentPage >= response.data.total_pages) break;
      currentPage++;
    } catch (error) {
      console.error(`Erreur catégorie ${category.name}, page ${currentPage}:`, error.message);
      break;
    }
  }
  
  return results;
}

async function fetchGenres() {
  const apiToken = process.env.VITE_API_TOKEN;
  if (!apiToken) {
    throw new Error('API Token non défini');
  }

  try {
    const response = await axiosInstance.get('/genre/movie/list', {
      headers: { 'Authorization': `Bearer ${apiToken}` },
      params: { language: 'fr-FR' }
    });
    
    return response.data.genres || [];
  } catch (error) {
    console.error('Erreur récupération genres:', error.message);
    return [];
  }
}

export default async function handler(req, res) {
  console.log('Début de la génération du sitemap');

  const cachedSitemap = cache.get('sitemap');
  if (cachedSitemap) {
    console.log('Utilisation du sitemap en cache');
    res.setHeader('Content-Type', 'application/xml');
    return res.status(200).send(cachedSitemap);
  }

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  try {
    const categories = [
      { path: '/movie/popular', name: 'popular' },
      { path: '/movie/top_rated', name: 'top-rated' },
      { path: '/movie/upcoming', name: 'upcoming' },
      { path: '/movie/now_playing', name: 'now-playing' },
      { path: '/trending/movie/week', name: 'trending' }
    ];

    const [genresData, moviesData] = await Promise.all([
      fetchGenres(),
      Promise.all(categories.map(category => fetchMoviesByCategory(category)))
    ]);

    const allMovies = moviesData.flat();
    const uniqueMovieIds = new Set();
    const domain = 'https://nextmoviez.vercel.app';
    const currentDate = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const mainPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      // { url: '/movies', changefreq: 'daily', priority: '0.9' },
      { url: '/search', changefreq: 'daily', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.6' },
      { url: '/about', changefreq: 'monthly', priority: '0.5' }
    ];

    mainPages.forEach(page => {
      xml += `  <url>
    <loc>${domain}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });

    categories.forEach(category => {
      xml += `  <url>
    <loc>${domain}/movies/${category.name}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
    });

    genresData.forEach(genre => {
      xml += `  <url>
    <loc>${domain}/genre/${genre.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });

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

    xml += '</urlset>';
    
    console.log('XML généré :', xml.substring(0, 500) + '...'); // Affiche les 500 premiers caractères
    
    cache.set('sitemap', xml);
    res.status(200).send(xml);
  } catch (error) {
    console.error('Erreur génération sitemap:', error.message);
    res.status(500).send('Erreur de génération du sitemap');
  }
}

