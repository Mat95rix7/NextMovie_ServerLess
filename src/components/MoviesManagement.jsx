import { useState, useEffect } from 'react';
import { Search, Eye, Star, Heart} from 'lucide-react';
import PropTypes from 'prop-types';

const MoviesManagement = ({  movies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState(movies);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    const results = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(results);
  }, [searchTerm, movies]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  return (
    <div>
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Gestion des Films ({filteredMovies.length})
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un film..."
            className="pl-10 pr-4 py-2 text-gray-500 border rounded-lg"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>
      <div className="border-t border-gray-200 overflow-x-scroll lg:overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {['Titre', 'Favoris', 'watchlist', 'reviews', 'AvRating' ]
                .map(header => (
                  <th key={header} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMovies.map((movie) => (
              <tr key={movie.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                      <div className="text-sm text-gray-500">{formatDate(movie.releaseDate)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1 text-amber-500" />
                    {movie.favorites}
                  </div>
                </td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-amber-500" />
                    {movie.watchlist}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-amber-500" />
                      {movie.reviews}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-amber-500" />
                    {movie.averageRating || 0}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

MoviesManagement.propTypes = {
  movies: PropTypes.array.isRequired,
};

export default MoviesManagement;

