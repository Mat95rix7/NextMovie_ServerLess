import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import HorizontalScrollCard from '../components/HorizontalScollCard';
import { useGenres } from '../hooks/useGenres';
import { Helmet } from 'react-helmet-async';

const ExplorePage = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { genres } = useGenres();

  useEffect(() => {
    const fetchMoviesByGenre = async (genreId) => {
      try {
        const response = await axios.get(
          `/discover/movie?with_genres=${genreId}&language=fr-FR`
        );
        return { genreId, movies: response.data.results };
      } catch (err) {
        console.error(`Erreur pour le genre ${genreId}:`, err);
        return { genreId, movies: [] };
      }
    };

    const getMoviesData = async () => {
      if (genres.length === 0 || Object.keys(moviesByGenre).length > 0) return;

      setLoading(true);
      
      try {
        const requests = genres.map((genre) => fetchMoviesByGenre(genre.id));
        const results = await Promise.all(requests);

        const genreMovies = {};
        results.forEach((result) => {
          const genre = genres.find((g) => g.id === result.genreId);
          if (genre) {
            genreMovies[genre.name] = result.movies;
          }
        });

        setMoviesByGenre(genreMovies);
      } catch (err) {
        setError('Erreur lors du chargement des films');
        console.error('Erreur globale:', err);
      } finally {
        setLoading(false);
      }
    };

    getMoviesData();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [genres, moviesByGenre]);

  // Utilisation de useMemo pour éviter les recalculs inutiles
  const genreNames = useMemo(() => Object.keys(moviesByGenre), [moviesByGenre]);

  const topGenres = useMemo(
    () => ["Action", "Animation", "Comédie", "Drame", "Familial", "Fantastique", "Horreur", "Thriller"],
    []
  );

  // Fonction pour créer un ID d'ancrage à partir du nom du genre
  const createAnchorId = (genreName) => {
    return genreName
      .toLowerCase()
      .replace(/[^\w\s]/gi, '') // Enlever les caractères spéciaux
      .replace(/\s+/g, '-'); // Remplacer les espaces par des tirets
  };

  // Fonction optimisée pour faire défiler vers une ancre avec un léger délai
  const scrollToAnchor = useCallback((anchorId) => {
    setTimeout(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        const yOffset = -150;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  }, []);

  // Fonction optimisée pour remonter en haut de la page
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-screen text-amber-600">Chargement...</div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-screen text-amber-600">{error}</div>;
  }

  return (
    <div className="mt-20 w-[80%] min-w-[320px] mx-auto relative">
      <Helmet>
        <title>Explorer les films par genre - NextMovie</title>
        <meta name="description" content="Découvrez des films organisés par genre. Explorez une vaste sélection d'actions, d'animations, de comédies et plus encore." />
        <meta name="keywords" content="films, genre, action, animation, comédie, drame, fantastique, horreur, thriller" />
        <meta name="author" content="Mat95rix7" />
        <meta property="og:title" content="Explorer les films par genre" />
        <meta property="og:description" content="Découvrez des films organisés par genre. Explorez une vaste sélection d'actions, d'animations, de comédies et plus encore." />
        <meta property="og:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
        <meta property="og:url" content="https://nextmoviez.vercel.app/explore" />
      </Helmet>
      {/* Boutons d'ancrage pour chaque genre */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 py-3 px-2 my-6 rounded-lg shadow-md">
        <div className="flex flex-wrap justify-center gap-[clamp(1rem,1vw,2rem)]">
          {topGenres.map((genreName) => (
            <button
              key={`anchor-${genreName}`}
              onClick={() => scrollToAnchor(createAnchorId(genreName))}
              className="px-4 py-2 text-sm whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-colors flex-shrink-0"
            >
              {genreName}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu par genre */}
      {genreNames.map((genreName) => (
        <div 
          key={genreName} 
          id={createAnchorId(genreName)}
          className="scroll-mt-28"
        >
          <HorizontalScrollCard
            data={moviesByGenre[genreName]}
            heading={`${genreName}`}
            click={true}
            link={`/genre/${genres.find((genre) => genre.name === genreName)?.id}`}
          />
        </div>
      ))}

      {/* Bouton pour remonter en haut */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-50"
          aria-label="Remonter en haut"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 15l7-7 7 7" 
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ExplorePage;