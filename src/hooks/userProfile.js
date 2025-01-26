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
        watchlist: 0, 
        favorites: 0, 
        reviews: 0 
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

// const updateUserProfile = async (userId, newDisplayName) => {
//   try {
//     // Mise à jour dans Firebase
//     await updateProfile(auth.currentUser, {
//       displayName: newDisplayName
//     });
    
//     // Mise à jour de l'état global (exemple avec Redux)
//     dispatch(updateDisplayName(newDisplayName));
    
//     // Mise à jour dans Firestore si nécessaire
//     const userRef = doc(db, 'users', userId);
//     await updateDoc(userRef, { displayName: newDisplayName });

//   } catch (error) {
//     console.error("Erreur lors de la mise à jour du profil :", error);
//   }
// };


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

//   const updateDisplayName = async (newName) => {
//     try {
//       await updateUserProfile({ displayName: newName });
//     } catch (error) {
//       throw new Error('Erreur lors de la mise à jour du nom d\'utilisateur');
//     }
//   };
export const getTotalMoviesPerUser =  (user) => {
  
    const favorites = user.stats?.favorites?.length || 0;
    const watchlist = user.stats?.watchlist?.length || 0;
    const ratedMovies = user.stats?.reviews?.length || 0;
    
    return favorites + watchlist + ratedMovies;
};

export const getTotalMoviesInApp = (users) => {
  
  let totalMovies = new Set();
  let totalFovorites = 0;

  users.forEach(user => {
    const favorites = user.stats?.favorites || [];
    const watchlist = user.stats?.watchlist || [];
    const ratedMovies = (Array.isArray(user.stats?.reviews) ? user.stats?.reviews?.map(review => review.movieId) : []);
    totalMovies = new Set([...totalMovies, ...favorites, ...watchlist, ...ratedMovies]);
    totalFovorites += favorites.length;
  });
  let size = totalMovies.size

  return { size, totalFovorites }
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

export const getMovieStats = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);

  let movieStats = {};

  snapshot.forEach(doc => {
    const userData = doc.data().stats;

    if (userData.watchlist) {
      userData.watchlist.forEach(movieId => {
        if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
        movieStats[movieId].watchlist++;
      });
    }

    if (userData.favorites) {
      userData.favorites.forEach(movieId => {
        if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
        movieStats[movieId].favorites++;
      });
    }

    if (userData.reviews) {
      userData.reviews.forEach(review => {
        if (!movieStats[review.movieId]) movieStats[review.movieId] = { id: review.movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
        movieStats[review.movieId].reviews++;
        movieStats[review.movieId].ratings.push(review.rating);
      });
    }
  });

  for (const movieId in movieStats) {
    const ratings = movieStats[movieId].ratings;
    if (ratings.length > 0) {
      movieStats[movieId].averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
    }
    delete movieStats[movieId].ratings;

    const { title, releaseDate } = await getMovieDetails(movieId);
    movieStats[movieId].title = title;
    movieStats[movieId].releaseDate = releaseDate;
  }

  return Object.values(movieStats);
};

