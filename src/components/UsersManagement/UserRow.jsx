import { useState } from 'react';
import { Trash2, Edit, Save, X} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';
import { deleteUserAccount, updateProfile } from '../../hooks/userProfile';
import PropTypes from 'prop-types';
import { Switch } from "@/components/ui/switch"

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
  const [isActive, setIsActive] = useState(user.isActive); // Ajout du statut actif/inactif

  const Tooltip = ({ text, children }) => {
    return (
      <div className="relative group">
        {/* Élément déclencheur */}
        {children}
        {/* Tooltip */}
        <div className="absolute right-0 bottom-full mb-2 hidden w-max -translate-x-0 rounded-md bg-white px-3 py-1 text-xs text-black shadow-lg border border-gray-300 group-hover:block">
          {text}
        </div>
      </div>
    );
  };
  Tooltip.propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  // Gestion de la sauvegarde des modifications
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

  // Suppression de l'utilisateur
  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      await deleteUserAccount(user.id);
      onDelete(user.id);
    } catch (error) {
      console.error('Erreur de suppression :', error);
    } finally {
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  // Activation ou désactivation du compte utilisateur
  const toggleAccountStatus = async () => {
    setIsLoading(true);
    try {
      const newStatus = !isActive;
      await updateProfile(user.id, { isActive: newStatus });
      setIsActive(newStatus);
      // alert(`Compte ${newStatus ? 'activé' : 'désactivé'} avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut du compte :", error);
      alert("Impossible de modifier le statut du compte.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <tr key={user.id}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {user.displayName}
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
          <div className="flex items-center justify-end space-x-4">
            {/* Bouton Switch */}
            <Tooltip
              text={
                isActive
                  ? "Cliquez pour désactiver cet utilisateur"
                  : "Cliquez pour activer cet utilisateur"
              }
            >
              <div onClick={toggleAccountStatus} className="relative flex items-center">
                <div  className="scale-75">
                <Switch checked={isActive} />
                </div>
              </div>
            </Tooltip>

            {/* Actions : Enregistrer / Annuler ou Modifier / Supprimer */}
            {isEditing ? (
              <>
                {/* Bouton Enregistrer */}
                <Tooltip text="Enregistrer les modifications">
                  <button
                    onClick={handleSave}
                    className="text-green-600 hover:text-green-900 relative"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                </Tooltip>

                {/* Bouton Annuler */}
                <Tooltip text="Annuler les modifications" className="right-0 translate-x-0">
                  <button
                    onClick={handleCancel}
                    className="text-red-600 hover:text-red-900 relative"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Tooltip>
              </>
            ) : (
              <>
                {/* Bouton Modifier */}
                <Tooltip text="Modifier l'utilisateur">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-600 hover:text-indigo-900 relative"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </Tooltip>

                {/* Bouton Supprimer */}
                <Tooltip text="Supprimer l'utilisateur">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-red-600 hover:text-red-900 relative"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
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
