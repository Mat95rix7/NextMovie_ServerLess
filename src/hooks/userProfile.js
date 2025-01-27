import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { updateProfile as firebaseUpdateProfile } from 'firebase/auth';
import axios from 'axios';

export async function createUserProfile(userId, data) {
  try { 
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      displayName: data.displayName, 
      email: data.email,
      role : "user", 
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      stats: {
        watchlist:[], 
        favorites: [], 
        reviews: [] 
      }, 
      ...data }); 
      console.log("Profil utilisateur créé avec succès"); 
    } catch (error) {
      console.error("Erreur lors de la création du profil utilisateur :", error.message); 
    } 
  }

export async function getUserProfile(userId) {
  if (!userId) {
    console.log("Aucun utilisateur connecté");
    return null;
  }
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updateProfile(userId, data) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
  
  if (auth.currentUser) {
    await firebaseUpdateProfile(auth.currentUser, {
      displayName: data.displayName
    });
  }
}

export async function checkUsernameAvailability(username) {
  const usersCollection = collection(db, 'users');
  const q = query(usersCollection, where('displayName', '==', username));
  try {
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // Aucun document trouvé avec ce nom d'utilisateur
      return true; // Le nom d'utilisateur est disponible
    } else {
      // Au moins un document trouvé avec ce nom d'utilisateur
      return false; // Le nom d'utilisateur est déjà pris
    }
  } catch (error) {
    console.error("Erreur lors de la vérification :", error);
    return false; // Ou gérer l'erreur différemment selon vos besoins
  }
}

export const getTotalMoviesPerUser =  (user) => {
  
    const favorites = user.stats?.favorites || [];
    const watchlist = user.stats?.watchlist || [];
    const ratedMovies = user.stats?.reviews || [];
    const allMovies = [...favorites, ...watchlist, ...ratedMovies];
    // Use a Set to remove duplicates
    const uniqueMovies = new Set(allMovies);
    // Return the size of the Set
    return uniqueMovies.size;
};

export const getTotalMoviesInApp = (users) => {
  let totalUniqueMovies = new Set();
  let uniqueFavorites = new Set();

  users.forEach((user) => {
    const favorites = user.stats?.favorites || [];
    const watchlist = user.stats?.watchlist || [];
    const ratedMovies = user.stats?.reviews 
      ? user.stats.reviews.map((review) => review.movieId) 
      : [];

    // Ajouter tous les films uniques au Set
    totalUniqueMovies = new Set([...totalUniqueMovies, ...favorites, ...watchlist, ...ratedMovies]);

    // Ajouter au total des favoris
    uniqueFavorites = new Set([...uniqueFavorites, ...favorites]);
  });
  const totalMovies = totalUniqueMovies.size;
  const totalFavorites = uniqueFavorites.size;

  return { totalMovies, totalFavorites };
};

export async function deleteUserAccount(userid) {
  try {
    // Supprimer les données de l'utilisateur dans Firestore
    const userDocRef = doc(db, "users", userid);
    await deleteDoc(userDocRef);
    console.log("Données utilisateur supprimées avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression des données utilisateur :", error);
  }
}

const getMovieDetails = async (movieId) => {
  const response = await axios.get(`/movie/${movieId}?&language=fr`);
  return {
    title: response.data.title,
    releaseDate: response.data.release_date
  };
};

// export const getMovieStats = async () => {
//   const usersRef = collection(db, 'users');
//   const snapshot = await getDocs(usersRef);

//   let movieStats = {};

//   snapshot.forEach(doc => {
//     const userData = doc.data().stats;

//     if (userData.watchlist) {
//       userData.watchlist.forEach(movieId => {
//         if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
//         movieStats[movieId].watchlist++;
//       });
//     }

//     if (userData.favorites) {
//       userData.favorites.forEach(movieId => {
//         if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
//         movieStats[movieId].favorites++;
//       });
//     }

//     if (userData.reviews) {
//       userData.reviews.forEach(review => {
//         if (!movieStats[review.movieId]) movieStats[review.movieId] = { id: review.movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
//         movieStats[review.movieId].reviews++;
//         movieStats[review.movieId].ratings.push(review.rating);
//       });
//     }
//   });

//   for (const movieId in movieStats) {
//     const ratings = movieStats[movieId].ratings;
//     if (ratings.length > 0) {
//       movieStats[movieId].averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
//     }
//     delete movieStats[movieId].ratings;

//     const { title, releaseDate } = await getMovieDetails(movieId);
//     movieStats[movieId].title = title;
//     movieStats[movieId].releaseDate = releaseDate;
//   }

//   return Object.values(movieStats);
// };



export const getMovieStats = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);

  let movieStats = {};

  snapshot.forEach(doc => {
    const userData = doc.data().stats || {};

    if (Array.isArray(userData.watchlist)) {
      userData.watchlist.forEach(movieId => {
        if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
        movieStats[movieId].watchlist++;
      });
    }

    if (Array.isArray(userData.favorites)) {
      userData.favorites.forEach(movieId => {
        if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
        movieStats[movieId].favorites++;
      });
    }

    if (Array.isArray(userData.reviews)) {
      userData.reviews.forEach(review => {
        if (review && review.movieId && typeof review.rating === 'number') {
          if (!movieStats[review.movieId]) movieStats[review.movieId] = { id: review.movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
          movieStats[review.movieId].reviews++;
          movieStats[review.movieId].ratings.push(review.rating);
        }
      });
    }
  });

  for (const movieId in movieStats) {
    const ratings = movieStats[movieId].ratings;
    if (ratings.length > 0) {
      movieStats[movieId].averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
    } else {
      movieStats[movieId].averageRating = null;
    }
    delete movieStats[movieId].ratings;

    const movieDetails = await getMovieDetails(movieId);
    if (movieDetails) {
      movieStats[movieId].title = movieDetails.title || "Titre inconnu";
      movieStats[movieId].releaseDate = movieDetails.releaseDate || "Date inconnue";
    } else {
      movieStats[movieId].title = "Titre inconnu";
      movieStats[movieId].releaseDate = "Date inconnue";
    }
  }

  return Object.values(movieStats);
};



