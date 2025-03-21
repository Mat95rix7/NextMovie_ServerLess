import  MovieCard  from './MovieCard';
import PropTypes from 'prop-types';

export function SearchResults({ movies, loading, pagination, totalMovies }) {
  if (loading && pagination.currentPage === 1) {
    return <div className="text-center py-8">Chargement en cours...</div>;
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-20 dark:text-amber-500 text-gray-900">
        {totalMovies > 0 
          ? `Il n'y a pas de films correspondants aux filtres sélectionnés.`
          : 'Utilisez la barre de recherche pour trouver des films.'}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,250px)] gap-14 justify-center mx-auto w-[80%]">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.title}`} data={movie} />
        ))}
      </div>
      
      {loading && pagination.currentPage > 1 && (
        <div className="text-center py-8">Chargement en cours...</div>
      )}
    </>
  );
}

SearchResults.propTypes = {
  movies: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
  totalMovies: PropTypes.number.isRequired,
};
