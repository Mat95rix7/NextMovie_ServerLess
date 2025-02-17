import { useEffect, useState } from 'react';
import { Search, MapPin, Armchair, Tv} from 'lucide-react';
import PropTypes from 'prop-types';

const TheatersManagement = ({ theaters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [filteredTheaters, setFilteredTheaters] = useState(theaters);

  // Applique les filtres (recherche + département)
  useEffect(() => {
    const applyFilters = () => {
      let result = theaters;

      // Filtrage par département
      if (departmentFilter) {
        result = result.filter(theater => `${theater.dep}` === `${departmentFilter}`);
      }

      // Filtrage par recherche
      if (searchTerm) {
        result = result.filter(theater =>
          theater.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          theater.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
          theater.commune.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredTheaters(result);
    };

    applyFilters();
  }, [searchTerm, departmentFilter, theaters]);

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Gérer la sélection de département
  const handleDepartmentFilter = (e) => {
    setDepartmentFilter(e.target.value);
  };

  // Extraire les départements uniques
  const uniqueDepartments = [...new Set(theaters.map(t => t.dep))];

  return (
          <div className="w-full">
            <div className="bg-amber-200 shadow overflow-hidden sm:rounded-lg">
              {/* En-tête avec titre, recherche et filtre */}
              <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-lg leading-6 font-medium text-amber-800 text-center sm:text-left w-full sm:w-auto">
                  Gestion des Salles ({filteredTheaters.length})
                </h3>
                
                {/* Conteneur des contrôles de filtrage */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  {/* Barre de recherche */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Rechercher une salle..."
                      className="w-full pl-10 pr-4 py-2 text-gray-500 border rounded-lg"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  {/* Filtre par département */}
                  <select
                    value={departmentFilter}
                    onChange={handleDepartmentFilter}
                    className="w-full sm:w-auto border rounded-lg px-4 py-2 text-gray-500"
                  >
                    <option value="">Tous</option>
                    {uniqueDepartments.map(dep => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table avec scroll horizontal */}
              <div className="border-t border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      {['Nom', 'Département', 'Capacité', 'Écrans', 'Code'].map(header => (
                        <th
                          key={header}
                          className="px-3 sm:px-6 py-3 bg-amber-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTheaters.map((theater) => (
                      <tr key={theater.id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap max-w-xs">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <MapPin className="h-4 w-4 sm:h-6 sm:w-6 text-amber-500" />
                            </div>
                            <div className="ml-2 sm:ml-4">
                              <div className="text-sm font-medium text-gray-900">{theater.nom}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{theater.adresse}</div>
                              <div className="text-xs sm:text-sm text-gray-500">{theater.commune}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                          {theater.dep}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                          <div className="flex justify-center items-center">
                            <Armchair className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-amber-500" />
                            <span className="hidden sm:inline">{theater.fauteuils} places</span>
                            <span className="sm:hidden">{theater.fauteuils}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                          <div className="flex justify-center items-center">
                            <Tv className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-amber-500" />
                            <span className="hidden sm:inline">{theater.ecrans} écrans</span>
                            <span className="sm:hidden">{theater.ecrans}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                          {theater.code_insee}
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

TheatersManagement.propTypes = {
  theaters: PropTypes.array.isRequired
};

export default TheatersManagement;







