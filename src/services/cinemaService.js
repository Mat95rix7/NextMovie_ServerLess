import cinemasData from '../data/cinemas.json';
export function findNearbyCinemas(userLocation, maxDistance = 5) {
  const cinemas = cinemasData;
 
  return userLocation ? cinemas
    .map(cinema => ({
      ...cinema,
      distance: calculateDistance(userLocation.lat, userLocation.lng, cinema.geo.lat, cinema.geo.lon)
    }))
    .filter(cinema => cinema.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    : [];
}

// Calcule la distance en km entre deux points géographiques
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
}