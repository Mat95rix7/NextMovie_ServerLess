import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Star } from 'lucide-react';
import { fetchMovieDetails } from '../../services/tmdb';

export function MovieInfo({ movieId }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await fetchMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        console.error('Erreur lors du chargement du film:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMovie();
  }, [movieId]);

  if (loading) return <div>Chargement...</div>;
  if (!movie) return <div>Film non trouvé</div>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="md:flex">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
          <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{movie.runtime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(movie.release_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}/10</span>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{movie.overview}</p>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map(genre => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}