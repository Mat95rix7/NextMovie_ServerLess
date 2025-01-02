// Simule un service de réservation
export const bookTickets = async (showTimeId, numberOfTickets) => {
  // Simulation de délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simule une réponse de réservation réussie
  return {
    bookingId: Math.random().toString(36).substr(2, 9),
    showTimeId,
    numberOfTickets,
    status: 'confirmed'
  };
};