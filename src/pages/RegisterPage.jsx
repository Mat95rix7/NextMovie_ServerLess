import { RegisterForm } from '../components/RegisterForm';
// import Logo from '../assets/Logo.jpg';
import { Toaster } from 'react-hot-toast';
import BannerLogin from '../components/BannerLogin';

const RegisterPage = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Toaster position="top-right"/>
      {/* Section Inscription */}
      <div className="flex-1 flex flex-col items-center justify-center p-5">
        <div className="relative flex flex-col items-center justify-center 
          bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl w-full max-w-xl py-10 
          shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 
          border border-gray-700 hover:border-amber-500 animate-fade-in">
          <RegisterForm />
        </div>
      </div>

      {/* Section Image */}
      <div className="hidden md:flex flex-1 flex-col mx-10 my-auto rounded-2xl"> 

          <div className="relative rounded-2xl w-full max-w-xl 
          shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 
          border border-gray-700 hover:border-amber-500 animate-fade-in mx-auto my-5">
            <BannerLogin />
          </div>
          
          <div className="relative rounded-2xl w-full max-w-xl
          shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 
          border border-gray-700 hover:border-amber-500 animate-fade-in mx-auto my-5">
            <BannerLogin excludeIndex={-1}/>
          </div>
        {/* <img
          src={Logo}
          alt="Logo"
          className="max-w-28 h-auto rounded-2xl shadow-md"
        /> */}
      </div>
    </div>
  );
}

export default RegisterPage;