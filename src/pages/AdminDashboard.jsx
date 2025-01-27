// import { useState, useEffect } from 'react';
// import { Shield, Users, Film, Armchair, Star } from 'lucide-react';
// import { getUsers } from '../config/firebase';
// import CinemasData from '../data/cinemas.json';
// import UserManagement from '../components/UsersManagement';
// import MovieManagement from '../components/MoviesManagement';
// import TheaterManagement from '../components/TheatersManagement';
// import { getMovieStats, getTotalMoviesInApp, getUserProfile } from '../hooks/userProfile';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState('users');
//   const [users, setUsers] = useState([]);
//   const [movieStats, setMovieStats] = useState([]);
//   const [theaters, setTheaters] = useState([]);
//   const [loading, setLoading] = useState(false);
// const [error, setError] = useState(null);

//   const navigate = useNavigate()
//   const { user } = useAuth()

//   useEffect(() => {
//     fetchUsers();
//     fetchTheaters();
//     getMovieStats()
//     fetchMovieStats();
//   }, []);

//   useEffect(() => {
//     const checkUserAccess = async () => {
//       if (!user) {
//         navigate('/');
//         return;
//       }
//       try {
//         const currentUser = await getUserProfile(user.uid);
//         if (currentUser?.role !== 'admin') {
//           // console.log(currentUser.role);
//           // navigate('/');
//               return (
//                 <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700">
//                   <h1 className="text-3xl font-bold">Accès refusé</h1>
//                   <p>Vous n&apos;êtes pas administrateur.</p>
//                   <button
//                     className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                     onClick={() => navigate("/")}
//                   >
//                     Retour à l&apos;accueil
//                   </button>
//                 </div>
//               ); 
//         }
//       } catch (err) {
//         // setError('Failed to verify user access');
//         console.log(err);
//         navigate('/');
//       }
//     };
//     checkUserAccess();
//   }, [user, navigate]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const fetchedUsers = await getUsers();
//       setUsers(fetchedUsers);
//     } catch (err) {
//       setError('Failed to load users');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };



//   const fetchMovieStats = async () => {
//     setMovieStats(await getMovieStats());
//   }
//   const fetchTheaters = async () => {
//     setTheaters(CinemasData);
//   };
//   const CardContent = () => {
//     return (
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//       <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
//         <div className="p-5">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <Users className="h-6 w-6 text-amber-500" />
//             </div>
//             <div className="ml-5 w-0 flex-1">
//               <dl>
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                   Nombre d&apos;utilisateurs
//                 </dt>
//                 <dd className="text-lg font-medium text-gray-900">
//                   {users.length || 0}
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
//         <div className="p-5">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <Film className="h-6 w-6 text-amber-500" />
//             </div>
//             <div className="ml-5 w-0 flex-1">
//               <dl>
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                   Films Consultés
//                 </dt>
//                 <dd className="text-lg font-medium text-gray-900">
//                   {getTotalMoviesInApp(users).totalMovies || 0}
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
//         <div className="p-5">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <Star className="h-6 w-6 text-amber-500" />
//             </div>
//             <div className="ml-5 w-0 flex-1">
//               <dl>
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                   Films Favoris
//                 </dt>
//                 <dd className="text-lg font-medium text-gray-900">
//                   {getTotalMoviesInApp(users).totalFavorites || 0}
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
//         <div className="p-5">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <Armchair className="h-6 w-6 text-amber-500" />
//             </div>
//             <div className="ml-5 w-0 flex-1">
//               <dl>
//                 <dt className="text-sm font-medium text-gray-500 truncate">
//                   Nombre des salles
//                 </dt>
//                 <dd className="text-lg font-medium text-gray-900">
//                   {theaters?.length || 0}
//                 </dd>
//               </dl>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     )
//   }
//   const renderContent = () => {
//     switch (activeTab) {
//       case 'users':
//         return <UserManagement />;
//       case 'movies':
//         return <MovieManagement movies={movieStats} />;
//       case 'theaters':
//         return <TheaterManagement theaters={theaters} />;

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen mt-20">
//       <div className="bg-amber-200 shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <Shield className="h-8 w-8 text-amber-600" />
//                 <span className="ml-2 text-xl font-bold text-gray-900">Admin Dashboard</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="mb-8 border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               className={`${
//                 activeTab === 'users'
//                   ? 'border-amber-500 text-amber-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-xl`}
//               onClick={() => setActiveTab('users')}
//             >
//               Utilisateurs
//             </button>
//             <button
//               className={`${
//                 activeTab === 'movies'
//                   ? 'border-amber-500 text-amber-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-xl`}
//               onClick={() => setActiveTab('movies')}
//             >
//               Films
//             </button>
//             <button
//               className={`${
//                 activeTab === 'theaters'
//                   ? 'border-amber-500 text-amber-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-xl`}
//               onClick={() => setActiveTab('theaters')}
//             >
//               Salles
//             </button>
//           </nav>
//         </div>
//         {CardContent()}
//         {renderContent()}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

import { useState, useEffect } from 'react';
import { Shield, Users, Film, Armchair, Star } from 'lucide-react';
import { getUsers } from '../config/firebase';
import CinemasData from '../data/cinemas.json';
import UserManagement from '../components/UsersManagement';
import MovieManagement from '../components/MoviesManagement';
import TheaterManagement from '../components/TheatersManagement';
import { getMovieStats, getTotalMoviesInApp, getUserProfile } from '../hooks/userProfile';
// import { useNavigate } from 'react-router-dom';
import { useAuth2 } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [movieStats, setMovieStats] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const { user, isAdmin } = useAuth2();

  const navigate = useNavigate();


  // useEffect(() => {
    const checkUserAccess = () => {
      if (!user || !isAdmin) {
        navigate('/NotFoundPage');
        // setAccessDenied(true);
        return;
      }
    };
    checkUserAccess();
  // }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedUsers = await getUsers();
        const fetchedMovieStats = await getMovieStats();
        setUsers(fetchedUsers);
        setMovieStats(fetchedMovieStats);
        setTheaters(CinemasData);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [users]);

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700">
        <h1 className="text-3xl font-bold">Accès refusé</h1>
        <p>Vous n&apos;êtes pas administrateur.</p>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => navigate('/')}
        >
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  const CardContent = () => {
    const { totalMovies, totalFavorites } = getTotalMoviesInApp(users);
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
          <div className="p-5">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-amber-500" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Nombre d&apos;utilisateurs
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{users.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
          <div className="p-5">
            <div className="flex items-center">
              <Film className="h-6 w-6 text-amber-500" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Films Consultés</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalMovies || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
          <div className="p-5">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-amber-500" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Films Favoris</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalFavorites || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg mx-2">
          <div className="p-5">
            <div className="flex items-center">
              <Armchair className="h-6 w-6 text-amber-500" />
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Nombre des salles</dt>
                  <dd className="text-lg font-medium text-gray-900">{theaters?.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'movies':
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
