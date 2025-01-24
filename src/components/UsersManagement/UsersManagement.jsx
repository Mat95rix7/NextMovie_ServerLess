import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getTotalMoviesPerUser } from '../../hooks/userProfile';
import PropTypes from 'prop-types';
import UserTable from './UserTable';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../config/firebase';


const UsersManagement = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersList, setUsers] = useState([]);


  useEffect(() => {
    // Créer une query sur la collection 'users'
    const q = query(collection(db, 'users'));
    // Listener en temps réel
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
      setLoading(false);
    }, (error) => {
      console.error("Erreur de récupération des utilisateurs:", error);
      setLoading(false);
    });
    // Nettoyer le listener à la déconnexion du composant
    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter((user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  user.email.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return <div>Chargement des utilisateurs...</div>;
  }

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day} - ${month} - ${year}`;
};

  return (
    <>

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
      

      <div className="border-t border-gray-200 overflow-x-scroll lg:overflow-hidden">
        <UserTable users={filteredUsers} formatDate={formatDate} getTotalMoviesPerUser={getTotalMoviesPerUser}/>
      </div>
    </div> 
  </>
  );
};

UsersManagement.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UsersManagement;