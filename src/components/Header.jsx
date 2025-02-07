import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { useAuth } from '../hooks/useAuth';
import { useAuth2 } from '../context/userContext';
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

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAdmin } = useAuth2();

    useEffect(() => {
        console.log(user);
    }, [user]);

    const location = useLocation().pathname.slice(1);
 
    const menuItems = user
    ? [
        { label: "Mon Espace", onClick: () => navigate('/profile') },
        ...(isAdmin ? [{ label: "Dashboard", onClick: () => navigate('/admin') }] : []),
        { label: "Déconnexion", onClick: async() => {
            try {
                await logout();
                toast.success('Déconnexion réussie');
                navigate('/');
            } catch (error) {
                toast.error('Erreur lors de la déconnexion');
                console.log(error);
            }
        }}
      ]
    : [
        { label: "Connexion", onClick: () => navigate('/login') },
        { label: "Inscription", onClick: () => navigate('/register') }
      ];
    return (
         <header className='fixed top-0 w-full h-16 bg-gray-300 bg-opacity-50 dark:bg-black dark:bg-opacity-50  z-40'>
            <div className='container mx-auto px-3 flex items-center h-full'>
                <Link to={"/"}>
                    <img src={logo} alt='logo' className='w-9 min-w-8  rounded-lg'/>
                </Link>
                <div className='ml-auto flex items-center gap-10'>
                    <IoSearchOutline className={cn(
                "w-full text-2xl cursor-pointer",
                location === "search" ? "hidden" : "block")}
                    onClick={() => navigate("/search")}/>
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} >
                        <DropdownMenuTrigger asChild aria-label="User menu">
                            <div className="flex items-center gap-2 me-6 cursor-pointer">
                                {user ? (
                                    <>
                                        {user.photoURL && (
                                            <img src={user.photoURL} alt="User menu" className="w-9 h-9 m-2 rounded-full object-cover"/>
                                        )}
                                        <span className="text-black dark:text-amber-400">
                                            {user.displayName || user.email?.split('@')[0]}
                                        </span>
                                    </>
                                ) : (
                                    <Button variant="ghost" className="cursor-pointer">
                                        <img src={userIcon} alt="User menu" className="w-9"/>
                                    </Button>
                                )}
                            </div>
                            
                            {/* {user ? (
                                <span className="rounded-full w-full h-full cursor-pointer text-black dark:text-amber-400 ">
                                    {user.displayName || user.email?.split('@')[0]}
                                </span>  
                            ) : (
                                <Button variant="ghost" className="w-full h-full cursor-pointer">
                                    <img src={userIcon} alt="User menu" className="w-9"/>
                                </Button>
                            )
                        }     */}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl bg-gray-100 text-amber-700 border-none">
                            {menuItems.map((item, index) => (
                                <DropdownMenuItem
                                key={index}
                                className="font-bold rounded-xl cursor-pointer text-lg justify-center  py-2 hover:bg-amber-100"
                                onClick={item.onClick}
                                >
                                <span>{item.label}</span>
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

export default Header;