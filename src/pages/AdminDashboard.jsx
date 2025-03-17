import { useState, useEffect } from 'react';
import { Shield, Users, User, Film, Armchair} from 'lucide-react';
import { subscribeToUsers } from '../config/firebase';
import UserManagement from '../components/UsersManagement';
import MovieManagement from '../components/MoviesManagement';
import TheaterManagement from '../components/TheatersManagement';
import { subscribeToMovieStats, getTotalMoviesInApp } from '../services/userProfile';
import { useNavigate } from 'react-router-dom';
import { useAuth2 } from '../context/auth/authContext';
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
        ? 'border-amber-500 text-amber-500 font-bold'
        : 'border-transparent text-gray-500 hover:text-amber-500 hover:border-amber-500 font-medium'
    } whitespace-nowrap pb-4 px-1 border-b-2  text-xl`}
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

  useEffect(() => {
    const fetchCinemas = async () => {
      
      setState(prevState => ({ ...prevState, loading: true }));

      try {
        // Remplacez ici par l'URL de votre API, en local ou en production
        const response = await fetch('api/cinemas');    
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des cinémas');
        }
        const cinemasData = await response.json(); // Récupération des données JSON
        setState(prevState => ({
          ...prevState,
          theaters: cinemasData,  // On met à jour l'état des cinémas
          loading: false,  // On indique que la récupération est terminée
        }));
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          error: error.message,  // En cas d'erreur, on met à jour l'état avec l'erreur
          loading: false, // Fin du chargement même en cas d'erreur
        }));
      }
    };

    fetchCinemas();
  }, []);

  const { user, isAdmin } = useAuth2();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/notfound');
      return;
    }

    const unsubscribe = subscribeToUsers((updatedUsers) => {
      const admins = updatedUsers.filter(user => user.role === 'admin');
      setState(prev => ({
        ...prev,
        users: updatedUsers,
        admins: admins,
        loading: false
      }));
    });
    // Nettoyage de l'abonnement
    return () => unsubscribe();
  }, [user, isAdmin, navigate]);
  
  // Écouteur pour les statistiques de films
  useEffect(() => {
    const unsubscribe = subscribeToMovieStats((updatedMovies) => {
      setState(prev => ({
        ...prev,
        movieStats: updatedMovies,
        loading: false
      }));
    });
  
    // Cleanup de l'abonnement
    return () => unsubscribe();
  }, []);

  const { totalMovies } = getTotalMoviesInApp(state.users);
  
  const stats = [
    { icon: User, title: "Nombre d'admins", value: state.admins?.length || 0 },
    { icon: Users, title: "Nombre d'utilisateurs", value: state.users.length || 0 },
    { icon: Film, title: "Films Consultés", value: totalMovies || 0 },
    { icon: Armchair, title: "Nombre des salles", value: state.theaters?.length || 0 }, 
  ];

  const tabs = [
    { id: 'users', icon: Users, label: 'Utilisateurs', component: <UserManagement /> },
    { id: 'movies', icon: Film, label: 'Films', component: <MovieManagement movies={state.movieStats} /> },
    { id: 'theaters', icon: Armchair, label: 'Salles', component: <TheaterManagement theaters={state.theaters} /> }
  ];

  if (state.loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (state.error) {
    return <div className="text-red-500 text-center p-4">{state.error}</div>;
  }

  return (
    <div className="min-h-screen min-w-[320px] mt-20">
      <div className="bg-amber-200 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-amber-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Admin Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex justify-evenly space-x-8">
            {tabs.map(tab => (
              <TabButton
                key={tab.id}
                isActive={state.activeTab === tab.id}
                onClick={() => setState(prev => ({ ...prev, activeTab: tab.id }))}
              >
                <tab.icon className="w-8 h-8 mr-4 hidden sm:inline-block" />
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
  icon: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

export default AdminDashboard;