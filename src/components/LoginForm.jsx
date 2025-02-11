import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { validateField } from '../services/errorMessages';
import  SuccessModal  from './SuccessModal';
import { getUserProfile } from '../hooks/userProfile';
import ResetPasswordModal from './ResetPassword';
export function LoginForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMail, setErrorMail] = useState('');
  const [errorAuth, setErrorAuth] = useState('')
  const [showModal, setShowModal] = useState(false);
  const [showDeactivationModal, setShowDeactivationModal] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const { login, logout } = useAuth();
  const navigate = useNavigate()
  
  useEffect(() => {
    setErrorMail('')
    const error = validateField('email', email)
    if (error) setErrorMail(error);
  }, [email])

  const handleForgotPassword = () => {
    setEmail('');
    setPassword('');
    setIsResetModalOpen(true);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorAuth('')

    if (errorMail) {
      setIsLoading(false)
      return
    }

    try {
      const userData = await login(email, password);
      const userDoc = await getUserProfile(userData.uid)
      if (userDoc.isActive === false) {
        await logout();
        setIsLoading(false);
        setShowDeactivationModal(true)
        return
      }

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
      <h1 className="text-4xl mb-10 text-amber-500 font-bold capitalize text-center">
        Connexion
      </h1>
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
          className="bg-gradient-to-t from-amber-400 to-amber-700 text-white text-xl font-bold py-4 px-4 rounded-md hover:bg-amber-600 transition-colors duration-300 ease-in-out disabled:opacity-50"
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
        <p className='text-white text-center mt-3'>Vous n&apos;avez pas de compte ? <Link to="/Register" className='text-amber-400'>Inscrivez-Vous</Link></p>
        <ResetPasswordModal 
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
        />
      </form>
      <button
        type='button'
        onClick={handleForgotPassword}
        className="w-full text-amber-400 hover:text-amber-600 text-center mt-2"
        >
          Mot de passe oublié ?
      </button>
      <SuccessModal 
        showModal={showModal}
        setShowModal={setShowModal}
        type="connexion"
      />
      {/* Modal pour compte désactivé */}
      {showDeactivationModal && (
          <div className="fixed inset-0 bg-gray-600 text-gray-900 bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-sm md:max-w-md lg:max-w-lg">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-center">
                Compte désactivé
              </h2>
              <p className="mb-6 text-sm md:text-base text-center sm:text-justify">
                Votre compte est actuellement désactivé. Si vous souhaitez réactiver votre compte,
                veuillez nous contacter.
              </p>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-evenly space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm md:text-base"
                  onClick={() => setShowDeactivationModal(false)}
                >
                  Fermer
                </button>
                <button
                  className="w-full sm:w-auto bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 text-sm md:text-base"
                  onClick={() => navigate('/contact')}
                >
                  Contacter le support
                </button>
              </div>
            </div>
          </div>
      )}
  </div>
  );
}