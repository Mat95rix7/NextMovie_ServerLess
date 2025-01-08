import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createUserProfile } from '../services/userService';
import { Link, useNavigate } from 'react-router-dom';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState("")
  const [errors, setErrors] = useState({});

  const { signup } = useAuth();
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {};

    // Regex pour valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }

    // Regex pour valider le mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.";
    }

    // Vérification de la confirmation du mot de passe
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

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
      {errors.email && <small className="error-message">{errors.email}</small>}
      <input
        className="mb-3 p-4 text-lg border border-gray-300 rounded-md"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errors.password && (
          <small className="error-message">{errors.password}</small>
      )}
      <p className="text-amber-400 text-center mb-6">{validation}</p>
      <input
        className="mb-3 p-4 text-lg border border-gray-300 rounded-md"
        type="password"
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {errors.confirmPassword && (
          <small className="error-message">{errors.confirmPassword}</small>
        )}
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