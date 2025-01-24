import { useEffect, useState } from 'react';
import { Search, MapPin, Armchair, Projector} from 'lucide-react';
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
    <div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Gestion des Salles ({filteredTheaters.length})
          </h3>
          <div className="relative flex items-center space-x-4">
            {/* Barre de recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher une salle..."
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Filtre par département */}
            <select
              value={departmentFilter}
              onChange={handleDepartmentFilter}
              className="border rounded-lg px-2 py-2 text-gray-500"
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

        <div className="border-t border-gray-200 overflow-x-scroll lg:overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {['Nom', 'Département', 'Capacité', 'Écrans', 'Code'].map(header => (
                  <th
                    key={header}
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTheaters.map((theater) => (
                <tr key={theater.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <MapPin className="h-6 w-6 text-amber-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{theater.nom}</div>
                        <div className="text-sm text-gray-500">{theater.adresse}</div>
                        <div className="text-sm text-gray-500">{theater.commune}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {theater.dep}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex items-center">
                      <Armchair className="h-4 w-4 mr-1 text-amber-500" />
                      {theater.fauteuils} places
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex items-center">
                      <Projector className="h-4 w-4 mr-1 text-amber-500 " />
                      {theater.ecrans} écrans
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex items-center">
                      {theater.code_insee}
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

TheatersManagement.propTypes = {
  theaters: PropTypes.array.isRequired,
  onEditTheater: PropTypes.func.isRequired,
  onDeleteTheater: PropTypes.func.isRequired,
};

export default TheatersManagement;







