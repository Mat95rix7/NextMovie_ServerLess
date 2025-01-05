import { LoginForm } from '../components/LoginForm';
import Logo from '../assets/Logo.jpg';
import { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  return (
    <div className="flex h-screen">
      <Toaster position="top-right" />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-500 p-5">
        <h1 className="text-4xl mb-10 text-amber-300 font-semibold capitalize">
          Connexion
        </h1>
        <LoginForm />
      </div>
      <div className="md:flex-1 flex items-center justify-center bg-gray-800">
        <img
          src={Logo}
          alt="Logo"
          className="max-w-28 h-auto rounded-2xl shadow-lg hidden md:block"
        />
      </div>
    </div>
  );
}

export default LoginPage;