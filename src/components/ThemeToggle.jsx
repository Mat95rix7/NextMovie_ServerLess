import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                 transition-all duration-300 transform hover:scale-110">
      {!isDarkMode ? 
      <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      :
      <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      }
    </button>
  );
}

export default ThemeToggle;