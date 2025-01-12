import { useState, useEffect } from 'react';
import { findNearbyCinemas } from '../services/cinemaService';
import { MapPin, SlidersHorizontal } from 'lucide-react';

export function NearbyCinemas() {
  const [cinemas, setCinemas] = useState([]);
  const [maxDistance, setMaxDistance] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserLocationAndCinemas = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            const nearbyCinemas = findNearbyCinemas(userLocation, maxDistance);
            setCinemas(nearbyCinemas);
            setLoading(false);
          },
          (error) => {
            setError("Impossible d'obtenir votre position");
            setLoading(false);
          }
        );
      } else {
        setError("La géolocalisation n'est pas supportée par votre navigateur");
        setLoading(false);
      }
    };

    getUserLocationAndCinemas();
  }, [maxDistance]);

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    }
    return `${distance.toFixed(2)} km`;
  };

  const getGoogleMapsUrl = (cinema) => {
    // Option 1: Utiliser l'adresse
    const addressQuery = encodeURIComponent(cinema.adresse);
    return `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
};
  if (loading) return <div className="text-center py-4">Recherche des cinémas proches...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="w-6 h-6" />Cinémas à proximité</h3>
        <div className="flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-amber-600 text-lg" />
              <span className="text-lg  mr-2">Distance</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="10"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 accent-amber-400 rounded-lg appearance-none cursor-pointer mb-5"
          />
          <span className="min-w-[60px] text-xl mb-5">{maxDistance} km</span>
        </div>
      {cinemas.length > 0 ? (
        <div className="space-y-4">
          {cinemas.map(cinema => (
            <div key={cinema.id} className="bg-white p-4 rounded-lg shadow">
              <div className='flex justify-between'>
                <h4 className="font-bold text-amber-600 mb-2">{cinema.nom}</h4>
                <span className="text-amber-600">{formatDistance(cinema.distance)}</span>
              </div>
              <div className='flex justify-between'>
                <p className="text-gray-600 mb-2">{cinema.adresse}</p>
                <div className="flex gap-2 mt-2">
                    <a
                      href={getGoogleMapsUrl(cinema)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      Voir sur Google Maps
                    </a>
                  </div>
              </div>
              <p className="text-amber-600 uppercase">{cinema.commune}</p>
              
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucun cinéma trouvé à proximité</p>
      )}
    </div>
  );
}