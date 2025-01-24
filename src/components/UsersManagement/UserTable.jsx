import { useState } from 'react';
import UserRow from './UserRow';
import PropTypes from 'prop-types';
const UserTable = ({ users, formatDate, getTotalMoviesPerUser }) => {
  
  const [userList, setUserList] = useState(users);
  
  const handleSaveUser = (updatedUser) => {
    setUserList(userList.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };

  const handleDeleteUser = (userId) => {
    setUserList(userList.filter(user => user.id !== userId));
  };



  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          {['Nom d\'utilisateur', 'Email', 'Rôle', 'Films vus', 'Critiques', 'Date d\'inscription', 'Dernière connexion', 'Actions']
            .map(header => (
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
        {users.map((user) => (
          <UserRow 
            key={user.id} 
            user={user} 
            onSave={handleSaveUser}
            onDelete={handleDeleteUser}
            formatDate={formatDate}
            getTotalMoviesPerUser={getTotalMoviesPerUser}
          />
        ))}
      </tbody>
    </table>
  );
};

UserTable.propTypes = {
  users: PropTypes.array.isRequired,
  formatDate: PropTypes.func.isRequired,
  getTotalMoviesPerUser: PropTypes.func.isRequired,
};

export default UserTable;