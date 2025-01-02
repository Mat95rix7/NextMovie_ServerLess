import useFetchDetails from '../hooks/useFetchDetails';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Star, Clock, Calendar } from 'lucide-react';
import Divider from './Divider'
import VideoPlay from './VideoPlay'
import { TheaterList } from './MovieDetails/TheaterList';


const MovieDetails = () => {
  
  const imageURL = import.meta.env.VITE_POSTER
  const [playVideo,setPlayVideo] = useState(false)
  const [playVideoId,setPlayVideoId] = useState("")
  const { id } = useParams();
  
  const { data: data, isLoading, error } = useFetchDetails(`/movie/${id}?language=fr-FR&append_to_response=credits`);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Une erreur est survenue lors du chargement du film
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-gray-500 text-center">
        Aucune information disponible pour ce film
      </div>
    );
  }

  const handlePlayVideo = (data)=>{
    setPlayVideoId(data)
    setPlayVideo(true)

  }

  const MnToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}`;
  };
  

  return (

  <div>
    <div>
      <div className='w-full h-[280px] relative hidden lg:block'>
        <div className='w-full h-full'>
          <img
              src={imageURL+data?.backdrop_path}
              className='h-full w-full object-cover'
          /> 
        </div> 
      <div className='absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900/90 to-transparent'></div>    
    </div>

    <div className='container mx-auto px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10 '>
      <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          {data.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
              alt={data.title}
              className="w-full rounded-lg shadow-xl"
            />
          )}
 
          <button onClick={()=>handlePlayVideo(data)} className='mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-l from-red-500 to-orange-500 hover:scale-105 transition-all'>Play Now</button>
        </div>
        <div>
          <h2 className='text-2xl lg:text-4xl font-bold text-white '>{data?.title || data?.name}</h2>
          <p className='text-neutral-400'>{data?.tagline}</p> 

          <Divider/>

          <div className="flex items-center gap-5">
            {data.genres.map(genre => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-amber-600 rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <Divider/>

          <div className="flex flex-wrap gap-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>{data.vote_average.toFixed(1)}/10</span>
            </div>
            {data.runtime && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>{MnToHours(data.runtime)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 ">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>{new Date(data.release_date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          <Divider/>
            
          <div className='mb-5'>
              <h3 className='text-xl font-bold text-white mb-1'>Synopsis</h3>
              <p>{data?.overview}</p>
          </div>
          
          <Divider/>

          <div>
            <h2 className="text-xl font-semibold mb-4">Casting principal</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {data.credits.cast.slice(0, 6).map(actor => (
                <div key={actor.id} className="text-center">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      className="w-1/2 rounded-3xl mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-1/2 mx-auto aspect-[2/3] bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                  <p className="font-medium">{actor.name}</p>
                  <p className="text-sm text-gray-400">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Add Showtimes Section */}
          <div className="mt-12">
            <TheaterList movieId={id} />
          </div>
        </div>
    </div>
    {
      playVideo && (
        <VideoPlay data={playVideoId} close={()=>setPlayVideo(false)}/>
      )
    }
  </div>
  
            {/* {user && (
              <button
                onClick={toggleFavorite}
                className="flex items-center gap-2 hover:text-red-500"
              >
                <Heart className={cn("w-5 h-5", isFavorite && "fill-current text-red-500")} />
                <span>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
              </button>
            )} */}  
  </div>
  )
}
export default MovieDetails;