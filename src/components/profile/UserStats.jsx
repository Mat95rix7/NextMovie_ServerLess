import { useState, useEffect, useMemo } from 'react';
import { Heart, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PropTypes from 'prop-types';
import axios from 'axios';
import MovieCard from '../MovieCard';
import HorizontalScrollCard from '../HorizontalScollCard';

const StatButton = ({ icon, count, isSelected, onClick }) => {
  const IconComponent = {
    Heart,
    Clock,
    Star
  }[icon];

  return (
    <Button
      variant="outline"
      className={`flex flex-col items-center mx-auto w-1/2 p-6 space-y-2 hover:bg-amber-500 ${
        isSelected ? 'bg-amber-300 text-black' : ''
      }`}
      onClick={onClick}
    >
      <IconComponent className="w-6 h-6 text-amber-600" />
      <span className="text-2xl font-bold pb-8">{count}</span>
    </Button>
  );
};

const TABS_CONFIG = [
  { id: 'favorites', title: 'Mes Favoris', icon: 'Heart' },
  { id: 'watchlist', title: 'A voir', icon: 'Clock' },
  { id: 'reviews', title: 'Mes Notes', icon: 'Star' }
];

function UserStats({ stats }) {
  const [selectedTab, setSelectedTab] = useState('favorites');
  const [moviesCache, setMoviesCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const movieIds = useMemo(() => {
    const ids = [
      ...(stats.favorites || []),
      ...(stats.watchlist || []),
      ...(stats.reviews?.map(r => r.movieId) || [])
    ];
    return [...new Set(ids)];
  }, [stats]);

  // Fetch movies only once and cache them
  useEffect(() => {
    const fetchMovies = async () => {
      const missingIds = movieIds.filter(id => !moviesCache[id]);
      
      if (missingIds.length === 0) return;

      setLoading(true);
      setError(null);
      
      try {
        const movieData = await Promise.all(
          missingIds.map(async (id) => {
            const response = await axios.get(`/movie/${id}`);
            return response.data;
          })
        );

        setMoviesCache(prev => {
          const newCache = { ...prev };
          movieData.forEach(movie => {
            newCache[movie.id] = movie;
          });
          return newCache;
        });
      } catch (err) {
        console.log(err);
        setError('Erreur lors de la récupération des films');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [movieIds]);

  const getFilteredMovies = (tab) => {
    switch (tab) {
      case 'favorites':
        return stats.favorites?.map(id => moviesCache[id]).filter(Boolean) || [];
      case 'watchlist':
        return stats.watchlist?.map(id => moviesCache[id]).filter(Boolean) || [];
      case 'reviews':
        return stats.reviews?.map(r => moviesCache[r.movieId]).filter(Boolean) || [];
      default:
        return [];
    }
  };

  const renderMovieWithReview = (movie) => {
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
  };

  const renderSection = (tab, title) => {
    const filteredMovies = getFilteredMovies(tab);

    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (!filteredMovies.length) {
      return (
        <div className="px-3 my-10 container mx-auto">
          <h2 className="text-xl lg:text-2xl font-bold mb-3 capitalize">{title}</h2>
          <p className="text-center text-amber-600">Aucun film dans cette catégorie.</p>
        </div>
      );
    }

    return (
      <HorizontalScrollCard
        data={filteredMovies}
        heading={title}
        renderItem={tab === 'reviews' ? renderMovieWithReview : undefined}
      />
    );
  };

  if (loading && !Object.keys(moviesCache).length) {
    return <div className="text-center py-8">Chargement initial...</div>;
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
      {/* w-full space-y-6 mt-8 */}
      <div className="grid grid-cols-3 gap-4">
        {TABS_CONFIG.map(({ id, icon }) => (
          <StatButton
            key={id}
            icon={icon}
            count={stats[id]?.length || 0}
            isSelected={selectedTab === id}
            onClick={() => setSelectedTab(id)}
          />
        ))}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        {TABS_CONFIG.map(({ id, title }) => (
          <TabsContent key={id} value={id} className="mt-6 text-black">
            {renderSection(id, title)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

UserStats.propTypes = {
  stats: PropTypes.shape({
    favorites: PropTypes.arrayOf(PropTypes.number),
    watchlist: PropTypes.arrayOf(PropTypes.number),
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        movieId: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired
      })
    )
  }).isRequired
};

StatButton.propTypes = {
  icon: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default UserStats;