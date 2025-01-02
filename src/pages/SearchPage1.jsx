import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { SlidersHorizontal } from 'lucide-react'
import GenreCheckbox from '../components/GenreCheckbox'
import { getGenreID } from '../lib/getGenreID'

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data,setData] = useState([])
  const [dataSearch,setDataSearch] = useState([])
  const [page,setPage] = useState(1)
  const [isOverlayOpen,setIsOverlayOpen] = useState([false])
  const [selectedGenres, setSelectedGenres] = useState([]);
    
  const query = location?.search?.slice(1)

  const fetchData = async()=>{
    try {
        const response = await axios.get(`search/movie?q=`,{
          params : {
            query :location?.search?.slice(1),
            page : page,
          }
        })
        setData((preve)=>{
          return[
              ...preve,
              ...response.data.results
          ]
        })
    } catch (error) {
        console.log('error',error)
    }
    setDataSearch(data)
  }

  useEffect(()=>{
    if(query){
      setPage(1)
      setData([])
      fetchData()
    }
  },[location?.search])


  const handleScroll = ()=>{
    if((window.innerHeight + window.scrollY ) >= document.body.offsetHeight){
      setPage(preve => preve + 1)
    }
  }

  useEffect(()=>{
    if(query){
      fetchData()
    }
  },[page])

  useEffect(()=>{
    window.addEventListener('scroll',handleScroll)
},[])

useEffect(() => {
  const handleBackButton = (e) => {
      e.preventDefault();
      navigate('/search');
  };

  window.addEventListener('popstate', handleBackButton);

  return () => {
      window.removeEventListener('popstate', handleBackButton);
  };
}, [navigate]);
  
const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const handleGenreChange = (genre, checked) => { 
    let value = getGenreID(genre)
    console.log(checked);
    if (checked) { 
        setSelectedGenres((prevSelectedGenres) => [...prevSelectedGenres, value.id]); 
    } else { 
        setSelectedGenres((prevSelectedGenres) => prevSelectedGenres.filter((option) => option !== value.id) ); 
    }
    const filteredMovies = selectedGenres ? data.filter((movie) => movie.genre_ids.includes(parseInt(selectedGenres))) : data;
    if(filteredMovies){
      setDataSearch(filteredMovies)
    } else {
      setDataSearch(data)
    }

};
  const filterData = () => {
    setIsOverlayOpen(false);
  }



  return (
    <div className='py-16'>
        <div className='container mx-auto'>
          <div className='flex justify-between mt-14'>
            <h3 className='capitalize text-lg lg:text-xl font-semibold  mb-3 text-center'>Resultat de Recherche : ({dataSearch.length})</h3>
            <div  onClick={toggleOverlay}>
                      <button className='text-2xl text-white'>
                                  <SlidersHorizontal/>
                      </button>
            </div>
          </div>  
          <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-24 justify-center  mx-auto m-10'>
              {
                dataSearch.map((searchData, index)=>{
                  return(
                    <MovieCard key={searchData.id+index} data={searchData}  />
                  )
                })
              }
          </div>
          {/* Overlay de Filtrage */}
          {isOverlayOpen && (
              <div className="fixed top-40 right-5 w-[250px] h-full bg-gray-50 shadow-lg overflow-y-auto z-[1000] animate-[slideIn_0.3s_ease]">
                  <div className="p-5">
                      <button className="bg-transparent border-none text-2xl text-gray-700 cursor-pointer float-right" onClick={toggleOverlay}>
                      &times;
                      </button>
                      <h2 className='text-blue-500 mb-5'>Filtrer</h2>
                      <div className="p-5">
                      <h3 className='text-blue-500 mb-5'>Genre</h3>
!
                      <GenreCheckbox genre="Action" onGenreChange={handleGenreChange} />
                      <GenreCheckbox genre="Drame" onGenreChange={handleGenreChange} />
                      <GenreCheckbox genre="Comédie" onGenreChange={handleGenreChange} />




                      {/* <label className='block mb-3'>
                          <input className='me-2' type="checkbox"
                          value="Action"
                          checked={ selectedGenres.includes("Action")}
                          onChange={ handleGenreChange }
                          /> Action
                      </label>
                      <label className='block mb-3'>
                          <input className='me-2' type="checkbox"
                          value="Drame"
                          onChange={handleGenreChange}
                            /> Drame
                      </label>
                      <label className='block mb-3'>
                          <input className='me-2' type="checkbox"
                          value="Comédie"
                          onChange={handleGenreChange}
                          /> Comédie
                      </label> */}
                      </div>
                      <div className="p-5">
                      <h3 className='text-blue-500 mb-5'>Durée</h3>
                      <label className='block mb-3'>
                          <input className='me-2' type="radio" name="duration" /> Court
                      </label>
                      <label className='block mb-3'>
                          <input className='me-2' type="radio" name="duration" /> Moyen
                      </label>
                      <label className='block mb-3'>
                          <input className='me-2' type="radio" name="duration" /> Long
                      </label>
                      </div>
                      <button className="bg-blue-500 text-white border-none p-4 rounded-md cursor-pointer w-full mt-5" onClick={filterData}>
                      Appliquer
                      </button>
                  </div>
              </div>
          )}
        </div>
    </div>
  )
}

export default SearchPage
