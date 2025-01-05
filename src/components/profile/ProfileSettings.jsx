import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateProfile } from '../../services/userService';

export function ProfileSettings({ user, onUpdate }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile(user.uid, { username });
      onUpdate(username);
      toast.success('Profil mis à jour avec succès');
      setUsername('');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Paramètres du profil</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nom d'utilisateur
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-amber-400"
            placeholder="Nouveau nom d'utilisateur"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !username}
          className="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
      </form>
    </div>
  );
}

export default ProfileSettings