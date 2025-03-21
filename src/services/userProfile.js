import axios from "axios";
import { getAuth } from "firebase/auth";
import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase";


async function getFirebaseToken() {

  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  throw new Error("Utilisateur non authentifié");
}

  export async function updateUserProfile(displayName, photoURL) {
    const token = await getFirebaseToken();
  
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ displayName, photoURL }),
    });
  
    const data = await res.json();
    console.log("Mise à jour du profil :", data);
    return data.user;
  }
  
  export async function deleteUserProfile() {
    const token = await getFirebaseToken();
  
    const res = await fetch("/api/user/profile", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await res.json();
    console.log("Compte supprimé :", data);
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
  