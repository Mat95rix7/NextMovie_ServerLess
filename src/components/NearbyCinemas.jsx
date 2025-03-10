// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { findNearbyCinemas } from '../services/cinemaService';
// import { MapPin } from 'lucide-react';
// import { debounce } from 'lodash';

// export function NearbyCinemas() {
//   const [cinemas, setCinemas] = useState([]);
//   const [allCinemas, setAllCinemas] = useState([]);
//   const [userLocation, setUserLocation] = useState(null);
//   const [maxDistance, setMaxDistance] = useState(5);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Récupérer la position de l'utilisateur une seule fois
//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           setUserLocation(location);
          
//           // Récupérer tous les cinémas une seule fois
//           const cinemas = findNearbyCinemas(location, 10); // Rayon maximal
//           setAllCinemas(cinemas);
//           setLoading(false);
//         },
//         (error) => {
//           console.log(error);
//           setError("Impossible d'obtenir votre position");
//           setLoading(false);
//         }
//       );
//     } else {
//       setError("La géolocalisation n'est pas supportée par votre navigateur");
//       setLoading(false);
//     }
//   }, []);

//   // Filtrer les cinémas par distance en mémoire (sans refaire l'appel API)
//   useEffect(() => {
//     if (allCinemas.length > 0 && userLocation) {
//       const filtered = allCinemas.filter(cinema => cinema.distance <= maxDistance);
//       setCinemas(filtered);
//     }
//   }, [allCinemas, maxDistance, userLocation]);

//   // Fonction pour mettre à jour la distance en temps réel
//   const handleDistanceChange = useCallback((newDistance) => {
//     setMaxDistance(Number(newDistance));
//   }, []);

//   // Fonction debounce pour l'input range
//   const debouncedDistanceChange = useMemo(
//     () => debounce(handleDistanceChange, 50),
//     [handleDistanceChange]
//   );

//   const formatDistance = (distance) => {
//     if (distance < 1) {
//       return `${(distance * 1000).toFixed(0)} m`;
//     }
//     return `${distance.toFixed(2)} km`;
//   };

//   const getGoogleMapsUrl = (cinema) => {
//     const addressQuery = encodeURIComponent(cinema.adresse);
//     return `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
//   };

//   if (loading) return <div className="text-center py-4">Recherche des cinémas proches...</div>;
//   if (error) return <div className="text-amber-500 py-4">{error}</div>;

//   return (
//     <div className="mt-6">
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
//           <MapPin className="w-6 h-6 text-amber-600" />Cinémas à proximité
//         </h3>
//       </div>
//       <div className="flex items-center text-lg gap-6 mb-4">
//         <span className="ms-3">Distance</span>
//         <input
//           type="range"
//           min="1"
//           max="10"
//           value={maxDistance}
//           onChange={(e) => {
//             // Mettre à jour l'UI immédiatement
//             setMaxDistance(Number(e.target.value));
//             // Appliquer le debounce pour le filtrage
//             debouncedDistanceChange(e.target.value);
//           }}
//           className="w-full h-2  accent-amber-600 rounded-lg cursor-pointer"
//         />
//         <span className="min-w-[60px] me-3">{maxDistance} km</span>
//       </div>
//       {cinemas.length > 0 && (
//         <div className="text-md text-center text-amber-600 mb-4">
//           {cinemas.length} cinémas trouvés dans un rayon de {maxDistance} km
//         </div>
//       )}
      
//       {cinemas.length > 0 ? (
//         <div className="space-y-4">
//           {cinemas.map(cinema => (
//             <div key={cinema.id} className="bg-white p-4 rounded-lg shadow">
//               <div className="flex justify-between">
//                 <h4 className="font-bold text-amber-600 mb-2">{cinema.nom}</h4>
//                 <span className="text-amber-600">{formatDistance(cinema.distance)}</span>
//               </div>
//               <div className="flex justify-between mb-2 mt-2">
//                 <p className="text-gray-600">{cinema.adresse}</p>
//                 <div className="flex gap-2">
//                   <a
//                     href={getGoogleMapsUrl(cinema)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-gray-600 hover:text-blue-800 text-sm flex items-center"
//                   >
//                     <MapPin className="w-4 h-4 me-2" />
//                     Itinéraire
//                   </a>
//                 </div>
//               </div>
//               <p className="text-amber-600 uppercase">{cinema.commune}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-amber-600 text-center text-lg py-5">Aucun cinéma trouvé à proximité</p>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { findNearbyCinemas } from "../services/cinemaService";
import { MapPin } from "lucide-react";

export function NearbyCinemas() {
  const [cinemas, setCinemas] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [maxDistance, setMaxDistance] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer la position de l'utilisateur
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.log(error);
          setError("Impossible d'obtenir votre position");
          setLoading(false);
        }
      );
    } else {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      setLoading(false);
    }
  }, []);

  // Charger les cinémas dynamiquement en fonction de la distance
  useEffect(() => {
    if (userLocation) {
      setCinemas(findNearbyCinemas(userLocation, maxDistance));
    }
  }, [userLocation, maxDistance]); // Met à jour dès que maxDistance change

  const formatDistance = (distance) => {
    return distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(2)} km`;
  };

  const getGoogleMapsUrl = (cinema) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cinema.adresse)}`;
  };

  if (loading) return <div className="text-center py-4">Recherche des cinémas proches...</div>;
  if (error) return <div className="text-amber-500 py-4">{error}</div>;

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-amber-600" /> Cinémas à proximité
      </h3>

      <div className="flex items-center text-lg gap-6 mb-4">
        <span className="ms-3">Distance</span>
        <input
          type="range"
          min="1"
          max="10"
          value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          className="w-full h-2 accent-amber-600 rounded-lg cursor-pointer"
        />
        <span className="min-w-[60px] me-3">{maxDistance} km</span>
      </div>

      {cinemas.length > 0 && (
        <div className="text-md text-center text-amber-600 mb-4">
          {cinemas.length} cinémas trouvés dans un rayon de {maxDistance} km
        </div>
      )}

      {cinemas.length > 0 ? (
        <div className="space-y-4">
          {cinemas.map((cinema) => (
            <div key={cinema.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <h4 className="font-bold text-amber-600 mb-2">{cinema.nom}</h4>
                <span className="text-amber-600">{formatDistance(cinema.distance)}</span>
              </div>
              <div className="flex justify-between mb-2 mt-2">
                <p className="text-gray-600">{cinema.adresse}</p>
                <a
                  href={getGoogleMapsUrl(cinema)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <MapPin className="w-4 h-4 me-2" />
                  Itinéraire
                </a>
              </div>
              <p className="text-amber-600 uppercase">{cinema.commune}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-amber-600 text-center text-lg py-5">Aucun cinéma trouvé à proximité</p>
      )}
    </div>
  );
}

