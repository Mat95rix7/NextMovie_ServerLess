import { useState, useEffect, useCallback } from 'react';
// import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import  MovieCard  from '../components/MovieCard';
import { FilterDropdown } from '../components/FilterDropdown';
import { fetchMovies, fetchGenres } from '../services/tmdb';
import { useMovieFilters } from '../hooks/useMovieFilters';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';


function SearchPage() {
  const location = useLocation()
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setQuery(location?.search?.slice(1))
    handleSearch(query)
    console.log(location?.search?.slice(1), query);
  }, [query, location?.search])

  const {
    filters,
    setSelectedGenres,
    setMinRuntime,
    setMaxRuntime,
    setMinRating,
    setIsRecent,
    filteredMovies
  } = useMovieFilters(searchResults);

  const handleSearch = useCallback(async (searchQuery, page = 1) => {
    if (!searchQuery) return;
    
    setLoading(true);
    try {
      const results = await fetchMovies(searchQuery, page, {
        genres: [],
        minRuntime: 0,
        maxRuntime: 240,
        minRating: 0,
      });
      
      if (page === 1) {
        setSearchResults(results.movies);
      } else {
        setSearchResults(prev => [...prev, ...results.movies]);
      }
      
      setTotalPages(results.totalPages);
      setCurrentPage(results.page);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
    setLoading(false);
  }, []);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      handleSearch(query, currentPage + 1);
    }
  }, [query, currentPage, totalPages, loading, handleSearch]);

  useInfiniteScroll(loadMore, currentPage < totalPages);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresList = await fetchGenres();
        setGenres(genresList || []);
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
        setGenres([]);
      }
    };
    loadGenres();
  }, []);

  return (
          <div className='py-16'>
            <div className='container mx-auto'>
              <div className='flex justify-between mt-14 mx-5'>
                <h3 className='capitalize text-lg lg:text-xl font-semibold text-center flex items-center '>Resultat de Recherche : ({filteredMovies.length})</h3>
                <FilterDropdown
                      genres={genres}
                      selectedGenres={filters.selectedGenres}
                      minRuntime={filters.minRuntime}
                      maxRuntime={filters.maxRuntime}
                      minRating={filters.minRating}
                      isRecent={filters.isRecent}
                      onGenreChange={setSelectedGenres}
                      onRuntimeChange={(min, max) => {
                        setMinRuntime(min);
                        setMaxRuntime(max);
                      }}
                      onRatingChange={setMinRating}
                      onRecentChange={setIsRecent}
                    />
              </div>
              {loading && currentPage === 1 ? (
                    <div className="text-center py-8">Chargement...</div>
                  ) : (
                    <>
                      {filteredMovies.length > 0 ? (
                        <div className='grid grid-cols-[repeat(auto-fit,300px)] gap-24 justify-center  mx-auto m-10'>
                          {filteredMovies.map((data) => (
                            <MovieCard key={`${data.id}-${data.title}`} data={data} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {searchResults.length > 0 
                            ? 'Aucun film ne correspond aux filtres sélectionnés'
                            : 'Utilisez la barre de recherche pour trouver des films'}
                        </div>
                      )}
                      {loading && currentPage > 1 && (
                        <div className="text-center py-8">Chargement de plus de films...</div>
                      )}
                    </>
                  )}
            </div>
          </div>
  );
}

export default SearchPage;