import { useState, useEffect } from 'react';
import { Users, Film, Activity, Settings, Shield, Star, Eye, Trash2, Edit, Search, MapPin, Armchair } from 'lucide-react';
import { fetchUsers, fetchMovies } from '../services/adminUtils';
import { getUsers } from '../config/firebase';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReviews: 0,
    totalFavorites: 0,
    totalMovies: 0,
    totalViews: 0,
    averageRating: 0,
    totalTheaters: 0,
    totalSeats: 0
  });

  useEffect(() => {
    // Implémentez la logique Firebase ici
    // fetchStats();
    fetchUsers();
    
    // getUsers();
    // fetchMovies();
    // fetchTheaters();
  }, []);

  // const fetchStats = async () => {
  //   // À implémenter avec Firebase
  // };

  const fetchUsers = async () => {
    setUsers(await getUsers());
    
    // À implémenter avec Firebase
  };

  // const fetchMovies = async () => {
  //   // À implémenter avec Firebase
  // };

  // const fetchTheaters = async () => {
  //   // implémenter avec Firebase
  // };

  const handleDeleteUser = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      // Implémentez la suppression Firebase
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      // Implémentez la suppression Firebase
    }
  };

  const handleDeleteTheater = async (theaterId) => {
    if (window.confirm('Êtes-vousSURE de vouloir supprimer cette salle ?')) {
      // Implémentez la suppression Firebase
    }
  };

  console.log(users);

  const cardContent = () => {
    switch (activeTab) {
      case 'users':
        return ( 
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Utilisateurs Totaux
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Utilisateurs Actifs
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Film className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Critiques Totales
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.stats?.reviews.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Films Favoris
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalFavorites}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
      );
      case 'movies':
        return (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Utilisateurs Totaux
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {users.length || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Film className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Films Totaux
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.totalMovies}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
                  <div className="p-5">
                    <div className="flex items-center"> 
                      <div className="flex-shrink-0">
                        <Eye className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Vues Totales
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.totalViews}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Star className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Note Moyenne
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stats.averageRating.toFixed(1)}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>  
         );
         case 'theaters':
          return (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Utilisateurs Totaux
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {users.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Film className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Films Totaux
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalMovies}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Salles Totales
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalTheaters}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
  
            <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Armchair className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Places Totales
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.totalSeats}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
         default:
           return null;
       }
     };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Gestion des Utilisateurs
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  className="pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="border-t border-gray-200 overflow-x-scroll sm:overflow-hidden ">
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Films vus
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Critiques
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d&#39;inscription
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.displayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.moviesWatched || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.reviews || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          onClick={() => handleEditUser(user.id)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'movies':
        return (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Gestion des Films
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un film..."
                  className="pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vues
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note moyenne
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Critiques
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Favoris
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movies.map((movie) => (
                    <tr key={movie.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded object-cover" src={movie.poster} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                            <div className="text-sm text-gray-500">{movie.releaseDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {movie.views}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          {movie.averageRating.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movie.reviewsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {movie.favoritesCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          onClick={() => handleEditMovie(movie.id)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteMovie(movie.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        case 'theaters':
          return (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Gestion des Salles
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher une salle..."
                  className="pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacité
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Équipements
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Séances aujourd&apos;hui
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {theaters.map((theater) => (
                    <tr key={theater.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <MapPin className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{theater.name}</div>
                            <div className="text-sm text-gray-500">{theater.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Armchair className="h-4 w-4 mr-1" />
                          {theater.capacity} places
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          theater.type === 'IMAX' ? 'bg-blue-100 text-blue-800' : 
                          theater.type === '3D' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {theater.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {theater.equipment.map((item, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {theater.todayScreenings || 0} séances
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                          onClick={() => handleEditTheater(theater.id)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteTheater(theater.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="bg-amber-200 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center ">
                <Shield className="h-8 w-8 text-amber-600" />
                <span className="ml-2 text-xl font-bold  text-gray-900">Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'users'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-xl`}
              onClick={() => setActiveTab('users')}
            >
              Utilisateurs
            </button>
            <button
              className={`${
                activeTab === 'movies'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-xl`}
              onClick={() => setActiveTab('movies')}
            >
              Films
            </button>
            <button
              className={`${
                activeTab === 'theaters'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-xl`}
              onClick={() => setActiveTab('theaters')}
            >
              Salles
            </button>
          </nav>
        </div>
        {cardContent()}
        {/* Contenu principal */}
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;