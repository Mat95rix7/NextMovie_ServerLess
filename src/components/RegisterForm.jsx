import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createUserProfile } from '../services/userService';
import { Link, useNavigate } from 'react-router-dom';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState("")
  const { signup } = useAuth();
  const navigate = useNavigate()



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signup(email, password);
      await createUserProfile(userCredential.user.uid, {
        username,
        email
      });
      navigate('/Login')
    } catch (error) {
      console.log(error.message);
      if (error.message.startsWith("Firebase: Error (auth/invalid-email)")) {
        setValidation("Email format invalid")
      } else if (error.message.startsWith("Firebase: Password should be at least 6 characters (auth/weak-password)")) {
        setValidation("weak-password");
      } else if (error.message.startsWith("Firebase: Error (auth/email-already-in-use)")) {
        setValidation("email-already-in-use");
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
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
        {isLoading ? 'Inscription...' : 'Inscription'}
      </button>
      <p className='text-white text-center mt-1'>Have already an account  ? <Link to="/Login" className='text-amber-400'>Sign In</Link></p>
    </form>
  );
}