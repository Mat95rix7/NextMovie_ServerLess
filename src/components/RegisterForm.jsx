import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createUserProfile, checkUsernameAvailability } from '../services/userProfile';
import { Link, useNavigate } from 'react-router-dom';
import { validateField } from '../services/errorMessages';
import  SuccessModal  from './SuccessModal';

export function RegisterForm() {

  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState("");
  const [validUsername, setValidUsername] = useState("")
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { signup } = useAuth();
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
 
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  useEffect(() => {
    setValidUsername('')
    const checkUsername = async() => {
      const check = await checkUsernameAvailability(formData.displayName)
      if(!check) {
        setValidUsername("Nom d'utilisateur déjà pris");
      }
    };
    checkUsername()
  }, [formData.displayName])

  useEffect(() => {
    setValidation('')
    if(formData.password !== formData.confirmPassword) {
      setValidation("Les mots de passe ne sont pas identiques");
    }
  },[formData.password, formData.confirmPassword])
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);  
    if(validation) {
      setIsLoading(false);
      return
    }
    try {
          const userCredential = await signup(formData.email, formData.password, formData.displayName);
          await createUserProfile(userCredential.user.uid, {
            displayName: formData.displayName,
            email: formData.email
          });
          setShowModal(true);
          navigate("/")
      } catch (error) {
          if (error.message.startsWith("Firebase: Error (auth/email-already-in-use)")) {
            setValidation("Email déjà utilisé")
          }
        } finally {
          setIsLoading(false);
        }
      }

  return (
    <div className='w-full max-w-xs'>
      <h1 className="text-4xl text-amber-500 font-bold capitalize text-center">
          Inscription
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs">

          <input
            className="mb-3 p-4 text-lg border text-gray-500 border-gray-300 rounded-md"
            type="text"
            placeholder="Nom d'utilisateur"
            name='displayName'
            value={formData.displayName}
            onChange={handleChange}
            required
          />
          {errors.displayName && (
              <p className="mb-3 text-center text-sm text-amber-500">{errors.displayName}</p>
            )}
          {validUsername && (
              <p className="mb-3 text-center text-sm text-amber-500">{validUsername}</p>
            )}
            
          <input
            className="mb-3 p-4 text-lg border text-gray-500 border-gray-300 rounded-md"
            type="email"
            name='email'
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
              <p className="mb-3 text-center text-sm text-amber-500">{errors.email}</p>
            )}
            
          <input
            className="mb-3 p-4 text-lg border text-gray-500 border-gray-300 rounded-md"
            type="password"
            name='password'
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
            {errors.password && (
              <p className="mb-3 text-center text-sm text-amber-500">{errors.password}</p>
            )}
            
          <input
            className="mb-3 p-4 text-lg border text-gray-500 border-gray-300 rounded-md"
            type="password"
            name='confirmPassword'
            placeholder="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
              <small className="mb-3 text-center text-sm text-amber-500">{errors.confirmPassword}</small>
            )}
          
          <p className="mb-3 text-center text-sm text-amber-500">{validation}</p>
            
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-t from-amber-400 to-amber-700 text-white text-xl font-bold py-4 px-4 rounded-md hover:bg-amber-600 transition-colors duration-300 ease-in-out disabled:opacity-50"
        >
          {isLoading ? 'Inscription...' : 'Inscription'}
        </button>
        <p className='text-white text-center mt-3'>Vous avez déjà un compte ? <Link to="/Login" className='text-amber-400'>Connectez-vous</Link></p>
      </form>

      <SuccessModal 
          showModal={showModal}
          setShowModal={setShowModal}
          type="Inscription"
        />

      </div>
  );
}