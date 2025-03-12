// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import HorizontalScrollCard from '../components/HorizontalScollCard';
// import { useGenres } from '../hooks/useGenres';

// const ExplorePage = () => {
//   const [moviesByGenre, setMoviesByGenre] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { genres } = useGenres();

//   useEffect(() => {
//     const fetchMoviesByGenre = async (genreId) => {
//       try {
//         const response = await axios.get(
//           `/discover/movie?with_genres=${genreId}&language=fr-FR`
//         );
//         return { genreId, movies: response.data.results };
//       } catch (err) {
//         console.error(`Erreur pour le genre ${genreId}:`, err);
//         return { genreId, movies: [] };
//       }
//     };

//     const getMoviesData = async () => {
//       if (genres.length === 0) return;
      
//       setLoading(true);
      
//       try {
//         // Créer une promesse pour chaque genre
//         const requests = genres.map(genre => fetchMoviesByGenre(genre.id));
//         const results = await Promise.all(requests);
        
//         // Organiser les résultats par genre
//         const genreMovies = {};
//         results.forEach(result => {
//           const genre = genres.find(g => g.id === result.genreId);
//           if (genre) {
//             genreMovies[genre.name] = result.movies;
//           }
//         });
        
//         setMoviesByGenre(genreMovies);
//       } catch (err) {
//         setError('Erreur lors du chargement des films');
//         console.error('Erreur globale:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getMoviesData();
//   }, [genres]);

//   if (loading) {
//     return <div className="flex flex-col items-center justify-center h-screen text-amber-600">Chargement...</div>;
//   }

//   if (error) {
//     return <div className="flex flex-col items-center justify-center h-screen text-amber-600">{error}</div>;
//   }

//   return (
//     <div className="mt-28 w-[80%] mx-auto">
//       {Object.keys(moviesByGenre).map((genreName) => (
//         <HorizontalScrollCard
//           key={genreName}
//           data={moviesByGenre[genreName]}
//           heading={`${genreName}`}
//           click={true}
//           link={`/genre/${genres.find(genre => genre.name === genreName)?.id}`}
//         />
//       ))}
//     </div>
//   );
// };

// export default ExplorePage;

import { useEffect, useState } from 'react';
import axios from 'axios';
import HorizontalScrollCard from '../components/HorizontalScollCard';
import { useGenres } from '../hooks/useGenres';

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
      if (genres.length === 0) return;
      
      setLoading(true);
      
      try {
        // Créer une promesse pour chaque genre
        const requests = genres.map(genre => fetchMoviesByGenre(genre.id));
        const results = await Promise.all(requests);
        
        // Organiser les résultats par genre
        const genreMovies = {};
        results.forEach(result => {
          const genre = genres.find(g => g.id === result.genreId);
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

    // Fonction pour gérer l'affichage du bouton de retour en haut
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    // Ajouter l'écouteur d'événements
    window.addEventListener('scroll', handleScroll);

    // Nettoyage de l'écouteur d'événements
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [genres]);

  // Fonction pour créer un ID d'ancrage à partir du nom du genre
  const createAnchorId = (genreName) => {
    return genreName
      .toLowerCase()
      .replace(/[^\w\s]/gi, '') // Enlever les caractères spéciaux
      .replace(/\s+/g, '-'); // Remplacer les espaces par des tirets
  };

  // Fonction pour faire défiler vers une ancre
  const scrollToAnchor = (anchorId) => {
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-screen text-amber-600">Chargement...</div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-screen text-amber-600">{error}</div>;
  }

  const genreNames = Object.keys(moviesByGenre);

  return (
    <div className="mt-20 w-[90%] mx-auto relative">
      {/* Boutons d'ancrage pour chaque genre */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 py-3 px-2 my-6 rounded-lg shadow-md">
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {genreNames.map((genreName) => (
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
            link={`/genre/${genres.find(genre => genre.name === genreName)?.id}`}
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