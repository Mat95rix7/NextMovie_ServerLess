import React from 'react';
import { useParams } from 'react-router-dom';
import { TheaterList } from './TheaterList';
import { MovieInfo } from './MovieInfo';

export function MovieDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MovieInfo movieId={id} />
      <TheaterList movieId={id} />
    </div>
  );
}

export default MovieDetails