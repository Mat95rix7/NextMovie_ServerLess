import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import UserTable from './UserTable';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../config/firebase';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [usersList, setUsers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        displayName: '',
        email: '',
        ...doc.data()
      }));
      setUsers(users);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const filteredUsers = usersList
    .filter((user) => {
      const nameMatch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      return nameMatch || emailMatch;
    })
    .sort((a, b) => {
      // Tri par rôle (admin en premier)
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      // Si même rôle, tri par nom
      return (a.displayName || '').localeCompare(b.displayName || '');
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')} - ${(date.getMonth() + 1).toString().padStart(2, '0')} - ${date.getFullYear()}`;
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="bg-amber-200 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-amber-800 ">
          Gestion des utilisateurs ({filteredUsers.length})
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 text-gray-500 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="border-t border-gray-200 overflow-x-scroll lg:overflow-hidden">
        <UserTable 
          users={filteredUsers} 
          formatDate={formatDate} 
        />
      </div>
    </div>
  );
};

export default UsersManagement;