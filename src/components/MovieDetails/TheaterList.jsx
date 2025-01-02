import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { getCurrentPosition } from '../../services/geolocation';
import { THEATERS_API } from '../../services/theaters';
import { TheaterCard } from './TheaterCard';

export function TheaterList({ movieId }) {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTheaters = async () => {
      try {
        const position = await getCurrentPosition();
        console.log(position);
        const nearbyTheaters = await THEATERS_API.findNearbyTheaters(
          position.latitude,
          position.longitude,
          movieId
        );
        setTheaters(nearbyTheaters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadTheaters();
  }, [movieId]);

  if (loading) return <div>Recherche des cinémas...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MapPin className="w-6 h-6" />
        Cinémas à proximité
      </h2>
      <div className="space-y-6">
        {theaters.map(theater => (
          <TheaterCard key={theater.id} theater={theater} />
        ))}
      </div>
    </div>
  );
}