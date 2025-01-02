import { useState, useMemo } from 'react';

export function useMovieFilters(initialMovies) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRuntime, setMinRuntime] = useState(0);
  const [maxRuntime, setMaxRuntime] = useState(240);
  const [minRating, setMinRating] = useState(0);
  const [isRecent, setIsRecent] = useState(false);

  const filteredMovies = useMemo(() => {
    return initialMovies.filter((movie) => {
      const matchesGenres = selectedGenres.length === 0 || 
        movie.genre_ids.some(id => selectedGenres.includes(id));
      
      const matchesRuntime = movie.runtime >= minRuntime && 
        movie.runtime <= maxRuntime;
      
      const matchesRating = movie.vote_average >= minRating;

      const releaseDate = new Date(movie.release_date);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const matchesRecent = !isRecent || releaseDate >= oneYearAgo;

      return matchesGenres && matchesRuntime && matchesRating && matchesRecent;
    });
  }, [initialMovies, selectedGenres, minRuntime, maxRuntime, minRating, isRecent]);

  return {
    filters: {
      selectedGenres,
      minRuntime,
      maxRuntime,
      minRating,
      isRecent,
    },
    setSelectedGenres,
    setMinRuntime,
    setMaxRuntime,
    setMinRating,
    setIsRecent,
    filteredMovies,
  };
}