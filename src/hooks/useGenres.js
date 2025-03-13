import { useState, useEffect } from 'react';
import { fetchGenres } from '../services/tmdb';

export function useGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        setLoading(true);
        const genresList = await fetchGenres();
        setGenres(genresList || []);
      } catch (error) {
        console.error('Erreur lors du chargement des genres :', error);
        setError(error);
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };
    loadGenres();
  }, []);

  return { genres, loading, error };
}
