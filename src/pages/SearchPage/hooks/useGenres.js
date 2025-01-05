import { useState, useEffect } from 'react';
import { fetchGenres } from '../../../services/tmdb';

export function useGenres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresList = await fetchGenres();
        setGenres(genresList || []);
      } catch (error) {
        console.error('Error loading genres:', error);
        setGenres([]);
      }
    };
    loadGenres();
  }, []);

  return { genres };
}