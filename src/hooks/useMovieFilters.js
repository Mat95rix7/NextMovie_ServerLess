import { useState, useMemo } from 'react';

export function useMovieFilters(movies) {
  const [filters, setFilters] = useState({
    selectedGenres: [],
    maxRuntime: 240,
    minRating: 0,
    isRecent: false,
    searchQuery: ''
  });

  const filterHandlers = {
    setSelectedGenres: (genres) => 
      setFilters(prev => ({ ...prev, selectedGenres: genres })),

    setRuntime: (max) => 
      setFilters(prev => ({ ...prev, maxRuntime: max })),
    setMinRating: (rating) => 
      setFilters(prev => ({ ...prev, minRating: rating })),
    setIsRecent: (isRecent) => 
      setFilters(prev => ({ ...prev, isRecent })),
    setSearchQuery: (query) =>
      setFilters(prev => ({ ...prev, searchQuery: query })),
    resetFilters: () => setFilters({
      selectedGenres: [],
      minRuntime: 0,
      maxRuntime: 240,
      minRating: 0,
      isRecent: false,
      searchQuery: ''
    })
  };

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      // Search query filter
      if (filters.searchQuery && !movie.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Genre filter
      if (filters.selectedGenres.length > 0 && 
          !movie.genre_ids.some(id => filters.selectedGenres.includes(id))) {
        return false;
      }

      // Runtime filter
      if (movie.runtime >  filters.maxRuntime) {
        return false;
      }

      // Rating filter
      if (movie.vote_average < filters.minRating) {
        return false;
      }

      // Recent movies filter (within last 1 years)
      if (filters.isRecent) {
        const oneYearsAgo = new Date();
        oneYearsAgo.setFullYear(oneYearsAgo.getFullYear() - 1);
        const movieDate = new Date(movie.release_date);
        console.log(movieDate, oneYearsAgo);
        if (movieDate < oneYearsAgo) {
          return false;
        }
      }

      return true;
    });
  }, [movies, filters]);

  // Add statistics about filtered results
  const filterStats = useMemo(() => {
    const totalMovies = filteredMovies.length;
    const averageRating = totalMovies > 0
      ? filteredMovies.reduce((sum, movie) => sum + movie.vote_average, 0) / totalMovies
      : 0;
    const averageRuntime = totalMovies > 0
      ? filteredMovies.reduce((sum, movie) => sum + movie.runtime, 0) / totalMovies
      : 0;

    return {
      totalMovies,
      averageRating: averageRating.toFixed(1),
      averageRuntime: Math.round(averageRuntime)
    };
  }, [filteredMovies]);

  return { 
    filters, 
    filterHandlers, 
    filteredMovies,
    filterStats 
  };
}