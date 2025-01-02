export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log('Bonjour');
      reject(new Error("La géolocalisation n'est pas supportée"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        console.log(resolve);
      },
      error => {
        reject(error);
      }
    );
  });
};
