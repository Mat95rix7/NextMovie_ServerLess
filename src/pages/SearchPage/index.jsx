import { useLocation } from 'react-router-dom';
import { FilterDropdown } from '../../components/FilterDropdown';
import { SearchHeader } from './SearchHeader';
import { SearchResults } from './SearchResults';
import { useMovieSearch } from './hooks/useMovieSearch';
import { useGenres } from './hooks/useGenres';
import { useMovieFilters } from './hooks/useMovieFilters';

export function SearchPage() {
  const location = useLocation();
  const { movies, loading, pagination, fetchMoviesData } = useMovieSearch(location.search.slice(1));
  const { genres } = useGenres();
  const { filters, filterHandlers, filteredMovies } = useMovieFilters(movies);

  return (
    <div className="py-16">
      <div className="container mx-auto">
        <SearchHeader count={filteredMovies.length}>
          <FilterDropdown
            genres={genres}
            selectedGenres={filters.selectedGenres}
            minRuntime={filters.minRuntime}
            maxRuntime={filters.maxRuntime}
            minRating={filters.minRating}
            isRecent={filters.isRecent}
            onGenreChange={filterHandlers.setSelectedGenres}
            onRuntimeChange={filterHandlers.setRuntime}
            onRatingChange={filterHandlers.setMinRating}
            onRecentChange={filterHandlers.setIsRecent}
          />
        </SearchHeader>

        <SearchResults
          movies={filteredMovies}
          loading={loading}
          pagination={pagination}
          totalMovies={movies.length}
        />
      </div>
    </div>
  );
}
export default SearchPage