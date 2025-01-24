import { useState } from 'react';
import { Trash2, Edit, Save, X } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { deleteUserAccount, updateProfile } from '../../hooks/userProfile';
import PropTypes from 'prop-types';

const UserRow = ({ 
  user, 
  onSave, 
  onDelete, 
  formatDate, 
  getTotalMoviesPerUser 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.displayName);
  const [editedRole, setEditedRole] = useState(user.role);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
        await updateProfile(user.id, { displayName: editedUsername, role: editedRole });
        onSave(user.id, editedUsername, editedRole);
        setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      alert("Impossible de mettre à jour l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUsername(user.displayName);
    setEditedRole(user.role);
    setIsEditing(false);
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      await deleteUserAccount(user.id);
      onDelete(user.id);
    } catch (error) {
      console.error('Erreur de suppression :', error);
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <>
    <tr key={user.id}>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {isEditing ? (
          <input
            type="text"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
            className="border rounded px-2 py-1"
          />
        ) : (
        editedUsername
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {isEditing ? (
          <select
            value={editedRole}
            onChange={(e) => setEditedRole(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        ) : (
          editedRole === 'admin' ? 'admin' : 'user'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
        {getTotalMoviesPerUser(user) || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
        {user.stats?.reviews.length || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
        {user.lastLogin ? formatDate(user.lastLogin) : ''}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {isEditing ? (
          <div className="flex space-x-2">
            <Save 
              onClick={handleSave} 
              className="text-green-600 hover:text-green-900 mr-2"
            >
              Enregistrer
            </Save>
            <X 
              onClick={handleCancel} 
              className="text-red-600 hover:text-red-900"
            >
              Annuler
            </X>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsEditing(true)} 
              className="text-indigo-600 hover:text-indigo-900 mr-2"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              // onClick={() => handleDeleteUser(user.id)} 
              onClick={() => setIsModalOpen(true)}
              className="text-red-600 hover:text-red-900"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </td>
    </tr>
          {isModalOpen && (
            <ConfirmationModal
              isOpen={isModalOpen}
              onConfirm={handleDeleteUser}
              onCancel={() => setIsModalOpen(false)}
              className=""
              message={`Voulez-vous vraiment supprimer l'utilisateur "${user.displayName}" ?`}
            />
          )}
          </>
  );
};

UserRow.propTypes = {
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  getTotalMoviesPerUser: PropTypes.func.isRequired,
};

export default UserRow;