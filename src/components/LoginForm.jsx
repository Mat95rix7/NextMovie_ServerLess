import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState("")
  const { login } = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setValidation('')
      await login(email, password);
      navigate('/')
    } catch (error) {
      console.log(error.message);
      if (error.message.startsWith("Firebase: Error (auth/invalid-email)")) {
        setValidation("Email format invalid")
      } else if (error.message.startsWith("Firebase: Error (auth/invalid-credential)")) {
        setValidation("Email and/or password incorrect");
      } else {
        setValidation("An unexpected error occurred"); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs">
      <input
        className="mb-6 p-4 text-lg border border-gray-300 rounded-md"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="mb-3 p-4 text-lg border border-gray-300 rounded-md"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <p className="text-amber-400 text-center mb-6">{validation}</p>
      <button
        type="submit"
        disabled={isLoading}
        className="bg-amber-400 text-white font-bold py-4 px-4 rounded-md hover:bg-amber-600 transition-colors duration-300 ease-in-out disabled:opacity-50"
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
      <p className='text-white text-center mt-1'>Don&apos;t Have an account ? <Link to="/Register" className='text-amber-400'>Sign Up</Link></p>
    </form>
  );
}