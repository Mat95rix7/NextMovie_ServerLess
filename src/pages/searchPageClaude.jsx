// import React, { useState, useEffect } from 'react';
// // import { Card } from '@/components/ui/card';
// // import { Input } from '@/components/ui/input';
// // import { Select } from '@/components/ui/select';
// // import { Button } from '@/components/ui/button';
// import { Star, Calendar, ThumbsUp, Search, Clock } from 'lucide-react';
// // import { Slider } from '@/components/ui/slider';

// const MovieFilter = () => {
//   const [movies, setMovies] = useState([]);
//   const [genres, setGenres] = useState([]);
//   const [selectedGenre, setSelectedGenre] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);
//   const [sortBy, setSortBy] = useState('popularity.desc');
//   const [durationRange, setDurationRange] = useState([0, 300]); // en minutes
  
//   const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZGM5NDE1ZDRhYmEyNDFlMTExMTc4NjMyMjcyNmIzMyIsIm5iZiI6MTczMzIzNDQxMC4xNTEsInN1YiI6IjY3NGYwZWVhYWY4OWVkNzYyMzdkZmRjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kP0CJtPVcZ1vkKfUSD5NNp_ZQKXCm8CjMjugUlNqrD0'
  
//   const BASE_URL = 'https://api.themoviedb.org/3';

//   const options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       Authorization: `Bearer ${TMDB_API_KEY}`,
//     },
//   };

//   const handleGenreChange = (genreId) => {
//     setSelectedGenre(genreId);
//     setCurrentPage(1);
//     setSearchQuery('');
//     fetchMovies();
//   };

//   const handleSortChange = (value) => {
//     setSortBy(value);
//     setCurrentPage(1);
//   };
  
//   useEffect(() => {
//     fetchGenres();
//     fetchMovies();
//   }, [currentPage, sortBy, durationRange]);

//   const fetchGenres = async () => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/genre/movie/list?&language=fr-FR`, options
//       );
//       const data = await response.json();
//       setGenres(data.genres);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des genres:', error);
//     }
//   };

//   const fetchMovies = async () => {
//     setLoading(true);
//     try {
//       let url;
//       if (searchQuery) {
//         url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${searchQuery}&page=${currentPage}`;
//       } else {
//         url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=fr-FR&sort_by=${sortBy}&page=${currentPage}${
//           selectedGenre ? `&with_genres=${selectedGenre}` : ''
//         }&with_runtime.gte=${durationRange[0]}&with_runtime.lte=${durationRange[1]}`;
//       }
      
//       const response = await fetch(url);
//       const data = await response.json();
//       setMovies(data.results);
//       setTotalPages(data.total_pages);
//       setLoading(false);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des films:', error);
//       setLoading(false);
//     }
//   };

//   const handleDurationChange = (newRange) => {
//     setDurationRange(newRange);
//     setCurrentPage(1);
//   };

//   const formatDuration = (minutes) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h${mins.toString().padStart(2, '0')}`;
//   };

//   const MovieCard = ({ movie }) => {
//     const [movieDetails, setMovieDetails] = useState(null);

//     useEffect(() => {
//       const fetchMovieDetails = async () => {
//         try {
//           const response = await fetch(
//             `${BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=fr-FR`
//           );
//           const data = await response.json();
//           setMovieDetails(data);
//         } catch (error) {
//           console.error('Erreur lors de la récupération des détails:', error);
//         }
//       };

//       fetchMovieDetails();
//     }, [movie.id]);

//     return (
//       <card className="p-4 flex flex-col">
//         <div className="relative">
//           <img
//             src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//             alt={movie.title}
//             className="w-full h-64 object-cover rounded-lg mb-2"
//           />
//           <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg flex items-center">
//             <Star className="w-4 h-4 text-yellow-400 mr-1" />
//             {movie.vote_average.toFixed(1)}
//           </div>
//         </div>
//         <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
//         <div className="flex items-center text-sm text-gray-600 mb-2">
//           <Calendar className="w-4 h-4 mr-1" />
//           {movie.release_date ? new Date(movie.release_date).toLocaleDateString('fr-FR') : 'Date inconnue'}
//         </div>
//         {movieDetails && movieDetails.runtime && (
//           <div className="flex items-center text-sm text-gray-600 mb-2">
//             <Clock className="w-4 h-4 mr-1" />
//             {formatDuration(movieDetails.runtime)}
//           </div>
//         )}
//         <div className="flex items-center text-sm text-gray-600 mb-2">
//           <ThumbsUp className="w-4 h-4 mr-1" />
//           {movie.vote_count} votes
//         </div>
//         <p className="text-sm flex-grow">{movie.overview ? (
//           movie.overview.length > 150 ? `${movie.overview.slice(0, 150)}...` : movie.overview
//         ) : 'Aucune description disponible'}</p>
//         <div className="mt-2 flex flex-wrap gap-1">
//           {genres
//             .filter(genre => movie.genre_ids.includes(genre.id))
//             .map(genre => (
//               <span 
//                 key={genre.id}
//                 className="text-xs bg-gray-100 rounded-full px-2 py-1"
//               >
//                 {genre.name}
//               </span>
//             ))
//           }
//         </div>
//       </card>
//     );
//   };

//   return (
//     <div className="p-4 max-w-7xl mx-auto">
//       <div className="mb-6 space-y-4">
//         {/* Barre de recherche */}
//         <form onSubmit={(e) => { e.preventDefault(); fetchMovies(); }} className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Rechercher un film..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="flex-grow"
//           />
//           <button type="submit">
//             <Search className="w-4 h-4 mr-2" />
//             Rechercher
//           </button>
//         </form>

//         <div className="flex flex-col sm:flex-row gap-4">
//           {/* Sélection du genre */}
//           <select
//             className="p-2 border rounded-lg flex-grow"
//             onChange={(e) => handleGenreChange(e.target.value)}
//             value={selectedGenre}
//           >
//             <option value="">Tous les genres</option>
//             {genres.map((genre) => (
//               <option key={genre.id} value={genre.id}>
//                 {genre.name}
//               </option>
//             ))}
//           </select>

//           {/* Tri */}
//           <select
//             className="p-2 border rounded-lg flex-grow"
//             onChange={(e) => handleSortChange(e.target.value)}
//             value={sortBy}
//           >
//             <option value="popularity.desc">Les plus populaires</option>
//             <option value="vote_average.desc">Les mieux notés</option>
//             <option value="release_date.desc">Les plus récents</option>
//             <option value="release_date.asc">Les plus anciens</option>
//           </select>
//         </div>

//         {/* Filtrage par durée */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium">
//             Durée : {formatDuration(durationRange[0])} - {formatDuration(durationRange[1])}
//           </label>
//           {/* <Slider
//             defaultValue={[0, 300]}
//             min={0}
//             max={300}
//             step={15}
//             value={durationRange}
//             onValueChange={handleDurationChange}
//             className="w-full"
//           /> */}
//         </div>
//       </div>

//       {/* Liste des films */}
//       {loading ? (
//         <div className="text-center py-8">Chargement...</div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {movies.map((movie) => (
//               <MovieCard key={movie.id} movie={movie} />
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="mt-6 flex justify-center gap-2">
//             <button 
//               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//             >
//               Précédent
//             </button>
//             <span className="py-2 px-4">
//               Page {currentPage} sur {totalPages}
//             </span>
//             <button 
//               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//             >
//               Suivant
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default MovieFilter;
import React, { useState, useEffect } from 'react';
import { Search, Star, Calendar, Clock, ThumbsUp } from 'lucide-react';

const MovieFilter = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [durationRange, setDurationRange] = useState([0, 300]);


  const BASE_URL = 'https://api.themoviedb.org/3';
  const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZGM5NDE1ZDRhYmEyNDFlMTExMTc4NjMyMjcyNmIzMyIsIm5iZiI6MTczMzIzNDQxMC4xNTEsInN1YiI6IjY3NGYwZWVhYWY4OWVkNzYyMzdkZmRjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kP0CJtPVcZ1vkKfUSD5NNp_ZQKXCm8CjMjugUlNqrD0'
  
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  };


  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, [currentPage, sortBy, durationRange]);

  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/genre/movie/list?language=fr-FR`, options
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Erreur lors de la récupération des genres:', error);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let url;
      if (searchQuery) {
        url = `${BASE_URL}/search/movie?&language=fr-FR&query=${searchQuery}&page=${currentPage}`;
      } else {
        url = `${BASE_URL}/discover/movie?&language=fr-FR&sort_by=${sortBy}&page=${currentPage}${
          selectedGenre ? `&with_genres=${selectedGenre}` : ''
        }&with_runtime.gte=${durationRange[0]}&with_runtime.lte=${durationRange[1]}`;
      }
      
      const response = await fetch(url, options);
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des films:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies();
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
    setSearchQuery('');
    fetchMovies();
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.id === 'minDuration') {
      setDurationRange([value, durationRange[1]]);
    } else {
      setDurationRange([durationRange[0], value]);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const MovieCard = ({ movie }) => {
    const [movieDetails, setMovieDetails] = useState(null);

    useEffect(() => {
      const fetchMovieDetails = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/movie/${movie.id}?&language=fr-FR`, options
          );
          const data = await response.json();
          setMovieDetails(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des détails:', error);
        }
      };

      fetchMovieDetails();
    }, [movie.id]);

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            {movie.release_date ? new Date(movie.release_date).toLocaleDateString('fr-FR') : 'Date inconnue'}
          </div>
          {movieDetails && movieDetails.runtime && (
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(movieDetails.runtime)}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {movie.vote_count} votes
          </div>
          <p className="text-sm text-gray-700">
            {movie.overview ? (
              movie.overview.length > 150 ? `${movie.overview.slice(0, 150)}...` : movie.overview
            ) : 'Aucune description disponible'}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {genres
              .filter(genre => movie.genre_ids.includes(genre.id))
              .map(genre => (
                <span 
                  key={genre.id}
                  className="text-xs bg-gray-100 rounded-full px-2 py-1"
                >
                  {genre.name}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-10 p-4 max-w-7xl mx-auto">
      <div className="mb-6 space-y-4">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Sélection du genre */}
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleGenreChange(e.target.value)}
            value={selectedGenre}
          >
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>

          {/* Tri */}
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleSortChange(e.target.value)}
            value={sortBy}
          >
            <option value="popularity.desc">Les plus populaires</option>
            <option value="vote_average.desc">Les mieux notés</option>
            <option value="release_date.desc">Les plus récents</option>
            <option value="release_date.asc">Les plus anciens</option>
          </select>
        </div>

        {/* Filtrage par durée */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Durée : {formatDuration(durationRange[0])} - {formatDuration(durationRange[1])}
          </label>
          <div className="flex gap-4">
            <input
              type="range"
              id="minDuration"
              min="0"
              max="300"
              step="15"
              value={durationRange[0]}
              onChange={handleDurationChange}
              className="w-full"
            />
            <input
              type="range"
              id="maxDuration"
              min="0"
              max="300"
              step="15"
              value={durationRange[1]}
              onChange={handleDurationChange}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Liste des films */}
      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Précédent
            </button>
            <span className="py-2 px-4">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieFilter;