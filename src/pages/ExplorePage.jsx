import { useEffect, useState } from 'react';
import axios from 'axios';
import HorizontalScrollCard from '../components/HorizontalScollCard';
import { useGenres } from '../hooks/useGenres';

const ExplorePage = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [genres]);

  if (loading) {
    return <div className="flex flex-col items-center justify-center h-screen text-amber-600">Chargement...</div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-screen text-amber-600">{error}</div>;
  }

  return (
    <div className="mt-28 w-[80%] mx-auto">
      {Object.keys(moviesByGenre).map((genreName) => (
        <HorizontalScrollCard
          key={genreName}
          data={moviesByGenre[genreName]}
          heading={`${genreName}`}
          click={true}
          link={`/genre/${genres.find(genre => genre.name === genreName)?.id}`}
        />
      ))}
    </div>
  );
};

export default ExplorePage;