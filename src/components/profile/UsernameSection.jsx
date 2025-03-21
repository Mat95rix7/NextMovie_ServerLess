import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateField } from '../../services/errorMessages';
import { updateUserProfile, checkUsernameAvailability } from '../../services/userProfile';
import { toast } from 'react-hot-toast';

function UsernameSection({ user, onDisplayNameUpdate, isOpen }) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [isDisplayNameLoading, setIsDisplayNameLoading] = useState(false);

  useEffect(()=>{
    if(isOpen) setIsEditing(false)
  },[isOpen])

  useEffect(() => {
    const validateUsername = async () => {
      if (!displayName) {
        setUsernameError('');
        return;
      }

      const validationError = validateField('username', displayName);
      if (validationError) {
        setUsernameError(validationError);
        return;
      }

      try {
        const isAvailable = await checkUsernameAvailability(displayName);
        setUsernameError(isAvailable ? '' : "Nom d'utilisateur indisponible");
      } catch (error) {
        console.error('Error checking username availability:', error);
        setUsernameError('Erreur lors de la vérification du nom d\'utilisateur');
      }
    };

    const timeoutId = setTimeout(validateUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [displayName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisplayNameLoading(true);
    if (usernameError || !displayName || displayName === user.displayName) return;
    try {
      await updateUserProfile(user.uid, { displayName: displayName });
      const success = onDisplayNameUpdate(displayName);
      toast.success('Profil mis à jour avec succès');
      if (success) {
        setIsEditing(false);
      }
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return false;
    } finally {
      setIsDisplayNameLoading(false);
    }
  };

    
    

  return (
    <section className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-50" />
      <h2 className="text-xl md:text-2xl font-semibold text-amber-600 pb-4">
        Nom d&apos;utilisateur
      </h2>
      
      <form onSubmit={handleSubmit} className="relative">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex-grow">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nouveau nom d'utilisateur"
                className="w-full p-4 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
              {usernameError && (
                <p className="text-sm text-amber-600 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 mt-2">
                  {usernameError}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isDisplayNameLoading || !displayName || !!usernameError || displayName === user.displayName}
                className={`
                  px-6 py-3.5 rounded-xl font-medium transition-all duration-300
                  ${isDisplayNameLoading || !displayName || !!usernameError || displayName === user.displayName
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-800 text-white'
                  }
                `}
              >
                {isDisplayNameLoading ? 'Mise à jour...' : 'Mettre à jour'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setDisplayName(user.displayName || '');
                }}
                className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-white/80 p-4 rounded-xl border border-gray-100 gap-4 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <p className="text-gray-700 text-lg font-medium">{user.displayName}</p>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 w-full sm:w-auto font-medium"
            >
              Modifier
            </button>
          </div>
        )}
      </form>
    </section>
  );
}

UsernameSection.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    displayName: PropTypes.string
  }).isRequired,
  onDisplayNameUpdate: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default UsernameSection;