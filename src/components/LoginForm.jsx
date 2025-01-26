import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { validateField } from '../services/errorMessages';
import  SuccessModal  from './SuccessModal';
import { useUser } from '../context/userContext';

export function LoginForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMail, setErrorMail] = useState('');
  const [errorAuth, setErrorAuth] = useState('')
  const [showModal, setShowModal] = useState(false);

  const { dispatch } = useUser();

  const { login } = useAuth();
  const navigate = useNavigate()
  
  useEffect(() => {
    setErrorMail('')
    const error = validateField('email', email)
    if (error) setErrorMail(error);
  }, [email])



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorAuth('')

    if (errorMail) {
      setIsLoading(false)
      return
    }

    try {
      const user = await login(email, password);
      dispatch({ type: 'UPDATE_DISPLAY_NAME', payload: user.displayName });
      setShowModal(true);
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      if (error.message.startsWith("Firebase: Error (auth/invalid-credential)")) {
        setErrorAuth("Email et/ou mot de passe incorrect"); 
      } else {
        console.log(error.message);}
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-xs'>
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs">
        <input
          className="mb-3 p-4 text-lg border text-gray-500 border-gray-300 rounded-md"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        { errorMail && <p className="mb-3 text-center text-sm text-amber-500">{errorMail}</p>}

        <input
          className="mb-3 p-4 text-lg border text-gray-500 border-gray-300 rounded-md"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorAuth && <p className="mb-3 text-center text-sm text-amber-500">{errorAuth}</p>}
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-amber-400 text-white font-bold py-4 px-4 rounded-md hover:bg-amber-600 transition-colors duration-300 ease-in-out disabled:opacity-50"
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
        <p className='text-white text-center mt-3'>Don&apos;t Have an account ? <Link to="/Register" className='text-amber-400'>Sign Up</Link></p>
      </form>
      <SuccessModal 
        showModal={showModal}
        setShowModal={setShowModal}
        type="connexion"
      />
  </div>
  );
}