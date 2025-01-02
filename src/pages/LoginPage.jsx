import { useState } from "react";
import Logo from '../assets/Logo.jpg'

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Nom d'utilisateur:", username);
    console.log("Mot de passe:", password);

  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-500 p-5">
        <h1 className="text-4xl mb-10 text-amber-300 font-semibold capitalize">Connexion</h1>
        <form onSubmit={handleLogin} className="flex flex-col w-full max-w-xs">
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
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-amber-400 text-white font-bold py-4 px-4 rounded-md hover:bg-amber-600 transition-colors duration-300 ease-in-out">
            Se connecter
          </button>
        </form>
      </div>
      <div className="md:flex-1 flex items-center justify-center bg-gray-800 ">
        <img src={Logo} alt="Logo" className="max-w-28 h-auto rounded-2xl shadow-lg hidden md:block" />
      </div>
    </div>
  );
};

export default LoginPage;
