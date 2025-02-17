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
      <div className="w-full">
        <div className="bg-amber-200 shadow overflow-hidden sm:rounded-lg">
          {/* En-tête avec titre et recherche */}
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg leading-6 font-medium text-amber-800 text-center sm:text-left w-full sm:w-auto">
              Gestion des Films ({filteredMovies.length})
            </h3>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Rechercher un film..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 text-gray-500 border rounded-lg"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Table avec scroll horizontal sur mobile */}
          <div className="border-t border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {['Titre', 'Favoris', 'watchlist', 'reviews', 'AvRating'].map(header => (
                    <th key={header} className="px-3 sm:px-6 py-3 bg-amber-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap max-w-xs">
                      <div className="flex items-center">
                        <div className="ml-2 sm:ml-4">
                          <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                          <div className="text-xs sm:text-sm text-gray-500">{formatDate(movie.releaseDate)}</div>
                        </div>
                      </div>
                    </td>
                    {/* Colonnes de statistiques */}
                    {[
                      { icon: Heart, value: movie.favorites },
                      { icon: Eye, value: movie.watchlist },
                      { icon: Star, value: movie.reviews },
                      { icon: Star, value: movie.averageRating }
                    ].map((item, index) => (
                      <td key={index} className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <div className="flex justify-center items-center">
                          <item.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-2 sm:mr-4 text-amber-500" />
                          {item.value || 0}
                        </div>
                      </td>
                    ))}
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

