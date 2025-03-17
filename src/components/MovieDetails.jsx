import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Star, Clock, Calendar, Heart, Bookmark, Share2 } from 'lucide-react';
import Divider from './Divider'
import VideoPlay from './VideoPlay'
import { NearbyCinemas } from './NearbyCinemas';
import { FetchDetails } from '../services/tmdb';
import { useAuth } from '../hooks/useAuth';
import { useMovieInteractions } from '../hooks/useMovieInteractions';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

const MovieDetails = () => {
  const imageURL = import.meta.env.VITE_POSTER;
  const [playVideo, setPlayVideo] = useState(false);
  const [playVideoId, setPlayVideoId] = useState("");
  
  const [displayMode, setDisplayMode] = useState('initial')
  
  const { id } = useParams();
  const idInt = parseInt(id, 10);
  
  const { user } = useAuth()

  let  userId
  if (user){
    userId = user.uid
  }

  const { data: data, Loading, error } = FetchDetails(`/api/movies/${id}`);

  const {
    isFavorite,
    isWatchLater,
    rating,
    toggleFavorite,
    toggleWatchLater,
    updateRating
  } = useMovieInteractions(userId, idInt);


  if (Loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-gray-500">Chargement des détails du film...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-amber-500">
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
  const handlePlayVideo = (data) => {
    setPlayVideoId(data);
    setPlayVideo(true);
  };

  const MnToHours = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes.toString().padStart(2, '0')}`;
  };

  const getDisplayedActors = () => {
    switch (displayMode) {
      case 'initial':
        return data.credits.cast.slice(0, 6);
      case 'expanded':
        return data.credits.cast;
      default:
        return data.credits.cast.slice(0, 6);
    }
  };

  const displayedActors = getDisplayedActors();
  const hasMoreActors = data.credits.cast.length > 6;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: data.title,
        text: data.overview,
        url: window.location.href
      });
    } catch (err) {
      console.log('Erreur de partage:', err);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => updateRating(star)}
            className={`p-1 rounded-full hover:bg-amber-100/10 transition-colors`}
          >
            <Star
              className={cn(
                "w-6 h-6",
                rating >= star ? "fill-amber-500 text-amber-500" : "text-gray-400"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Helmet>
          <title>{data.title} - NextMovie</title>
          <meta name="description" content={data.overview} />
          <meta name="keywords" content={`film, ${data.title}`} />
          <meta property="og:title" content={data.title} />
          <meta property="og:description" content={data.overview} />
          <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${data.poster_path}`} />
          <meta property="og:url" content={`https://nextmoviez.vercel.app/movie/${data.id}`} />
      </Helmet>
      <div>
        <div className='w-full h-[280px] relative hidden lg:block'>
          <div className='w-full h-full'>
            <img
              src={imageURL + data?.backdrop_path}
              className='h-full w-full object-cover'
              alt={data.title}
            />
          </div>
          <div className='absolute w-full h-full top-0 bg-gradient-to-t from-neutral-900/90 to-transparent'></div>
        </div>

        <div className='container mx-auto mt-10 px-3 py-16 lg:py-0 flex flex-col lg:flex-row gap-5 lg:gap-10'>
          <div className="w-full md:w-3/4 md:mx-auto lg:w-1/4 flex-shrink-0">
            {data.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                alt={data.title}
                className="w-full rounded-lg shadow-xl"
              />
            )}

            <button
              onClick={() => handlePlayVideo(data)}
              className='mt-3 w-full py-2 px-4 text-center bg-white text-black rounded font-bold text-lg hover:bg-gradient-to-l from-red-500 to-orange-500 hover:scale-105 transition-all'
            >
              Play Now
            </button>

            {user && (
              <div className="mt-4 space-y-3">
                <button
                  onClick={toggleFavorite}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  <Heart className={cn("w-5 h-5", isFavorite && "fill-current text-amber-500")} />
                  <span className='text-white'>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
                </button>

                <button
                  onClick={toggleWatchLater}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  <Bookmark className={cn("w-5 h-5", isWatchLater && "fill-current text-amber-500")} />
                  <span className='text-white'>{isWatchLater ? 'Retirer de la liste' : 'À voir plus tard'}</span>
                </button>

                <div className="p-4 bg-neutral-800 rounded-lg">
                  <h3 className="text-white text-center font-medium mb-2">Votre note</h3>
                  {renderStarRating()}
                  <div className="text-center my-2 font-bold text-amber-500 cursor-pointer"
                    onClick={() => updateRating(0)}>
                      Retirer la note
                </div>
                </div>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className='text-white'>Partager</span>
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className='text-2xl lg:text-4xl font-bold'>{data?.title || data?.name}</h2>
            <p className='text-neutral-400'>{data?.tagline}</p>

            <Divider />

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-5">
              {data.genres?.length > 0 ? (
                data.genres.map(genre => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-amber-600 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">Aucun genre disponible</p>
              )}
            </div>

            <Divider />

            <div className="flex flex-wrap gap-6">
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
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <span>{new Date(data.release_date).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            <Divider />

            <div className='mb-5'>
              <h3 className='text-xl font-bold mb-1'>Synopsis</h3>
              <p>{data?.overview}</p>
            </div>

            <Divider />

            <div>
              <h2 className="text-xl font-semibold mb-4">Casting principal</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {displayedActors.map(actor => (
                  <div key={actor.id} className="text-center">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="w-1/2 rounded-xl mx-auto mb-2"
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
              <div className="flex justify-center mt-4 space-x-2">
              {displayMode === 'initial' && hasMoreActors && (
                <button 
                  onClick={() => setDisplayMode('expanded')}
                  className="px-4 py-2 bg-gray-700 text-amber-500 rounded-lg hover:bg-gray-500 transition"
                >
                  Voir Plus
                </button>
              )}
              
              {displayMode === 'expanded' && (
                <button 
                  onClick={() => setDisplayMode('initial')}
                  className="px-4 py-2 bg-gray-700 text-amber-500 rounded-lg hover:bg-gray-500 transition"
                >
                  Voir Moins
                </button>
              )}
            </div>

            </div>

            <div className="mt-12 mb-12">
              <NearbyCinemas />
            </div>
          </div>
        </div>

        {playVideo && (
          <VideoPlay data={playVideoId} close={() => setPlayVideo(false)} />
        )}
      </div>
    </div>
  );
};

export default MovieDetails;