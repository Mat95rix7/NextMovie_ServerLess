import { useState } from 'react';
import { FilterDropdown } from '../components/FilterDropdown';
import { SearchResults } from '../components/SearchResults';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useGenres } from '../hooks/useGenres';
import { useMovieFilters } from '../hooks/useMovieFilters';
import { Search } from 'lucide-react';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const { movies, loading, pagination } = useMovieSearch(query);
  const { genres } = useGenres();
  const { filters, filterHandlers, filteredMovies } = useMovieFilters(movies);

  return (
    <div className="py-16">
      <div className="fixed top-20 left-0 right-0 z-10 container mx-auto">
        <form onSubmit={(e) => e.preventDefault()} className="mb-6 flex gap-4 w-11/12 mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un film..."
              className="w-full px-4 py-3 pr-12 text-lg lg:text-xl font-semibold text-gray-900 rounded-3xl border focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Search className="w-7 h-7 text-gray-400" />
            </button>
          </div>        
          <FilterDropdown
            genres={genres}
            selectedGenres={filters.selectedGenres}
            // minRuntime={filters.minRuntime}
            maxRuntime={filters.maxRuntime}
            minRating={filters.minRating}
            isRecent={filters.isRecent}
            onGenreChange={filterHandlers.setSelectedGenres}
            onRuntimeChange={filterHandlers.setRuntime}
            onRatingChange={filterHandlers.setMinRating}
            onRecentChange={filterHandlers.setIsRecent}
          />
        </form>
        </div>
        <h3 className="capitalize text-lg lg:text-xl font-semibold ms-10 mt-24">
            Resultats de recherche ({filteredMovies.length})
        </h3>
        <SearchResults
          movies={filteredMovies}
          loading={loading}
          pagination={pagination}
          totalMovies={movies.length}
        />
      
    </div>
  );
}
export default SearchPage