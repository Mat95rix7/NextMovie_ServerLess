import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import logo from '../assets/Logo.jpg';
import userIcon from '../assets/user.png';
import  { getUserProfile }  from '../services/userService';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    const removeSpace = location?.search?.split("%20")?.join(" ").slice(1);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchInput, setSearchInput] = useState(removeSpace);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState('');

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Déconnexion réussie');
            navigate('/');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
            console.log(error);
        }
        setIsDropdownOpen(false);
    };

      useEffect(() => {
        const loadProfile = async () => {
          if (user) {
            const userProfile = await getUserProfile(user.uid);
            setProfile(userProfile);
            setUsername(userProfile?.username || '');
          }
        };
        loadProfile();
      }, [user]);

    useEffect(() => {
        window.onclick = (event) => {
            if (!event.target.matches('.dropdown')) {
                setIsDropdownOpen(false);
            }
        };
    }, []);

    useEffect(() => {
        if(searchInput) {
            navigate(`/search?${searchInput}`);
        }
    }, [searchInput, navigate]);

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };
    
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchInput("");
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    useEffect(() => {
        const handleBackButton = (e) => {
            e.preventDefault();
            setSearchInput("");
        };
     
        window.addEventListener('popstate', handleBackButton);
        
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [navigate]);
    
    return (
        <header className='fixed top-0 w-full h-16 bg-black bg-opacity-50 z-40'>
            <div className='container mx-auto px-3 flex items-center h-full'>
                <Link to={"/"}>
                    <img
                        src={logo}
                        alt='logo'
                        className='w-9 min-w-8 rounded-lg'
                    />
                </Link>

                <div className='ml-auto flex items-center gap-10'>
                    <form className='flex items-center gap-2' 
                        onSubmit={handleSearchSubmit}
                    >
                        <input
                            type='text'
                            placeholder='Tapez votre recherche...'
                            className='bg-transparent px-4 py-1 outline-none border-none hidden md:block text-white'
                            onChange={handleInputChange}
                            value={searchInput}
                        />
                        <button className='text-2xl text-white' onClick={toggleSearch}>
                            <IoSearchOutline/>
                        </button>
                    </form>

                    <div className="relative inline-block w-8 h-8">
                    {user ? 
                            <span 
                                onClick={toggleDropdown}
                                className="dropdown rounded-full w-full h-full cursor-pointer text-amber-400">
                                { username || user.email?.split('@')[0] }
                            </span>
                             :
                            <button 
                                onClick={toggleDropdown}
                                className="dropdown rounded-full w-full h-full cursor-pointer"
                                >
                                <img 
                                    src={userIcon}
                                    alt="User menu"
                                    className="dropdown w-full h-full"/>
                            </button>
                    }
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 rounded-lg bg-gray-50 min-w-[160px] shadow-lg z-[31]">
                                {user ? (
                                    <>
                                        <Link 
                                            to="/profile"
                                            className="block px-4 py-2 text-black text-center hover:bg-gray-300 rounded-t-lg"
                                        >
                                            Mon Espace
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-black text-center hover:bg-gray-300 rounded-b-lg"
                                        >
                                            Déconnexion
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link 
                                            to="/login"
                                            className="block px-4 py-2 text-black text-center hover:bg-gray-300 rounded-t-lg"
                                        >
                                            Connexion
                                        </Link>
                                        <Link 
                                            to="/register"
                                            className="block px-4 py-2 text-black text-center hover:bg-gray-300 rounded-b-lg"
                                        >
                                            Inscription
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isSearchOpen && (
                <div className='md:hidden my-2 mx-4 sticky top-[70px] z-30'>
                    <input 
                        type='text'
                        placeholder='Tapez votre recherche...'
                        onChange={handleInputChange}
                        value={searchInput}
                        className='px-4 py-1 text-lg w-full bg-white rounded-full text-neutral-900'
                    />
                </div>
            )}
        </header>
    );
};

export default Header;