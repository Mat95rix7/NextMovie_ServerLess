import { useState, useEffect } from 'react';
import { Shield, Users, Film, Armchair, Star } from 'lucide-react';
import { getUsers } from '../config/firebase';
import CinemasData from '../data/cinemas.json';
import UserManagement from '../components/UsersManagement/UsersManagement';
import MovieManagement from '../components/MoviesManagement';
import TheaterManagement from '../components/TheatersManagement';
import { getMovieStats, getTotalMoviesInApp } from '../hooks/userProfile';
import { Navigate } from 'react-router-dom';



function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [movieStats, setMovieStats] = useState([]);
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchTheaters();
    getMovieStats()
    fetchMovies();
    fetchStats
    fetchMovieStats();
    
  }, []);

  const fetchUsers = async () => {
    setUsers(await getUsers());
  };

    const fetchMovies = async () => {
    };

    const fetchMovieStats = async () => {
      setMovieStats(await getMovieStats());
      
    
    }




// Récupérer tous les IDs des films regardés

    const fetchStats = async () => {
    // À implémenter avec Firebase
  };

  const fetchTheaters = async () => {
    setTheaters(CinemasData);
  };


  const CardContent = () => {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Nombre d&apos;utilisateurs
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
              <Film className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Films Consultés
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {getTotalMoviesInApp(users).size || 0}
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
              <Star className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Films Favoris
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {getTotalMoviesInApp(users).totalFovorites || 0}
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
              <Armchair className="h-6 w-6 text-amber-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Salles Totales
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {theaters?.length || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    )
  }
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'movies':
        // return <MovieStats />;
        return <MovieManagement movies={movieStats} />;
      case 'theaters':
        return <TheaterManagement theaters={theaters} />;

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
              <div className="flex-shrink-0 flex items-center">
                <Shield className="h-8 w-8 text-amber-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
        {CardContent()}
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;