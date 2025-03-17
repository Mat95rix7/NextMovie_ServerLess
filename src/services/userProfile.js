import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore';
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
      isActive: true, 
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
    return querySnapshot.empty
  } catch (error) {
    console.error("Erreur lors de la vérification :", error);
    return false; // Ou gérer l'erreur différemment selon vos besoins
  }
}
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
  const response = await axios.get(`/api/movies/${movieId}`);
  return {
    title: response.data.title,
    releaseDate: response.data.release_date
  };
};

export const subscribeToMovieStats = (callback) => {
  return onSnapshot(collection(db, 'users'), async (snapshot) => {
    let movieStats = {};

    // Traitement des données utilisateurs
    snapshot.docs.forEach(doc => {
      const userData = doc.data().stats || {};

      // Traitement watchlist
      if (Array.isArray(userData.watchlist)) {
        userData.watchlist.forEach(movieId => {
          if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
          movieStats[movieId].watchlist++;
        });
      }

      // Traitement favorites
      if (Array.isArray(userData.favorites)) {
        userData.favorites.forEach(movieId => {
          if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
          movieStats[movieId].favorites++;
        });
      }

      // Traitement reviews
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

    // Calcul des moyennes et récupération des détails
    for (const movieId in movieStats) {
      const ratings = movieStats[movieId].ratings;
      if (ratings.length > 0) {
        movieStats[movieId].averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
      } else {
        movieStats[movieId].averageRating = null;
      }
      delete movieStats[movieId].ratings;

      try {
        const movieDetails = await getMovieDetails(movieId);
        if (movieDetails) {
          movieStats[movieId].title = movieDetails.title || "Titre inconnu";
          movieStats[movieId].releaseDate = movieDetails.releaseDate || "Date inconnue";
        } else {
          movieStats[movieId].title = "Titre inconnu";
          movieStats[movieId].releaseDate = "Date inconnue";
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération des détails du film ${movieId}:`, error);
      }
    }

    // Envoi des données mises à jour via le callback
    callback(Object.values(movieStats));
  });
};