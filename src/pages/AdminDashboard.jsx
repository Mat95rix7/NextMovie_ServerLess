import { useState, useEffect } from 'react';
import { Shield, Users, Film, Armchair, Star } from 'lucide-react';
import { getUsers } from '../config/firebase';
import CinemasData from '../data/cinemas.json';
import UserManagement from '../components/UsersManagement';
import MovieManagement from '../components/MoviesManagement';
import TheaterManagement from '../components/TheatersManagement';
import { getMovieStats, getTotalMoviesInApp } from '../hooks/userProfile';
import { useNavigate } from 'react-router-dom';
import { useAuth2 } from '../context/userContext';
import PropTypes from 'prop-types';

const StatCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
    <div className="p-5">
      <div className="flex items-center">
        <Icon className="h-6 w-6 text-amber-500" />
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

// Composant pour les onglets
const TabButton = ({ isActive, onClick, children }) => (
  <button
    className={`${
      isActive
        ? 'border-amber-500 text-amber-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-xl`}
    onClick={onClick}
  >
    {children}
  </button>
);

function AdminDashboard() {
  const [state, setState] = useState({
    activeTab: 'users',
    users: [],
    movieStats: [],
    theaters: [],
    loading: false,
    error: null
  });

  const { user, isAdmin } = useAuth2();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/NotFoundPage');
      return;
    }

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const [fetchedUsers, fetchedMovieStats] = await Promise.all([
          getUsers(),
          getMovieStats()
        ]);

        setState(prev => ({
          ...prev,
          users: fetchedUsers,
          movieStats: fetchedMovieStats,
          theaters: CinemasData,
          loading: false
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load data. Please try again later.',
          loading: false
        }));
        console.error(err);
      }
    };

    fetchData();
  }, [user, isAdmin, navigate]);

  const { totalMovies, totalFavorites } = getTotalMoviesInApp(state.users);
  const stats = [
    { icon: Users, title: "Nombre d'utilisateurs", value: state.users.length || 0 },
    { icon: Armchair, title: "Nombre des salles", value: state.theaters?.length || 0 },
    { icon: Film, title: "Films Consultés", value: totalMovies || 0 },
    { icon: Star, title: "Films Favoris", value: totalFavorites || 0 }
    
  ];

  const tabs = [
    { id: 'users', label: 'Utilisateurs', component: <UserManagement /> },
    { id: 'movies', label: 'Films', component: <MovieManagement movies={state.movieStats} /> },
    { id: 'theaters', label: 'Salles', component: <TheaterManagement theaters={state.theaters} /> }
  ];

  if (state.loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (state.error) {
    return <div className="text-red-500 text-center p-4">{state.error}</div>;
  }

  return (
    <div className="min-h-screen mt-20">
      <div className="bg-amber-200 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-amber-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                isActive={state.activeTab === tab.id}
                onClick={() => setState(prev => ({ ...prev, activeTab: tab.id }))}
              >
                {tab.label}
              </TabButton>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {tabs.find(tab => tab.id === state.activeTab)?.component}
      </div>
    </div>
  );
}

TabButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default AdminDashboard;