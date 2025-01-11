import { useState, useMemo } from 'react';

export function useMovieFilters(movies) {
  const [filters, setFilters] = useState({
    selectedGenres: [],
    minRuntime: 0,
    maxRuntime: 240,
    minRating: 0,
    isRecent: false
  });

  const filterHandlers = {
    setSelectedGenres: (genres) => 
      setFilters(prev => ({ ...prev, selectedGenres: genres })),
    setRuntime: (min, max) => 
      setFilters(prev => ({ ...prev, minRuntime: min, maxRuntime: max })),
    setMinRating: (rating) => 
      setFilters(prev => ({ ...prev, minRating: rating })),
    setIsRecent: (isRecent) => 
      setFilters(prev => ({ ...prev, isRecent }))
  };

  const filteredMovies = useMemo(() => {
         
      if (filters.selectedGenres.length > 0) {
        movies = movies.filter((movie) =>
          movie.genre_ids.some((id) => filters.selectedGenres.includes(id))
        );
      }

      if (filters.minRuntime) {
        movies = movies.filter(
          (movie) => movie.runtime >= filters.minRuntime
        );
      }

      if (filters.maxRuntime) {
        movies = movies.filter(
          (movie) => movie.runtime <= filters.maxRuntime
        );
      }

      if (filters.minRating) {
        movies = movies.filter(
          (movie) => movie.vote_average >= filters.minRating
        );
      }
          return movies;
      }, [movies, filters]);

  return { filters, filterHandlers, filteredMovies };
}