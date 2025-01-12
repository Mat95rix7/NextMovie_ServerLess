// import React, { useState, useEffect } from 'react';
// import { Sun, Moon } from 'lucide-react';

// const ThemeToggle = () => {
//   const [theme, setTheme] = useState('dark');

//   useEffect(() => {
//     // Vérifier si l'utilisateur a déjà une préférence sauvegardée
//     const savedTheme = localStorage.getItem('theme');
    
//     if (savedTheme) {
//       // Utiliser la préférence sauvegardée
//       setTheme(savedTheme);
//       document.documentElement.classList.toggle('dark', savedTheme === 'dark');
//     } else {
//       // Par défaut en mode sombre
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     document.documentElement.classList.toggle('dark');
//     localStorage.setItem('theme', newTheme);
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
//                  transition-all duration-300 transform hover:scale-110"
//       aria-label={`Basculer vers le mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
//     >
//       <div className="relative">
//       {theme === 'light' ? (
//         <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
//       ) : (
//         <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
//       )}
//       </div>
//       <span className="sr-only">
//         {theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
//       </span>
//     </button>
//   );
// };

// export default ThemeToggle;

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
//                  transition-all duration-300 transform hover:scale-110">
      {!isDarkMode ? 
      <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      :
      <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      }
    </button>
  );
}

export default ThemeToggle;