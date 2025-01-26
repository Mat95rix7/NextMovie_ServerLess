import { useState, useEffect, useMemo } from 'react';
import { Heart, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard from '../MovieCard';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PropTypes from 'prop-types';
import axios from 'axios';
import HorizontalScollCard from '../HorizontalScollCard';

function UserStats({ stats }) {

  const [selectedTab, setSelectedTab] = useState('all');
  const [ movies, setMovies ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const movieIds = useMemo(() => {
    const ids = [
      ...(stats.favorites || []),
      ...(stats.watchlist || []),
      ...(stats.reviews?.map(r => r.movieId) || [])
      // ...(Array.isArray(stats.reviews) ? stats.reviews.map(r => r.movieId) : [])
    ];
    return [...new Set(ids)];
  }, [stats]);

  const table = [['favorites','Heart'], ['watchlist','Clock'], ['reviews','Star']]

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const movieData = await Promise.all(
          movieIds.map(async (id) => {
            const response = await axios.get(`/movie/${id}`);
            return response.data;
          })
        );
        setMovies(movieData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [movieIds]);



  const getFilteredMovies = (tab) => {
    switch (tab) {
      case 'favorites':
        return movies.filter(movie => stats.favorites?.includes(movie.id));
      case 'watchlist':
        return movies.filter(movie => stats.watchlist?.includes(movie.id));
      case 'reviews':
        return movies.filter(movie => stats.reviews?.some(r => r.movieId === movie.id));
      default:
        return movies;
    }
  };

  return (
    <div className="w-full space-y-6 mt-8">
      <div className="grid grid-cols-3 gap-4">

        {table.map(([tab, icon]) => (
          <Button
            key={tab}
            variant="outline"
            className={`flex flex-col items-center mx-auto w-1/2 p-6 space-y-2 ${selectedTab === tab ? 'bg-amber-100' : ''}`}
            onClick={() => setSelectedTab(tab)}
          >
            {icon === 'Heart' && <Heart className="h-6 w-6 text-amber-600" />}
            {icon === 'Clock' && <Clock className="h-6 w-6 text-amber-600" />}
            {icon === 'Star' && <Star className="h-6 w-6 text-amber-600" />}
            <span className="text-2xl font-bold pb-8">{stats[tab]?.length || 0}</span>
          
          </Button>
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">

        <TabsContent value="favorites" className="mt-6 text-black">
        <div>
          {getFilteredMovies("favorites").length > 4 ? (
            <HorizontalScollCard data={getFilteredMovies("favorites")} heading={"Mes Favoris"} />
          ) : (
            <div className="px-3 my-10 container mx-auto">
              <h2 className='text-xl lg:text-2xl font-bold mb-3 capitalize'>Mes Favoris</h2>
              <div className='flex flex-wrap gap-6 justify-evenly'>
                {getFilteredMovies("favorites").map((movie, index) => (
                        <MovieCard key={movie.id+"heading"+index} data={movie} index={index+1} />
                ))}
              </div>
            </div>
          )}
        </div>
        </TabsContent>

        <TabsContent value="watchlist" className="mt-6 text-black">
        <div>
          {getFilteredMovies("watchlist").length > 4 ? (
            <HorizontalScollCard data={getFilteredMovies("watchlist")} heading={"A voir"} />
          ) : (
            <div className="px-3 my-10 container mx-auto">
              <h2 className='text-xl lg:text-2xl font-bold mb-3 capitalize'>A Voir</h2>
              <div className='flex flex-wrap gap-6 justify-evenly'>
                {getFilteredMovies("watchlist").map((movie, index) => (
                        <MovieCard key={movie.id+"heading"+index} data={movie} index={index+1} />
                ))}
              </div>
            </div>
          )}
        </div>
        </TabsContent>

        <TabsContent value="reviews" className="text-black mt-6 px-3 my-10 container mx-auto">
          <h2 className='text-xl lg:text-2xl font-bold mb-3  capitalize'>Mes Notes</h2>
          <div className="flex flex-wrap justify-evenly gap-6">
            {getFilteredMovies("reviews").map(movie => {
              const review = stats.reviews?.find(r => r.movieId === movie.id);
              return (
                <div key={movie.id} className="relative">
                  <MovieCard data={movie} />
                  {review && (
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white rounded-full px-2 py-1">
                      {review.rating} ★
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

UserStats.propTypes= {
  stats: PropTypes.object
};

export default UserStats;