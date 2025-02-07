import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateField } from '../../services/errorMessages';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';

function PasswordSection({ onPasswordUpdate, isOpen }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    actualPassword: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    actualPassword: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(()=>{
    if(isOpen) setIsEditing(false)
  },[isOpen])

  useEffect(() => {
    const validatePasswords = () => {
        const newErrors = { ...errors };
        newErrors.actualPassword = formData.actualPassword ? "" : "Le mot de passe actuel est requis";
        newErrors.password = validateField('password', formData.password);
        newErrors.confirmPassword = formData.password !== formData.confirmPassword ? "Les mots de passe ne correspondent pas" : ""; 
        setErrors(newErrors);
    };
    validatePasswords();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error)) return;
    setIsPasswordLoading(true);

    try {
      const auth = getAuth();
      const credential = EmailAuthProvider.credential(auth.currentUser.email, formData.actualPassword);
      try {

        await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (error) {
                if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            setErrors(prev => ({
            ...prev,
            actualPassword: "Le mot de passe actuel est incorrect"
            }));
            throw error;
        }
      }
      await updatePassword(auth.currentUser, formData.password);
      const success = await onPasswordUpdate(auth.currentUser, formData.password);
      toast.success("Mot de passe mis à jour avec succès !");
      if (success) handleCancel();
    } catch (error) {
        console.log(error);
      let errorMessage = "Erreur lors de la mise à jour du mot de passe";
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') errorMessage = "Le mot de passe actuel est incorrect";
      if (error.code === 'auth/weak-password') errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
      toast.error(errorMessage, error);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ actualPassword: '', password: '', confirmPassword: '' });
    setErrors({ actualPassword: '', password: '', confirmPassword: '' });
    setIsEditing(false);
  };

  const isFormValid = () => 
    formData.actualPassword.length >= 8 && 
    formData.password.length >= 8 && 
    formData.password === formData.confirmPassword &&
    !Object.values(errors).some(error => error);

  return (
    <section className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-50" />
      <h2 className="text-xl md:text-2xl font-semibold text-amber-600 pb-4">Mot de passe</h2>
      <form onSubmit={handleSubmit} className="relative">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex-grow">
              <input type="password" name="actualPassword" value={formData.actualPassword} onChange={handleChange} placeholder="Mot de passe actuel" required minLength={8} className="w-full p-4 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm" />
              {errors.actualPassword && <p className="text-sm text-amber-600 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 mt-2">{errors.actualPassword}</p>}
            </div>
            <div className="space-y-4">
                <div className="flex-grow">
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nouveau mot de passe" required minLength={8} className="w-full p-4 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm" />
                    {errors.password && <p className="text-sm text-amber-600 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 mt-2">{errors.password}</p>}
              </div>
            </div>
            <div className="space-y-4">
                <div className="flex-grow">
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirmer le nouveau mot de passe" required minLength={8} className="w-full p-4 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm" />
                    {errors.confirmPassword && <p className="text-sm text-amber-600 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 mt-2">{errors.confirmPassword}</p>}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
              type="submit" 
              disabled={isPasswordLoading || !isFormValid()} 
              className={`
              px-6 py-3.5 rounded-xl font-medium transition-all duration-300
                ${isPasswordLoading || !isFormValid() ? 'bg-gray-500 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-800 text-white'}
              `}
              >
                {isPasswordLoading ? "Mise à jour..." : "Mettre à jour"}
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium">Annuler</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-white/80 p-4 rounded-xl border border-gray-100 gap-4 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <p className="text-gray-700 text-lg font-medium">••••••••</p>
            <button type="button" onClick={() => setIsEditing(true)} className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 w-full sm:w-auto font-medium">Modifier</button>
          </div>
        )}
      </form>
    </section>
  );
}

PasswordSection.propTypes = {
  onPasswordUpdate: PropTypes.func,
  isOpen: PropTypes.bool.isRequired
};

export default PasswordSection;
