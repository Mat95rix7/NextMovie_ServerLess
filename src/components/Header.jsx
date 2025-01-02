import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IoSearchOutline } from "react-icons/io5";
import logo from '../assets/Logo.jpg'
import userIcon from '../assets/user.png'


const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()
        
    const removeSpace = location?.search?.split("%20")?.join(" ").slice(1)
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchInput,setSearchInput] = useState(removeSpace);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        window.onclick = (event) => {
          if (!event.target.matches('.dropdown')) {
            setIsDropdownOpen(false);
          }
        };
      }, []);

    useEffect(()=>{
    if(searchInput){
        navigate(`/search?${searchInput}`)
    }
    },[searchInput, navigate])

      const handleInputChange = (e) => {
        setSearchInput(e.target.value);
      };
    
      const handleSearchSubmit = (e) => {
        e.preventDefault()
        setSearchInput("");
      };

    const toggleDropdown = () => { 
        setIsDropdownOpen(!isDropdownOpen);
  
      }
    
      const toggleSearch = () => { 
        setIsSearchOpen(!isSearchOpen);
      }

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
                            className='bg-transparent px-4 py-1 outline-none border-none hidden md:block'
                            onChange={handleInputChange}
                            value={searchInput}
                        />
                        <button className='text-2xl text-white' onClick={toggleSearch}>
                                <IoSearchOutline/>
                        </button>
                    </form>
                    <div className="relative inline-block w-8 h-8">
                    <button 
                        onClick={toggleDropdown}
                        className="dropdown rounded-full w-full h-full cursor-pointer">
                        <img 
                            src={userIcon}
                            alt="User menu"
                            className="dropdown w-full h-full"/>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 rounded-lg bg-gray-50 min-w-[160px] shadow-lg z-[31]">
                            <Link 
                                to="/Login"
                                className="block px-4 py-2 text-black text-center hover:bg-gray-300 rounded-full"
                            >
                                Connexion
                            </Link>
                            <Link 
                                to="/Register"
                                className="block px-4 py-2 text-black text-center hover:bg-gray-300 rounded-full"
                            >
                                Inscription
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
        { isSearchOpen && (
                    <div className='md:hidden my-2 mx-4 sticky top-[70px] z-30'>
                    <input 
                    type='text'
                    placeholder='Tapez votre recherche...'
                    onChange={handleInputChange}
                    value={searchInput}
                    className='px-4 py-1 text-lg w-full bg-white rounded-full text-neutral-900 '
                    />
                </div>
            )
        }
    </header>
  )
}

export default Header
