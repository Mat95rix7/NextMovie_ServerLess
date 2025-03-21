import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from './components/Footer';
import Header from './components/Header';
import { setBannerData,setImageURL } from './store/movieSlice';
import  { AuthProvider } from './context/AuthProvider';
import HelmetSeo from './components/HelmetSeo';

function App() {
  
  const dispatch = useDispatch()
  const fetchNowPlaying = async () => {
    try {
      const response = await axios.get('/api/movies/now-playing');
      const moviesWithImages = response.data.results.filter(
        movie => movie.backdrop_path !== null && movie.poster_path !== null
      );
      dispatch(setBannerData(moviesWithImages));
    } catch (error) {
      console.error("error", error);
    }
  };


  const fetchConfiguration = async()=>{
    try {
        const response = await axios.get("/api/configuration")
        dispatch(setImageURL(response.data.images.secure_base_url+"original"))
    } catch (error) {
        console.error(error);
    }
  }

  function ScrollToTop() {
    const { pathname } = useLocation();
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    
    return null;
  }

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(()=>{
    fetchNowPlaying()
    fetchConfiguration()
  },[])
  
  return (
    <AuthProvider>
          <HelmetSeo/>
          <ScrollToTop/>
          <Header/>
          <div className='min-h-[65vh] md:min-h-[75vh] mt-[60px]'>
              <Outlet />  
          </div>
          <Footer/>
    </AuthProvider>
  );
}

export default App;
