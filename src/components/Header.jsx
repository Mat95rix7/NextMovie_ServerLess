import React, { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { useAuth } from '../hooks/useAuth';
import { useAuth2 } from '../context/auth/authContext';
import { toast } from 'react-hot-toast';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/Logo.jpg';
import userIcon from '../assets/user.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger, 
} from '@/components/ui/dropdown-menu';

// Styles communs extraits
const iconButtonStyle = "flex-shrink-0 h-10 sm:h-full px-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors";
const usernameStyle = "text-base sm:text-lg md:text-xl text-black dark:text-amber-600 font-semibold min-w-[80px] sm:min-w-[100px]";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAdmin } = useAuth2();

    const location = useLocation().pathname.slice(1);
 
    const handleLogout = useCallback(async () => {
        try {
            await logout();
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

    return (
        <header className='fixed top-0 w-full h-14 sm:h-16 px-4 sm:px-6 lg:px-8 bg-gray-300 bg-opacity-50 dark:bg-black dark:bg-opacity-50 z-40 backdrop-blur-sm transition-all duration-300 ease-in-out'>
            <div className='container mx-auto px-2 sm:px-3 max-w-7xl flex items-center justify-between h-full'>
                {/* Logo */}
                <Link to={"/"} className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0">
                        <img 
                            src={logo} 
                            alt='logo' 
                            className='w-full h-full rounded object-contain'
                        />
                    </div>
                    <span className="text-base sm:text-xl md:text-2xl font-bold text-amber-600 mx-1 sm:mx-2 hidden xs:block">NextMovie</span>
                </Link>
                {/* Right Section */}
                <div className='flex items-center gap-1 xs:gap-2 sm:gap-5'>
                    {/* Search Icon */}
                    <div className="me-0 sm:me-16">
                        <IoSearchOutline 
                            className={cn(
                                "text-xl sm:text-2xl cursor-pointer hover:text-amber-600 transition-colors",
                                location === "search" ? "hidden" : "block"
                            )}
                            onClick={() => navigate("/search")}
                            aria-label="Rechercher"
                        />
                    </div>
                    {/* User Dropdown */}
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger asChild aria-label="Menu utilisateur">
                            {user ? (
                                <div className="flex items-center gap-2 cursor-pointer px-1 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                    {user.photoURL ? (
                                        <img 
                                            src={user.photoURL} 
                                            alt="Photo de profil" 
                                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl object-cover flex-shrink-0"
                                        />
                                    ) : null}
                                    <span className={usernameStyle}>
                                        {user.displayName || user.email?.split('@')[0]}
                                    </span>
                                </div>
                            ) : (
                                <Button 
                                    variant="ghost" 
                                    className={iconButtonStyle}
                                    aria-label="Ouvrir le menu utilisateur"
                                >
                                    <img src={userIcon} alt="Icône utilisateur" className="w-8 sm:w-9"/>
                                </Button>
                            )}
                        </DropdownMenuTrigger>

                        <DropdownMenuContent 
                            align="end" 
                            className="w-40 sm:w-48 rounded-xl bg-gray-100 text-amber-700 border-none shadow-lg"
                        >
                            {menuItems.map((item, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    className="font-bold rounded-xl cursor-pointer text-base sm:text-lg justify-center py-2.5 hover:bg-amber-100 transition-colors"
                                    onClick={item.onClick}
                                >
                                    <span>{item.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex-shrink-0 ml-2 sm:ml-5 md:ml-10">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
};

// Utilisation de memo avec displayName
const Header = React.memo(HeaderComponent);
Header.displayName = 'Header';

export default Header;