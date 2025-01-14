import { useState, useEffect, useMemo } from 'react';
import { Heart, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard from '../MovieCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import proptypes from 'prop-types';
import axios from 'axios';
import HorizontalScollCard from '../HorizontalScollCard';
// import {  FetchDetails, Fetching } from '../../services/tmdb';

function UserStats({ stats }) {
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [ movies, setMovies ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const favoritesCount = stats.favorites?.length || 0;
  const watchlistCount = stats.watchlist?.length || 0;
  const reviewsCount = stats.reviews?.length || 0;

  const movieIds = useMemo(() => {
    const ids = [
      ...(stats.favorites || []),
      ...(stats.watchlist || []),
      ...(stats.reviews?.map(r => r.movieId) || [])
    ];
    return [...new Set(ids)];
  }, [stats]);

 // Remplacer par vos propres ID

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
    <div className="w-full space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Button
          variant="outline"
          className={`flex flex-col items-center p-6 space-y-2 ${selectedTab === 'favorites' ? 'bg-amber-100' : ''}`}
          onClick={() => setSelectedTab('favorites')}
        >
          <Heart className="h-6 w-6" />
          <span className="text-2xl font-bold">{favoritesCount}</span>
          <span className="text-sm">Films favoris</span>
        </Button>

        <Button
          variant="outline"
          className={`flex flex-col items-center p-6 space-y-2 ${selectedTab === 'watchlist' ? 'bg-amber-100' : ''}`}
          onClick={() => setSelectedTab('watchlist')}
        >
          <Clock className="h-6 w-6" />
          <span className="text-2xl font-bold">{watchlistCount}</span>
          <span className="text-sm">À voir</span>
        </Button>

        <Button
          variant="outline"
          className={`flex flex-col items-center p-6 space-y-2 ${selectedTab === 'reviews' ? 'bg-amber-100' : ''}`}
          onClick={() => setSelectedTab('reviews')}
        >
          <Star className="h-6 w-6" />
          <span className="text-2xl font-bold">{reviewsCount}</span>
          <span className="text-sm">Films notés</span>
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="watchlist">À voir</TabsTrigger>
          <TabsTrigger value="reviews">Notés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="">
            <HorizontalScollCard data={getFilteredMovies("all")} heading={"Mes All Films"} />
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="">
            <HorizontalScollCard data={getFilteredMovies("favorites")} heading={"Mes Films Favoris"} />
          </div>
        </TabsContent>

        <TabsContent value="watchlist" className="mt-6">
          <div className="">
            <HorizontalScollCard data={getFilteredMovies("watchlist")} heading={"Ma liste de films a voir"} />
          </div>
        </TabsContent>

        {/* <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            { getFilteredMovies("all").map(movie => (
              <MovieCard key={movie.id} data={movie} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            { getFilteredMovies("favorites").map(movie => (
              <MovieCard key={movie.id} data={movie} />
            ))}
          </div>
        </TabsContent> */}

        <TabsContent value="reviews" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 m-5">
            {getFilteredMovies("reviews").map(movie => {
              const review = stats.reviews?.find(r => r.movieId === movie.id);
              return (
                <div key={movie.id} className="relative">
                  <MovieCard data={movie} />
                  {review && (
                    <div className="absolute top-2 left-0 bg-amber-500 text-white rounded-full px-2 py-1">
                      {review.rating}★
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

UserStats.propTypes = {
  stats: proptypes.object.isRequired
};

export default UserStats;