import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import  { useAuth }  from '../context/useAuth';
import { toast } from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/Logo.jpg';
import userIcon from '../assets/user.png';
import { Button } from './ui/button';
import { GiHamburgerMenu } from "react-icons/gi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger, 
} from './ui/dropdown-menu';
import { IoCompassOutline, IoHomeOutline, IoInformationCircleOutline, IoMailOutline, IoSearchOutline } from "react-icons/io5";
import { set } from 'lodash';

const HeaderComponent = () => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, setUser, isAdmin } = useAuth();
    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setUser(null);
            toast.success('Déconnexion réussie');
            navigate('/');
        } catch (error) {
            toast.error('Erreur lors de la déconnexion');
            console.error(error);
        }
    }, [logout, navigate]);

    const menuItems = user
        ? [
            { label: "Mon Espace", onClick: () => navigate('/profile') },
            ...(isAdmin ? [{ label: "Administration", onClick: () => navigate('/admin') }] : []),
            { label: "Déconnexion", onClick: handleLogout }
          ]
        : [
            { label: "Connexion", onClick: () => navigate('/login') },
            { label: "Inscription", onClick: () => navigate('/register') }
          ];

    const navItems = [
        { to: "/", label: "Accueil", icon: <IoHomeOutline className="w-6 h-6 text-amber-600" /> },
        { to: "/explore", label: "Explorer", icon: <IoCompassOutline className="w-6 h-6 text-amber-600" /> },
        { to: "/search", label: "Rechercher", icon: <IoSearchOutline className="w-6 h-6 text-amber-600" /> },
        { to: "/about", label: "À propos", icon: <IoInformationCircleOutline className="w-6 h-6 text-amber-600" /> },
        { to: "/contact", label: "Contact", icon: <IoMailOutline className="w-6 h-6 text-amber-600" /> },
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 767) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <header className='fixed top-0 w-full min-w-[320px] h-14 sm:h-16 px-4 sm:px-6 lg:px-8 bg-gray-300 bg-opacity-50 dark:bg-black dark:bg-opacity-50 z-40 backdrop-blur-sm transition-all duration-300 ease-in-out'>
            <div className='container mx-auto px-2 sm:px-3 max-w-7xl flex items-center h-full'>
                {/* Première section: Burger + Logo */}
                <div className="flex items-center flex-shrink-0 mr-auto">
                    {/* Burger Menu */}
                    <div className="md:hidden mr-1">
                        <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="p-1 m-2">
                                    <GiHamburgerMenu  size={48} className="text-amber-600 stroke-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="w-48 dark:bg-gray-100 bg-gray-900 dark:text-gray-800 text-gray-300 border-none rounded-lg shadow-lg"
                            >
                                {navItems.map((item, index) => (
                                    <Link 
                                        key={index} 
                                        to={item.to} 
                                        className="flex items-center gap-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-800 rounded-lg m-1"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.icon}
                                        <span className="text-lg font-bold">{item.label}</span>
                                    </Link>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2">
                        <img 
                            src={logo} 
                            alt='logo'
                            className='w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded object-contain'
                        />
                        <span className="text-[clamp(1rem,2vw,1.5rem)] font-bold text-amber-600">
                            NextMovie
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}

                <div className="hidden md:flex items-center justify-center flex-1 gap-[clamp(1rem,3.5vw,5rem)]">
                    {[
                        { to: "/explore", text: "Explorer" },
                        { to: "/search", text: "Rechercher" },
                        { to: "/about", text: "À propos" },
                        { to: "/contact", text: "Contact" }
                    ].map(link => (
                        <Link 
                            key={link.to}
                            to={link.to} 
                            className={`text-[clamp(1rem,2vw,1.3rem)] font-bold transition-colors relative
                                ${location.pathname === link.to 
                                ? "text-amber-600 dark:text-amber-600 after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[3px] after:bg-amber-600" 
                                : "text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-600"}`}
                        >
                            {link.text}
                        </Link>
                    ))}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* User Menu */}
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger asChild>
                            {user ? (
                                <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                    {user.photoURL ? (
                                        <img 
                                            src={user.photoURL} 
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-bold block text-amber-600 sm:hidden">
                                            {(user.displayName || user.email?.split('@')[0])}
                                        </span>
                                    )}
                                    <span className="hidden sm:block text-amber-600 font-bold">
                                        {user.displayName || user.email?.split('@')[0]}
                                    </span>
                                </button>
                            ) : (
                                <Button variant="ghost" className="p-2">
                                    <img 
                                        src={userIcon} 
                                        alt="User" 
                                        className="w-8 h-8"
                                    />
                                </Button>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 dark:bg-gray-100 bg-gray-900 text-amber-600 border-none rounded-lg shadow-lg">
                            {menuItems.map((item, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={item.onClick}
                                    className="flex justify-center py-2 text-lg font-bold cursor-pointer rounded-lg"
                                >
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

const Header = React.memo(HeaderComponent);
Header.displayName = 'Header';

export default Header;

// import React, { useState, useCallback } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { IoSearchOutline } from "react-icons/io5";
// import { useAuth } from '../hooks/useAuth';
// import { useAuth2 } from '../context/auth/authContext';
// import { toast } from 'react-hot-toast';
// import ThemeToggle from './ThemeToggle';
// import logo from '../assets/Logo.jpg';
// import explore from '../assets/explore.svg';
// import userIcon from '../assets/user.png';
// import { Button } from '@/components/ui/button';
// import { cn } from '@/lib/utils';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger, 
// } from '@/components/ui/dropdown-menu';

// // Styles communs extraits
// const iconButtonStyle = "flex-shrink-0 h-10 sm:h-full px-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors";
// const usernameStyle = "text-base sm:text-lg md:text-xl text-black dark:text-amber-600 font-semibold min-w-[80px] sm:min-w-[100px]";

// const HeaderComponent = () => {
//     const navigate = useNavigate();
//     const { logout } = useAuth();
//     const [isOpen, setIsOpen] = useState(false);
//     const { user, isAdmin } = useAuth2();

//     const location = useLocation().pathname.slice(1);
 
//     const handleLogout = useCallback(async () => {
//         try {
//             await logout();
//             toast.success('Déconnexion réussie');
//             navigate('/');
//         } catch (error) {
//             toast.error('Erreur lors de la déconnexion');
//             console.error(error);
//         }
//     }, [logout, navigate]);

//     const menuItems = user
//         ? [
//             { label: "Mon Espace", onClick: () => navigate('/profile') },
//             ...(isAdmin ? [{ label: "Administration", onClick: () => navigate('/admin') }] : []),
//             { label: "Déconnexion", onClick: handleLogout }
//           ]
//         : [
//             { label: "Connexion", onClick: () => navigate('/login') },
//             { label: "Inscription", onClick: () => navigate('/register') }
//           ];

//     return (
//         <header className='fixed top-0 w-full h-14 sm:h-16 px-4 sm:px-6 lg:px-8 bg-gray-300 bg-opacity-50 dark:bg-black dark:bg-opacity-50 z-40 backdrop-blur-sm transition-all duration-300 ease-in-out'>
//             <div className='container mx-auto px-2 sm:px-3 max-w-7xl flex items-center justify-between h-full'>
//                 {/* Logo */}
//                 <Link to={"/"} className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
//                     <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0">
//                         <img 
//                             src={logo} 
//                             alt='logo' 
//                             height="32"
//                             width="32"
//                             className='w-full h-full rounded object-contain'
//                         />
//                     </div>
//                     <span className="text-base sm:text-xl md:text-2xl font-bold text-amber-600 mx-1 sm:mx-2 hidden xs:block">NextMovie</span>
//                 </Link>
//                 {/* Right Section */}                    
//                 <Link to="/explore">
//                     <div className='text-base sm:text-xl md:text-2xl font-bold text-amber-600 mx-1 sm:mx-2 hidden md:block'>Explorer</div>
//                     <div className='text-base sm:text-xl md:text-2xl font-bold  mx-1 sm:mx-2 block md:hidden'>
//                         <img 
//                             src={explore} 
//                             alt="Explorer"
//                             height="32"
//                             width="32"
//                             className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl object-cover flex-shrink-0"
//                         />
//                     </div>
//                 </Link>
//                 <div className='flex items-center gap-1 xs:gap-2 sm:gap-5'>

                    
//                     {/* Search Icon */}
//                     <div className="me-0 sm:me-16">
//                         <IoSearchOutline 
//                             className={cn(
//                                 "text-xl sm:text-2xl cursor-pointer hover:text-amber-600 transition-colors",
//                                 location === "search" ? "hidden" : "block"
//                             )}
//                             onClick={() => navigate("/search")}
//                             aria-label="Rechercher"
//                         />
//                     </div>
//                     {/* User Dropdown */}
//                     <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
//                         <DropdownMenuTrigger asChild aria-label="Menu utilisateur">
//                             {user ? (
//                                 <button className="flex items-center gap-2 cursor-pointer px-1 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
//                                     {user.photoURL ? (
//                                         <img 
//                                             src={user.photoURL} 
//                                             alt="Photo de profil"
//                                             height="32"
//                                             width="32"
//                                             className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl object-cover flex-shrink-0"
//                                         />
//                                     ) : null}
//                                     <span className={usernameStyle}>
//                                         {user.displayName || user.email?.split('@')[0]}
//                                     </span>
//                                 </button>
//                             ) : (
//                                 <Button 
//                                     variant="ghost" 
//                                     className={iconButtonStyle}
//                                     aria-label="Ouvrir le menu utilisateur"
//                                 >
//                                     <img src={userIcon} alt="Icône utilisateur" 
//                                             height="32"
//                                             width="32"
//                                             className="w-8 sm:w-9"/>
//                                 </Button>
//                             )}
//                         </DropdownMenuTrigger>

//                         <DropdownMenuContent 
//                             align="end" 
//                             className="w-40 sm:w-48 rounded-xl bg-gray-100 text-amber-700 border-none shadow-lg"
//                         >
//                             {menuItems.map((item, index) => (
//                                 <DropdownMenuItem
//                                     key={index}
//                                     className="font-bold rounded-xl cursor-pointer text-base sm:text-lg justify-center py-2.5 hover:bg-amber-100 transition-colors"
//                                     onClick={item.onClick}
//                                 >
//                                     <span>{item.label}</span>
//                                 </DropdownMenuItem>
//                             ))}
//                         </DropdownMenuContent>
//                     </DropdownMenu>
//                     <div className="flex-shrink-0 ml-2 sm:ml-5 md:ml-10">
//                         <ThemeToggle />
//                     </div>
//                 </div>
//             </div>
//         </header>
//     );
// };

// // Utilisation de memo avec displayName
// const Header = React.memo(HeaderComponent);
// Header.displayName = 'Header';

// export default Header;
