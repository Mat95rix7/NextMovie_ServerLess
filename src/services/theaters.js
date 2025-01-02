// Simule une API de cinémas
export const THEATERS_API = {
  async findNearbyTheaters(lat, lon, movieId) {
    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Données simulées de cinémas
    return [
      {
        id: 1,
        name: "Cinéma Pathé",
        address: "123 rue du Cinema",
        distance: "1.2km",
        showtimes: [
          { id: 1, time: "14:30", date: "2024-03-20", seats: 45 },
          { id: 2, time: "17:00", date: "2024-03-20", seats: 30 },
          { id: 3, time: "20:30", date: "2024-03-20", seats: 60 }
        ]
      },
      {
        id: 2,
        name: "UGC Ciné Cité",
        address: "456 avenue des Films",
        distance: "2.5km",
        showtimes: [
          { id: 4, time: "15:00", date: "2024-03-20", seats: 40 },
          { id: 5, time: "18:30", date: "2024-03-20", seats: 55 },
          { id: 6, time: "21:00", date: "2024-03-20", seats: 35 }
        ]
      }
    ];
  }
};