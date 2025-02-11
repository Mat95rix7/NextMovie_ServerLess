import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Footer from './components/Footer';
import Header from './components/Header';
import { setBannerData,setImageURL } from './store/movieSlice';
import  { AuthProvider } from './context/userContext';

function App() {
  
  const dispatch = useDispatch()
  const fetchNowPlaying = async()=>{
    try {
        const response = await axios.get('/movie/now_playing?include_adult=false&language=fr-FR')
        dispatch(setBannerData(response.data.results))
    } catch (error) {
        console.log("error",error)
    }
  }

  const fetchConfiguration = async()=>{
    try {
        const response = await axios.get("/configuration")
        dispatch(setImageURL(response.data.images.secure_base_url+"original"))
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(()=>{
    fetchNowPlaying()
    fetchConfiguration()
  })
  
  return (
    <AuthProvider>
          <Header/>
          <div className='min-h-[78vh] mt-14'>
              <Outlet/>
          </div>
          <Footer/>
    </AuthProvider>
  );
}

export default App;
