import  MovieCard  from '../../components/MovieCard';

export function SearchResults({ movies, loading, pagination, totalMovies }) {
  if (loading && pagination.currentPage === 1) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {totalMovies > 0 
          ? 'No movies match the selected filters'
          : 'Use the search bar to find movies'}
      </div>
    );
  }
  console.log(pagination.currentPage, loading);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,300px)] gap-24 justify-center mx-auto m-10">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${movie.title}`} data={movie} />
        ))}
      </div>
      
      {loading && pagination.currentPage > 1 && (
        <div className="text-center py-8">Loading more movies...</div>
      )}
    </>
  );
}