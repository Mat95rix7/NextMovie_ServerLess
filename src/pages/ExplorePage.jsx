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
        return response.data.results;
      } catch (err) {
        setError('Erreur lors du chargement des films');
        console.error(err);
        return [];
      }
    };

    const getMoviesData = async () => {
      setLoading(true);
      const genreMovies = {};

      // Pour chaque genre, on récupère les films
      for (const genre of genres) {
        genreMovies[genre.name] = await fetchMoviesByGenre(genre.id);
      }

      setMoviesByGenre(genreMovies);
      setLoading(false);
    };

    if (genres.length > 0) {
      getMoviesData();
    }
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
          link={`/genre/${genres.find(genre => genre.name === genreName).id}`}
        />
      ))}
    </div>
  );
};

export default ExplorePage;
