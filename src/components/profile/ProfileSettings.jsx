// import { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { updateProfile, checkUsernameAvailability } from '../../hooks/userProfile';
// import PropTypes from 'prop-types';
// import { validateField } from '../../services/errorMessages';

// export function ProfileSettings({ user, onUpdate }) {
//   const [displayName, setDisplayName] = useState(user.displayName || '');
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [usernameError, setUsernameError] = useState('');
//   const [isEditingPassword, setIsEditingPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     actualPassword: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [errors, setErrors] = useState({
//     actualPassword: '',
//     password: '',
//     confirmPassword: ''
//   });

//   // Debounced username validation
//   useEffect(() => {
//     const debounceTimeout = setTimeout(async () => {
//       if (!displayName) {
//         setUsernameError('');
//         return;
//       }

//       const validationError = validateField('username', displayName);
//       if (validationError) {
//         setUsernameError(validationError);
//         return;
//       }

//       try {
//         const isAvailable = await checkUsernameAvailability(displayName);
//         setUsernameError(isAvailable ? '' : "Nom d'utilisateur indisponible");
//       } catch (error) {
//         console.error('Error checking username availability:', error);
//         setUsernameError('Erreur lors de la vérification du nom d&apos;utilisateur');
//       }
//     }, 500);

//     return () => clearTimeout(debounceTimeout);
//   }, [displayName]);

//   // Password validation
//   useEffect(() => {
//     if (!formData.password && !formData.confirmPassword) {
//       setErrors(prev => ({ ...prev, confirmPassword: '' }));
//       return;
//     }

//     setErrors(prev => ({
//       ...prev,
//       confirmPassword: formData.password !== formData.confirmPassword
//         ? "Les mots de passe ne correspondent pas"
//         : ''
//     }));
//   }, [formData.password, formData.confirmPassword]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     const error = validateField(name, value);
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (usernameError || !displayName || displayName === user.displayName) {
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       await updateProfile(user.uid, { displayName });
//       onUpdate(displayName);
//       toast.success('Profil mis à jour avec succès');
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Profile update error:', error);
//       toast.error('Erreur lors de la mise à jour du profil');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancelPasswordEdit = () => {
//     setFormData({
//       actualPassword: '',
//       password: '',
//       confirmPassword: ''
//     });
//     setErrors({
//       actualPassword: '',
//       password: '',
//       confirmPassword: ''
//     });
//     setIsEditingPassword(false);
//   };

//   const handleUpdatePassword = async () => {
//     if (Object.values(errors).some(error => error) || 
//         Object.values(formData).some(value => !value)) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Replace with actual password update logic
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       toast.success("Mot de passe mis à jour avec succès !");
//       handleCancelPasswordEdit();
//     } catch (error) {
//       console.error('Password update error:', error);
//       toast.error("Erreur lors de la mise à jour du mot de passe");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderInput = (type, name, placeholder, value, onChange) => (
//     <div className="space-y-2">
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         aria-label={placeholder}
//         aria-invalid={!!errors[name]}
//         aria-describedby={errors[name] ? `${name}-error` : undefined}
//         className="w-full p-4 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
//       />
//       {errors[name] && (
//         <p 
//           id={`${name}-error`}
//           className="text-sm text-amber-600 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100"
//         >
//           {errors[name]}
//         </p>
//       )}
//     </div>
//   );

//   return (
//     <div className="w-full space-y-8 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white">
//       <h1 className="text-xl md:text-2xl font-semibold mb-2 text-amber-600">
//         Paramètres de profil
//       </h1>

//       {/* Username Section */}
//       <section className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-50" />
//         <h2 className="text-xl md:text-2xl font-semibold text-amber-600 pb-4">
//           Nom d'utilisateur
//         </h2>
        
//         <form onSubmit={handleSubmit} className="relative">
//           {isEditing ? (
//             <div className="space-y-4">
//               <div className="flex-grow">
//                 <input
//                   type="text"
//                   value={displayName}
//                   onChange={(e) => setDisplayName(e.target.value)}
//                   className="w-full p-4 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
//                   placeholder="Nouveau nom d'utilisateur"
//                   aria-label="Nouveau nom d'utilisateur"
//                   aria-invalid={!!usernameError}
//                   aria-describedby={usernameError ? "username-error" : undefined}
//                 />
//                 {usernameError && (
//                   <p 
//                     id="username-error"
//                     className="text-sm text-amber-600 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100 mt-2"
//                   >
//                     {usernameError}
//                   </p>
//                 )}
//               </div>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <button
//                   type="submit"
//                   disabled={isLoading || !displayName || !!usernameError || displayName === user.displayName}
//                   className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//                 >
//                   {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsEditing(false);
//                     setDisplayName(user.displayName || '');
//                   }}
//                   className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-white/80 p-4 rounded-xl border border-gray-100 gap-4 backdrop-blur-sm hover:shadow-md transition-all duration-300">
//               <p className="text-gray-700 text-lg font-medium">{user.displayName}</p>
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(true)}
//                 className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 w-full sm:w-auto font-medium"
//               >
//                 Modifier
//               </button>
//             </div>
//           )}
//         </form>
//       </section>

//       {/* Password Section */}
//       <section className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-50" />
//         <h2 className="text-xl md:text-2xl font-semibold text-amber-600 pb-4">
//           Mot de passe
//         </h2>
        
//         {isEditingPassword ? (
//           <div className="space-y-4">
//             {renderInput(
//               "password",
//               "actualPassword",
//               "Mot de passe actuel",
//               formData.actualPassword,
//               handleChange
//             )}
//             {renderInput(
//               "password",
//               "password",
//               "Nouveau mot de passe",
//               formData.password,
//               handleChange
//             )}
//             {renderInput(
//               "password",
//               "confirmPassword",
//               "Confirmer le mot de passe",
//               formData.confirmPassword,
//               handleChange
//             )}
            
//             <div className="flex flex-col sm:flex-row gap-3 pt-2">
//               <button
//                 type="button"
//                 disabled={isLoading || Object.values(errors).some(error => error) || 
//                          Object.values(formData).some(value => !value)}
//                 onClick={handleUpdatePassword}
//                 className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//               >
//                 {isLoading ? "Mise à jour..." : "Mettre à jour"}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancelPasswordEdit}
//                 className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col sm:flex-row items-center justify-between bg-white/80 p-4 rounded-xl border border-gray-100 gap-4 backdrop-blur-sm hover:shadow-md transition-all duration-300">
//             <p className="text-gray-700 text-lg font-medium">••••••••</p>
//             <button
//               type="button"
//               onClick={() => setIsEditingPassword(true)}
//               className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 w-full sm:w-auto font-medium"
//             >
//               Modifier
//             </button>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }

// ProfileSettings.propTypes = {
//   user: PropTypes.shape({
//     uid: PropTypes.string.isRequired,
//     displayName: PropTypes.string
//   }).isRequired,
//   onUpdate: PropTypes.func.isRequired,
// };

// export default ProfileSettings;

// components/profile/ProfileSettings.jsx

// import { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { 
//   EmailAuthProvider, 
//   reauthenticateWithCredential,
//   updatePassword,
//   getAuth 
// } from 'firebase/auth';
// import { updateProfile, checkUsernameAvailability } from '../../hooks/userProfile';
// import PropTypes from 'prop-types';
// import { validateField } from '../../services/errorMessages';

// export function ProfileSettings({ user, onUpdate }) {
//   const [displayName, setDisplayName] = useState(user.displayName || '');
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isValidating, setIsValidating] = useState(false); 
//   const [usernameError, setUsernameError] = useState('');
//   const [isEditingPassword, setIsEditingPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     actualPassword: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [errors, setErrors] = useState({
//     actualPassword: '',
//     password: '',
//     confirmPassword: ''
//   });


//   useEffect(() => {
//     const debounceTimeout = setTimeout(async () => {
//       if (!displayName) {
//         setUsernameError('');
//         return;
//       }

//       const validationError = validateField('username', displayName);
//       if (validationError) {
//         setUsernameError(validationError);
//         return;
//       }

//       try {
//         const isAvailable = await checkUsernameAvailability(displayName);
//         setUsernameError(isAvailable ? '' : "Nom d'utilisateur indisponible");
//       } catch (error) {
//         console.error('Error checking username availability:', error);
//         setUsernameError('Erreur lors de la vérification du nom d&apos;utilisateur');
//       }
//     }, 500);

//     return () => clearTimeout(debounceTimeout);
//   }, [displayName]);

//   useEffect(() => {
//     const validatePasswords = () => {
//       if (!formData.password && !formData.confirmPassword) {
//         setErrors(prev => ({ ...prev, confirmPassword: '' }));
//         return;
//       }

//       const newErrors = { ...errors };

//       if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
//       } else {
//         newErrors.confirmPassword = "";
//       }

//       // Validation du nouveau mot de passe
//       const passwordError = validateField('password', formData.password);
//       if (passwordError) {
//         newErrors.password = passwordError;
//       }

//       setErrors(newErrors);
//     };

//     const timeoutId = setTimeout(validatePasswords, 500);
//     return () => clearTimeout(timeoutId);
//   }, [formData.password, formData.confirmPassword]);

//   // Nouvelle fonction pour valider le mot de passe actuel
//   const validateCurrentPassword = async () => {
//     if (!formData.actualPassword) {
//       setErrors(prev => ({ ...prev, actualPassword: 'Ce champ est requis' }));
//       return;
//     }

//     setIsValidating(true); // Utilise l'état de validation spécifique
//     try {
//       const auth = getAuth();
//       const credential = EmailAuthProvider.credential(
//         auth.currentUser.email,
//         formData.actualPassword
//       );
//       await reauthenticateWithCredential(auth.currentUser, credential);
//       setErrors(prev => ({ ...prev, actualPassword: '' }));
//     } catch (error) {
//       console.error('Password verification error:', error);
//       let errorMessage = '';
      
//       if (error.code === 'auth/too-many-requests') {
//         errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
//         toast.error("Compte temporairement bloqué. Veuillez patienter quelques minutes.");
//       } else if (error.code === 'auth/wrong-password') {
//         errorMessage = "Le mot de passe actuel est incorrect";
//       } else {
//         errorMessage = "Erreur de vérification du mot de passe";
//       }
      
//       setErrors(prev => ({ ...prev, actualPassword: errorMessage }));
//     } finally {
//       setIsValidating(false); // Réinitialise l'état de validation
//     }
//   };
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (usernameError || !displayName || displayName === user.displayName) {
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       await updateProfile(user.uid, { displayName });
//       onUpdate(displayName);
//       toast.success('Profil mis à jour avec succès');
//       setIsEditing(false);
//     } catch (error) {
//       console.error('Profile update error:', error);
//       toast.error('Erreur lors de la mise à jour du profil');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleActualPasswordBlur = async () => {
//     if (!formData.actualPassword) return;

//     try {
//       const auth = getAuth();
//       const credential = EmailAuthProvider.credential(
//         auth.currentUser.email,
//         formData.actualPassword
//       );
//       await reauthenticateWithCredential(auth.currentUser, credential);
//       setErrors(prev => ({ ...prev, actualPassword: '' }));
//     } catch (error) {
//       console.error('Password verification error:', error);
      
//       if (error.code === 'auth/too-many-requests') {
//         setErrors(prev => ({ 
//           ...prev, 
//           actualPassword: "Trop de tentatives. Veuillez réessayer plus tard." 
//         }));
//         toast.error("Compte temporairement bloqué. Veuillez patienter quelques minutes.");
//       } else if (error.code === 'auth/wrong-password') {
//         setErrors(prev => ({ 
//           ...prev, 
//           actualPassword: "Le mot de passe actuel est incorrect" 
//         }));
//       }
//     }
//   };

//   const handleCancelPasswordEdit = () => {
//     setFormData({
//       actualPassword: '',
//       password: '',
//       confirmPassword: ''
//     });
//     setErrors({
//       actualPassword: '',
//       password: '',
//       confirmPassword: ''
//     });
//     setIsEditingPassword(false);
//   };

//   const handleUpdatePassword = async (e) => {
//     e.preventDefault();
    
//     if (!formData.actualPassword || !formData.password || !formData.confirmPassword) {
//       toast.error("Tous les champs sont requis");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setErrors(prev => ({
//         ...prev,
//         confirmPassword: "Les mots de passe ne correspondent pas"
//       }));
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const auth = getAuth();
//       await updatePassword(auth.currentUser, formData.password);
//       toast.success("Mot de passe mis à jour avec succès !");
//       handleCancelPasswordEdit();
//     } catch (error) {
//       console.error('Password update error:', error);
//       let errorMessage = "Erreur lors de la mise à jour du mot de passe";
      
//       switch (error.code) {
//         case 'auth/too-many-requests':
//           errorMessage = "Compte temporairement bloqué. Veuillez réessayer dans quelques minutes.";
//           break;
//         case 'auth/weak-password':
//           errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
//           break;
//         case 'auth/requires-recent-login':
//           errorMessage = "Veuillez vous reconnecter pour modifier votre mot de passe";
//           break;
//         default:
//           errorMessage = "Erreur lors de la mise à jour du mot de passe";
//       }
      
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderInput = (type, name, placeholder) => (
//     <div className="space-y-2">
//       <input
//         type={type}
//         name={name}
//         value={formData[name]}
//         onChange={handleChange}
//         onBlur={name === 'actualPassword' ? handleActualPasswordBlur : undefined}
//         placeholder={placeholder}
//         className="w-full p-4 border border-gray-200 text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
//       />
//       {errors[name] && (
//         <p className="text-sm text-amber-600 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100">
//           {errors[name]}
//         </p>
//       )}
//     </div>
//   );


//   return (
//     <div className="w-full space-y-8 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white">
//       <h1 className="text-xl md:text-2xl font-semibold mb-2 text-amber-600">
//         Paramètres de profil
//       </h1>

//       {/* Section nom d'utilisateur */}
//       <section className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-50" />
//         <h2 className="text-xl md:text-2xl font-semibold text-amber-600 pb-4">
//           Nom d&apos;utilisateur
//         </h2>
        
//         <form onSubmit={handleSubmit} className="relative">
//           {isEditing ? (
//             <div className="space-y-4">
//               <div className="flex-grow">
//                 {renderInput('displayName', "Nouveau nom d'utilisateur", displayName, (e) => setDisplayName(e.target.value), 'text')}
//               </div>
//               <div className="flex flex-col sm:flex-row gap-3">
//                 <button
//                   type="submit"
//                   disabled={isLoading || !displayName || !!usernameError || displayName === user.displayName}
//                   className={`
//                     px-6 py-3.5 rounded-xl font-medium transition-all duration-300
//                     ${isLoading || !displayName || !!usernameError || displayName === user.displayName
//                       ? 'bg-gray-300 cursor-not-allowed'
//                       : 'bg-amber-600 hover:bg-amber-800 text-white'
//                     }
//                   `}
//                 >
//                   {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsEditing(false);
//                     setDisplayName(user.displayName || '');
//                   }}
//                   className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-white/80 p-4 rounded-xl border border-gray-100 gap-4 backdrop-blur-sm hover:shadow-md transition-all duration-300">
//               <p className="text-gray-700 text-lg font-medium">{user.displayName}</p>
//               <button
//                 type="button"
//                 onClick={() => setIsEditing(true)}
//                 className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 w-full sm:w-auto font-medium"
//               >
//                 Modifier
//               </button>
//             </div>
//           )}
//         </form>
//       </section>

//       {/* Section mot de passe */}
//       <section className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent opacity-50"/>
//         <h2 className="text-xl md:text-2xl font-semibold text-amber-600 pb-4">
//           Mot de passe
//         </h2>
//         {isEditingPassword ? (
//           <div className="space-y-4">
//             {renderInput("password", "actualPassword", "Mot de passe actuel")}
//             {renderInput("password", "password", "Nouveau mot de passe")}
//             {renderInput("password", "confirmPassword", "Confirmer le nouveau mot de passe")}
            
//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={handleUpdatePassword}
//                 disabled={isLoading}
//                 className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 disabled:opacity-50"
//               >
//                 {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
//               </button>
//               <button
//                 onClick={() => {
//                   setIsEditingPassword(false);
//                   setFormData({
//                     actualPassword: '',
//                     password: '',
//                     confirmPassword: ''
//                   });
//                   setErrors({});
//                 }}
//                 className="bg-gray-100 text-gray-700 px-6 py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-300"
//               >
//                 Annuler
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-white/80 p-4 rounded-xl border border-gray-100 gap-4  backdrop-blur-sm hover:shadow-md transition-all duration-300">
//             <p className="text-gray-700 text-lg font-medium">••••••••</p>
//             <button
//               type="button"
//               onClick={() => setIsEditingPassword(true)}
//               className="bg-amber-600 text-white px-6 py-3.5 rounded-xl hover:bg-amber-800 transition-all duration-300 w-full sm:w-auto font-medium"
//             >
//               Modifier
//             </button>
//           </div>
//         )}

//       </section>
//     </div>
//   );
// }

// ProfileSettings.propTypes = {
//   user: PropTypes.shape({
//     uid: PropTypes.string.isRequired,
//     displayName: PropTypes.string,
//     email: PropTypes.string.isRequired
//   }).isRequired,
//   onUpdate: PropTypes.func.isRequired
// };

// export default ProfileSettings;
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  updatePassword,
  getAuth 
} from 'firebase/auth';
import { updateProfile } from '../../hooks/userProfile';
import PropTypes from 'prop-types';
import UsernameSection from './UsernameSection';
import PasswordSection from './PasswordSection';

export function ProfileSettings({ user, onDisplayNameUpdate, onPasswordUpdate }) {
  const [isDisplayNameLoading, setIsDisplayNameLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const handleProfileUpdate = async (newDisplayName) => {
    setIsDisplayNameLoading(true);
    try {
      await updateProfile(user.uid, { displayName: newDisplayName });
      onDisplayNameUpdate(newDisplayName);
      toast.success('Profil mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      return false;
    } finally {
      setIsDisplayNameLoading(false);
    }
  };

  const handlePasswordUpdate = async (currentPassword, newPassword) => {
    setIsPasswordLoading(true);
    console.log(isPasswordLoading);
    try {
      const auth = getAuth();
      // Vérification du mot de passe actuel
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Mise à jour du mot de passe
      await updatePassword(auth.currentUser, newPassword);
      onPasswordUpdate(auth.currentUser, newPassword)
      toast.success("Mot de passe mis à jour avec succès !");
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      let errorMessage = "Erreur lors de la mise à jour du mot de passe";
      
      switch (error.code) {
        case 'auth/too-many-requests':
          errorMessage = "Compte temporairement bloqué. Veuillez réessayer dans quelques minutes.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Le mot de passe actuel est incorrect";
          break;
        case 'auth/weak-password':
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
          break;
        case 'auth/requires-recent-login':
          errorMessage = "Veuillez vous reconnecter pour modifier votre mot de passe";
          break;
        default:
          errorMessage = "Erreur lors de la mise à jour du mot de passe";
      }
      
      toast.error(errorMessage);
      return false;
    } finally {
      setIsPasswordLoading(false);
    }
  };

  console.log("isLoading dans ProfileSettings:", isPasswordLoading);


  return (
    <div className="w-full space-y-8 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white">
      <h1 className="text-xl md:text-2xl font-semibold mb-2 text-amber-600">
        Paramètres de profil
      </h1>

      <UsernameSection 
        user={user}
        isDisplayNameLoading={isDisplayNameLoading}
        onDisplayNameUpdate={handleProfileUpdate}
      />

      <PasswordSection
        user={user}
        isPasswordLoading={isPasswordLoading}
        onPasswordUpdate={handlePasswordUpdate}
      />
    </div>
  );
}

ProfileSettings.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default ProfileSettings;