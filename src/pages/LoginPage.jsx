import { LoginForm } from '../components/LoginForm';
import Logo from '../assets/Logo.jpg';
import { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  return (
        <div className="flex flex-col md:flex-row h-screen">
          <Toaster position="top-right" />

          {/* Section Connexion */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-500 p-5">
            <div className="relative flex flex-col items-center justify-center 
              bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl w-full max-w-md py-10 
              shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 
              border border-gray-700 hover:border-amber-500 animate-fade-in">
              
              <h1 className="text-4xl mb-10 text-amber-500 font-bold capitalize">
                Connexion
              </h1>
              <LoginForm />
            </div>
          </div>

          {/* Section Image */}
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-800">
            <img
              src={Logo}
              alt="Logo"
              className="max-w-28 h-auto rounded-2xl shadow-md"
            />
          </div>
        </div>
  );
}

export default LoginPage;