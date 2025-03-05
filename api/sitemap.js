import axios from 'axios';

async function fetchMoviesByCategory(category, page = 1, maxPages = 3) {
  const results = [];
  let currentPage = page;
  
  const apiToken = process.env.VITE_API_TOKEN;
  
  while (currentPage <= maxPages) {
    try {
      const response = await axios.get(category.path, {
        baseURL: 'https://api.themoviedb.org/3',
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
      console.error(`Erreur catégorie ${category.name}, page ${currentPage}:`, error);
      break;
    }
  }
  
  return results;
}

async function fetchGenres() {
  try {
    const response = await axios.get('/genre/movie/list', {
      baseURL: 'https://api.themoviedb.org/3',
      headers: { 'Authorization': `Bearer ${process.env.VITE_API_TOKEN}` },
      params: { language: 'fr-FR' }
    });
    
    return response.data.genres || [];
  } catch (error) {
    console.error('Erreur récupération genres:', error);
    return [];
  }
}

export default async function handler(req, res) {
  // Important : définir le bon content-type
  res.setHeader('Content-Type', 'application/xml');
  
  // Optionnel : mettre en cache pour réduire les appels API
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
    const domain = 'https://my-cineapp.vercel.app';
    const currentDate = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const mainPages = [
      { url: '/', changefreq: 'daily', priority: '1.0' },
      { url: '/movies', changefreq: 'daily', priority: '0.9' },
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
    
    res.status(200).send(xml);
  } catch (error) {
    console.error('Erreur génération sitemap:', error);
    res.status(500).send('Erreur de génération du sitemap');
  }
}