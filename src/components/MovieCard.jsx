import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import NoImage from '../assets/non_dispo.jpg'
import { Star, Calendar, ThumbsUp } from 'lucide-react';
import { fetchGenres } from '../services/tmdb'
import MovieActions from './profile/MovieActions';
import { useAuth } from '../hooks/useAuth';

const MovieCard = ({ data }) => {

  const { user } = useAuth()
  let  userId
  
  if (user){
    userId = user.uid
  }
  
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresList = await fetchGenres();
        setGenres(genresList || []);
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
        setGenres([]);
      }
    };
    loadGenres();
  }, []);
  const normalizeData = (data) => {
    const normalizedData = { ...data };
    if (Array.isArray(data.genres)) {
      normalizedData.genres = data.genres;
    }
    // Sinon, vérifier si le champ "genre_ids" existe et le renommer en "genres"
    if (Array.isArray(data.genre_ids)) {
      normalizedData.genres = data.genre_ids.map(id => ({ id }));
    }

    return normalizedData;
  };
  data = normalizeData(data);
  const movieGenres = genres.filter(genre => data.genres.map(g => g.id).includes(genre.id));

  const navigate = useNavigate()
  
  const handleDetailsClick = () => {
    navigate(`/movie/${data.id}`)
  };

  return (
          <div onClick={handleDetailsClick} className="relative group overflow-hidden min-w-[230px] rounded-lg shadow-lg transition-all duration-300 hover:scale-105 mb-8 mt-8 cursor-pointer">
            <img
              src={ data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : NoImage }
              alt={data.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">

            { user && (
              <MovieActions
                userId={userId}
                movieId={data.id}
              />
            )}
              <div className="absolute top-2 left-2 bg-black bg-opacity-25 text-white px-2 py-1 rounded-lg flex items-center">
                  <Star className="w-4 h-4 text-amber-500 mr-1" />
                  {data.vote_average.toFixed(1)}
              </div>
              <div className="absolute bottom-0 p-4 w-full text-center text-white">
                <h3 className="text-xl font-bold mb-2  text-center" >{data.title}</h3>
                <div className="m-2 flex flex-wrap items-center justify-center gap-2">
                  {movieGenres
                    .map(genre => (
                      <span 
                        key={genre.id}
                        className="text-xs bg-black bg-opacity-50 text-amber-500 rounded-full px-2"
                      >
                        {genre.name}
                      </span>
                    ))
                  }
                  </div>
                <div className='flex flex-wrap justify-between'>
                <div className="flex items-center justify-center text-sm text-white mb-2">
                  <Calendar className="w-4 h-4 mr-1 text-amber-500" />
                  {data.release_date ? new Date(data.release_date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                </div>
                <div className="flex items-center justify-center text-sm text-white mb-2">
                  <ThumbsUp className="w-4 h-4 mr-1 text-amber-500" />
                  {data.vote_count} votes
                </div>
                </div>
              </div>
            </div>
          </div>
  );
};

MovieCard.propTypes = {
  data: PropTypes.shape({
    poster_path: PropTypes.string,
    vote_count: PropTypes.number,
    genres:PropTypes.array,
    genre_ids: PropTypes.array,
    title: PropTypes.string,
    release_date: PropTypes.string,
    overview: PropTypes.string,
    vote_average: PropTypes.number,
    id: PropTypes.number,
  }).isRequired
};

export default MovieCard;

