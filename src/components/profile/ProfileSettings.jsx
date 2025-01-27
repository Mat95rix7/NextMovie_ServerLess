import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { updateProfile, checkUsernameAvailability } from '../../hooks/userProfile';
import PropTypes from 'prop-types';

export function ProfileSettings({ user, onUpdate }) {
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    const validateUsername = async () => {
      if (displayName) {
        const isAvailable = await checkUsernameAvailability(displayName);
        setUsernameError(isAvailable ? '' : "Nom d'utilisateur indisponible");
      } else {
        setUsernameError('');
      }
    };
    
    validateUsername();
  }, [displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (usernameError || !displayName) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      
      await updateProfile(user.uid, { displayName });
      onUpdate(displayName);
      toast.success('Profil mis à jour avec succès');
      setDisplayName('');
    } catch (error) {
      console.error(error);
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
            Nom d&apos;utilisateur
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border border-gray-300 text-gray-700 rounded focus:outline-none focus:border-amber-400"
            placeholder="Nouveau nom d'utilisateur"
          />
          {usernameError && (
            <p className="my-3 text-sm text-amber-500">{usernameError}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !displayName || !!usernameError}
          className="bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
      </form>
    </div>
  );
}

ProfileSettings.propTypes = {
  user: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ProfileSettings;