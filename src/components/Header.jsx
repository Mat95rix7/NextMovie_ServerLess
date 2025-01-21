ctimport { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { getUserProfile }  from '../hooks/userProfile';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/Logo.jpg';
import userIcon from '../assets/user.png';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger, 
  } from '@/components/ui/dropdown-menu';

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    console.log(user);

   


    const menuItems = user
    ? [
        { label: "Mon Espace", onClick: () => (userRole === "admin") ? navigate('/admin') : navigate('/profile') },
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

      useEffect(() => {
        const loadProfile = async () => {
          if (user) {
            const userProfile = await getUserProfile(user.uid);
            setProfile(userProfile);
            setDisplayName(userProfile?.displayName || '');
            setUserRole(userProfile?.role || 'user');
          }
        };
        loadProfile();
      }, [user]);

    return (
         <header className='fixed top-0 w-full h-16 bg-gray-300 bg-opacity-50 dark:bg-black dark:bg-opacity-50  z-40'>
            <div className='container mx-auto px-3 flex items-center h-full'>
                <Link to={"/"}>
                    <img src={logo} alt='logo' className='w-9 min-w-8  rounded-lg'/>
                </Link>
                <div className='ml-auto flex items-center gap-10'>
                    <IoSearchOutline className="w-full text-2xl cursor-pointer" onClick={() => navigate("/search")}/>
                    <ThemeToggle />
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} >
                        <DropdownMenuTrigger asChild>
                            {user ? (
                                <span className="rounded-full w-full h-full cursor-pointer text-amber-400">
                                    {displayName || user.email?.split('@')[0]}
                                </span>  
                            ) : (
                                <Button variant="ghost" className="w-full h-full cursor-pointer">
                                    <img src={userIcon} alt="User menu" className="w-10/12"/>
                                </Button>
                            )
                        }   
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl bg-gray-100 text-amber-700 border-none">
                            {menuItems.map((item, index) => (
                                <DropdownMenuItem
                                key={index}
                                className="font-bold rounded-xl cursor-pointer text-lg justify-center py-2"
                                onClick={item.onClick}
                                >
                                <span>{item.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>  
                </div>
              </div>
        </header>
    );
};

export default Header;
