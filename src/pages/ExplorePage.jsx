// import { useEffect, useState, useMemo, useCallback } from 'react';
// import axios from 'axios';
// import HorizontalScrollCard from '../components/HorizontalScollCard';
// import { Helmet } from 'react-helmet-async';
// import genres from '../data/genres.json';

// const ExplorePage = () => {
//   const [moviesByGenre, setMoviesByGenre] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showScrollTop, setShowScrollTop] = useState(false);

//   useEffect(() => {
//     const fetchMoviesByGenre = async (genreId) => {
//       try {
//         const response = await axios.get(`/api/movies/discover`, {
//           params: { genreId }
//       });
//         return { genreId, movies: response.data.results };
//       } catch (err) {
//         console.error(`Erreur pour le genre ${genreId}:`, err);
//         return { genreId, movies: [] };
//       }
//     };

//     const getMoviesData = async () => {
//       if (genres.length === 0 || Object.keys(moviesByGenre).length > 0) return;

//       setLoading(true);
      
//       try {
//         const requests = genres.map((genre) => fetchMoviesByGenre(genre.id));
//         const results = await Promise.all(requests);

//         const genreMovies = {};
//         results.forEach((result) => {
//           const genre = genres.find((g) => g.id === result.genreId);
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

//     const handleScroll = () => {
//       setShowScrollTop(window.scrollY > 300);
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [genres, moviesByGenre]);

//   // Utilisation de useMemo pour éviter les recalculs inutiles
//   const genreNames = useMemo(() => Object.keys(moviesByGenre), [moviesByGenre]);

//   const topGenres = useMemo(
//     () => ["Action", "Animation", "Comédie", "Drame", "Familial", "Fantastique", "Horreur", "Thriller"],
//     []
//   );

//   // Fonction pour créer un ID d'ancrage à partir du nom du genre
//   const createAnchorId = (genreName) => {
//     return genreName
//       .toLowerCase()
//       .replace(/[^\w\s]/gi, '') // Enlever les caractères spéciaux
//       .replace(/\s+/g, '-'); // Remplacer les espaces par des tirets
//   };

//   // Fonction optimisée pour faire défiler vers une ancre avec un léger délai
//   const scrollToAnchor = useCallback((anchorId) => {
//     setTimeout(() => {
//       const element = document.getElementById(anchorId);
//       if (element) {
//         const yOffset = -150;
//         const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
//         window.scrollTo({ top: y, behavior: "smooth" });
//       }
//     }, 100);
//   }, []);

//   // Fonction optimisée pour remonter en haut de la page
//   const scrollToTop = useCallback(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   if (loading) {
//     return <div className="flex flex-col items-center justify-center h-screen text-amber-600">Chargement...</div>;
//   }

//   if (error) {
//     return <div className="flex flex-col items-center justify-center h-screen text-amber-600">{error}</div>;
//   }

//   return (
//     <div className="mt-20 w-[80%] min-w-[320px] mx-auto relative">
//       <Helmet>
//         <title>Explorer les films par genre - NextMovie</title>
//         <meta name="description" content="Découvrez des films organisés par genre. Explorez une vaste sélection d'actions, d'animations, de comédies et plus encore." />
//         <meta name="keywords" content="films, genre, action, animation, comédie, drame, fantastique, horreur, thriller" />
//         <meta name="author" content="Mat95rix7" />
//         <meta property="og:title" content="Explorer les films par genre" />
//         <meta property="og:description" content="Découvrez des films organisés par genre. Explorez une vaste sélection d'actions, d'animations, de comédies et plus encore." />
//         <meta property="og:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
//         <meta property="og:url" content="https://nextmoviez.vercel.app/explore" />
//       </Helmet>
//       {/* Boutons d'ancrage pour chaque genre */}
//       <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 py-3 px-2 my-6 rounded-lg shadow-md">
//         <div className="flex flex-wrap justify-center gap-[clamp(1rem,1vw,2rem)]">
//           {topGenres.map((genreName) => (
//             <button
//               key={`anchor-${genreName}`}
//               onClick={() => scrollToAnchor(createAnchorId(genreName))}
//               className="px-4 py-2 text-sm whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-colors flex-shrink-0"
//             >
//               {genreName}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Contenu par genre */}
//       {genreNames.map((genreName) => (
//         <div 
//           key={genreName} 
//           id={createAnchorId(genreName)}
//           className="scroll-mt-28"
//         >
//           <HorizontalScrollCard
//             data={moviesByGenre[genreName]}
//             heading={`${genreName}`}
//             click={true}
//             link={`/genre/${genres.find((genre) => genre.name === genreName)?.id}`}
//           />
//         </div>
//       ))}

//       {/* Bouton pour remonter en haut */}
//       {showScrollTop && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-6 right-6 w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-50"
//           aria-label="Remonter en haut"
//         >
//           <svg 
//             xmlns="http://www.w3.org/2000/svg" 
//             className="h-6 w-6" 
//             fill="none" 
//             viewBox="0 0 24 24" 
//             stroke="currentColor"
//           >
//             <path 
//               strokeLinecap="round" 
//               strokeLinejoin="round" 
//               strokeWidth="2" 
//               d="M5 15l7-7 7 7" 
//             />
//           </svg>
//         </button>
//       )}
//     </div>
//   );
// };

// export default ExplorePage;

// // import { useEffect, useState, useMemo, useCallback } from 'react';
// // import axios from 'axios';
// // import HorizontalScrollCard from '../components/HorizontalScollCard';
// // import { Helmet } from 'react-helmet-async';
// // import genres from '../data/genres.json';

// // const ExplorePage = () => {
// //   const [moviesByGenre, setMoviesByGenre] = useState({});
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [showScrollTop, setShowScrollTop] = useState(false);
// //   const [expandedGenre, setExpandedGenre] = useState(null);

// //   // Définir les genres les plus populaires
// //   const topGenres = useMemo(
// //     () => ["Action", "Animation", "Comédie", "Drame", "Familial", "Fantastique", "Horreur", "Thriller"],
// //     []
// //   );

// //   // Fonction pour récupérer les films d'un genre spécifique
// //   const fetchMoviesByGenre = useCallback(async (genreName) => {
// //     setLoading(true);
    
// //     try {
// //       const genre = genres.find((g) => g.name === genreName);
// //       if (!genre) {
// //         throw new Error(`Genre ${genreName} non trouvé`);
// //       }
      
// //       const response = await axios.get(`/api/movies/discover`, {
// //         params: { genreId: genre.id }
// //       });
      
// //       setMoviesByGenre(prev => ({
// //         ...prev,
// //         [genreName]: response.data.results
// //       }));
      
// //       setError(null);
// //     } catch (err) {
// //       console.error(`Erreur pour le genre ${genreName}:`, err);
// //       setError(`Erreur lors du chargement des films pour ${genreName}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   // Effet pour charger les films du premier genre par défaut
// //   useEffect(() => {
// //     if (topGenres.length > 0 && !expandedGenre) {
// //       const defaultGenre = topGenres[0];
// //       setExpandedGenre(defaultGenre);
// //       fetchMoviesByGenre(defaultGenre);
// //     }
// //   }, [topGenres, fetchMoviesByGenre, expandedGenre]);

// //   // Effet pour gérer le bouton de retour en haut de page
// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setShowScrollTop(window.scrollY > 300);
// //     };

// //     window.addEventListener('scroll', handleScroll);

// //     return () => {
// //       window.removeEventListener('scroll', handleScroll);
// //     };
// //   }, []);

// //   // Fonction pour gérer le clic sur un genre
// //   const handleGenreClick = useCallback((genreName) => {
// //     // Si le genre est déjà ouvert, le fermer
// //     if (expandedGenre === genreName) {
// //       setExpandedGenre(null);
// //       return;
// //     }
    
// //     // Ouvrir le nouveau genre
// //     setExpandedGenre(genreName);
    
// //     // Charger les films si ce n'est pas déjà fait
// //     if (!moviesByGenre[genreName]) {
// //       fetchMoviesByGenre(genreName);
// //     }
// //   }, [expandedGenre, moviesByGenre, fetchMoviesByGenre]);

// //   // Fonction pour remonter en haut de la page
// //   const scrollToTop = useCallback(() => {
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   }, []);

// //   return (
// //     <div className="mt-20 w-[80%] min-w-[320px] mx-auto relative">
// //       <Helmet>
// //         <title>Explorer les films par genre - NextMovie</title>
// //         <meta name="description" content="Découvrez des films organisés par genre. Explorez une vaste sélection d'actions, d'animations, de comédies et plus encore." />
// //         <meta name="keywords" content="films, genre, action, animation, comédie, drame, fantastique, horreur, thriller" />
// //         <meta name="author" content="Mat95rix7" />
// //         <meta property="og:title" content="Explorer les films par genre" />
// //         <meta property="og:description" content="Découvrez des films organisés par genre. Explorez une vaste sélection d'actions, d'animations, de comédies et plus encore." />
// //         <meta property="og:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
// //         <meta property="og:url" content="https://nextmoviez.vercel.app/explore" />
// //       </Helmet>

// //       <h1 className="text-2xl font-bold text-center mb-8 text-amber-600">Explorer par genre</h1>

// //       {/* Liste des genres avec style dropdown */}
// //       <div className="space-y-4">
// //         {topGenres.map((genreName) => (
// //           <div key={genreName} className="rounded-lg overflow-hidden">
// //             {/* En-tête du dropdown */}
// //             <button
// //               onClick={() => handleGenreClick(genreName)}
// //               className="w-full px-4 py-3 text-white font-medium flex justify-between items-center transition-colors"
// //             >
// //               <span>{genreName}</span>
// //               <svg
// //                 xmlns="http://www.w3.org/2000/svg"
// //                 className={`h-5 w-5 transition-transform ${expandedGenre === genreName ? 'transform rotate-180' : ''}`}
// //                 fill="none"
// //                 viewBox="0 0 24 24"
// //                 stroke="currentColor"
// //               >
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
// //               </svg>
// //             </button>

// //             {/* Contenu du dropdown */}
// //             {expandedGenre === genreName && (
// //               <div className="p-4 bg-white dark:bg-gray-800">
// //                 {loading ? (
// //                   <div className="flex justify-center py-8 text-amber-600">Chargement...</div>
// //                 ) : error ? (
// //                   <div className="flex justify-center py-8 text-red-600">{error}</div>
// //                 ) : moviesByGenre[genreName] ? (
// //                   <HorizontalScrollCard
// //                     data={moviesByGenre[genreName]}
// //                     heading={`Films ${genreName}`}
// //                     click={true}
// //                     link={`/genre/${genres.find((genre) => genre.name === genreName)?.id}`}
// //                   />
// //                 ) : (
// //                   <div className="flex justify-center py-8 text-amber-600">Aucun film trouvé</div>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>

// //       {/* Bouton pour remonter en haut */}
// //       {showScrollTop && (
// //         <button
// //           onClick={scrollToTop}
// //           className="fixed bottom-6 right-6 w-12 h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-50"
// //           aria-label="Remonter en haut"
// //         >
// //           <svg 
// //             xmlns="http://www.w3.org/2000/svg" 
// //             className="h-6 w-6" 
// //             fill="none" 
// //             viewBox="0 0 24 24" 
// //             stroke="currentColor"
// //           >
// //             <path 
// //               strokeLinecap="round" 
// //               strokeLinejoin="round" 
// //               strokeWidth="2" 
// //               d="M5 15l7-7 7 7" 
// //             />
// //           </svg>
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default ExplorePage;

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';
import HorizontalScrollCard from '../components/HorizontalScollCard';
import { Helmet } from 'react-helmet-async';
import genres from '../data/genres.json';

// Constants
const SCROLL_THRESHOLD = 300;
const SCROLL_OFFSET = -150;
const CACHE_TIME = 1000 * 60 * 5; // 5 minutes
const STALE_TIME = 1000 * 60 * 2; // 2 minutes
const INITIAL_LOAD_COUNT = 5; // Nombre de genres à charger initialement

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: CACHE_TIME,
      staleTime: STALE_TIME,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1
    },
  },
});

// Wrapper component for React Query
const ExplorePageWrapper = () => (
  <QueryClientProvider client={queryClient}>
    <ExplorePage />
  </QueryClientProvider>
);

const ExplorePage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const queryClient = useQueryClient();
  const visibleGenresRef = useRef(new Set());
  const observerRef = useRef(null);

  // Définir les genres les plus populaires
  const topGenres = useMemo(
    () => ["Action", "Animation", "Comédie", "Drame", "Familial", "Fantastique", "Horreur", "Thriller"],
    []
  );

  // Memoize genre names
  const genreNames = useMemo(() => 
    genres.map(genre => genre.name).sort((a, b) => a.localeCompare(b)),
    []
  );

  // Fetch movies for a specific genre
  const fetchMoviesByGenre = async (genreId) => {
    const response = await axios.get(`/api/movies/discover`, {
      params: { genreId }
    });
    return response.data.results;
  };

  // Use React Query for data fetching with infinite scroll
  const { data: moviesData = {}, isLoading, error } = useQuery(
    'movies',
    async () => {
      const initialGenres = genreNames.slice(0, INITIAL_LOAD_COUNT);
      const results = await Promise.all(
        initialGenres.map(async (genreName) => {
          const genre = genres.find(g => g.name === genreName);
          if (!genre) return null;
          const movies = await fetchMoviesByGenre(genre.id);
          return { genreName, movies };
        })
      );

      return results.reduce((acc, result) => {
        if (result) {
          acc[result.genreName] = result.movies;
        }
        return acc;
      }, {});
    },
    {
      keepPreviousData: true
    }
  );

  // Intersection Observer setup for lazy loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    const handleIntersection = async (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const genreName = entry.target.dataset.genre;
          if (genreName && !visibleGenresRef.current.has(genreName)) {
            visibleGenresRef.current.add(genreName);
            const genre = genres.find(g => g.name === genreName);
            if (genre) {
              const movies = await fetchMoviesByGenre(genre.id);
              queryClient.setQueryData('movies', old => ({
                ...old,
                [genreName]: movies
              }));
            }
          }
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [queryClient]);

  // Observe genre sections
  useEffect(() => {
    const elements = document.querySelectorAll('[data-genre]');
    elements.forEach(element => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        elements.forEach(element => {
          observerRef.current.unobserve(element);
        });
      }
    };
  }, [moviesData]);

  // Optimized scroll handling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > SCROLL_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized functions
  const createAnchorId = useCallback((genreName) => (
    genreName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
  ), []);

  const scrollToAnchor = useCallback((anchorId) => {
    requestAnimationFrame(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
        <p className="mt-4 text-amber-600">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-amber-600">
        Une erreur est survenue lors du chargement des films
      </div>
    );
  }

  return (
    <div className="mt-20 w-[80%] min-w-[320px] mx-auto relative">
      <Helmet>
        <title>Explorer les films par genre - NextMovie</title>
        <meta name="description" content="Découvrez des films organisés par genre. Explorez une vaste sélection de films de tous genres." />
        <meta name="keywords" content="films, genres, cinéma, streaming" />
        <meta name="author" content="Mat95rix7" />
        <meta property="og:title" content="Explorer les films par genre" />
        <meta property="og:description" content="Découvrez des films organisés par genre. Explorez une vaste sélection de films de tous genres." />
        <meta property="og:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
        <meta property="og:url" content="https://nextmoviez.vercel.app/explore" />
      </Helmet>

      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 py-3 px-2 my-6 rounded-lg shadow-md">
        <div className="flex flex-wrap justify-center gap-[clamp(0.5rem,1vw,1rem)]">
          {topGenres.map((genreName) => (
            <button
              key={`anchor-${genreName}`}
              onClick={() => scrollToAnchor(createAnchorId(genreName))}
              className="px-3 py-1.5 text-sm whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-colors flex-shrink-0"
            >
              {genreName}
            </button>
          ))}
        </div>
      </div>

      {genreNames.map((genreName) => (
        <div 
          key={genreName} 
          id={createAnchorId(genreName)}
          data-genre={genreName}
          className="scroll-mt-28"
        >
          <HorizontalScrollCard
            data={moviesData[genreName] || []}
            heading={genreName}
            click={true}
            link={`/genre/${genres.find((genre) => genre.name === genreName)?.id}`}
          />
        </div>
      ))}

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

export default ExplorePageWrapper;