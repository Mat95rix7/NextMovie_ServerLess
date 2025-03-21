import { db, auth } from './authService.js';
import axios from 'axios';

// Créer un profil utilisateur
const createUserProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const data = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const userRef = db.collection('users').doc(userId);
    await userRef.set({
      displayName: data.displayName,
      email: data.email,
      role: "user",
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      stats: {
        watchlist: [],
        favorites: [],
        reviews: []
      },
      ...data
    });

    return res.status(201).json({ message: 'Profil utilisateur créé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la création du profil utilisateur:", error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un profil utilisateur
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.uid;

    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    const userRef = db.collection('users').doc(userId);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Profil utilisateur non trouvé' });
    }

    const userData = docSnap.data();
    return res.status(200).json(userData);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil utilisateur:", error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un profil utilisateur
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.uid;
    const data = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    // Vérifier si l'utilisateur modifie son propre profil ou a les droits d'admin
    if (userId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const userRef = db.collection('users').doc(userId);
    await userRef.update(data);

    // Si le displayName est mis à jour, mettre également à jour dans Firebase Auth
    if (data.displayName) {
      await auth.updateUser(userId, {
        displayName: data.displayName
      });
    }

    return res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Vérifier la disponibilité d'un nom d'utilisateur
const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Nom d\'utilisateur requis' });
    }

    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('displayName', '==', username).get();
    
    const isAvailable = querySnapshot.empty;
    return res.status(200).json({ isAvailable });
  } catch (error) {
    console.error("Erreur lors de la vérification de disponibilité:", error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un compte utilisateur
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.uid;

    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    // Vérifier si l'utilisateur supprime son propre compte ou a les droits d'admin
    if (userId !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Supprimer les données de l'utilisateur dans Firestore
    const userDocRef = db.collection('users').doc(userId);
    await userDocRef.delete();

    // Supprimer l'utilisateur dans Firebase Auth
    await auth.deleteUser(userId);

    return res.status(200).json({ message: 'Compte utilisateur supprimé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte utilisateur:", error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer les statistiques globales des films
const getMovieStats = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    
    let movieStats = {};
    
    // Traitement des données utilisateurs
    users.forEach(userData => {
      const stats = userData.stats || {};
      
      // Traitement watchlist
      if (Array.isArray(stats.watchlist)) {
        stats.watchlist.forEach(movieId => {
          if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
          movieStats[movieId].watchlist++;
        });
      }
      
      // Traitement favorites
      if (Array.isArray(stats.favorites)) {
        stats.favorites.forEach(movieId => {
          if (!movieStats[movieId]) movieStats[movieId] = { id: movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
          movieStats[movieId].favorites++;
        });
      }
      
      // Traitement reviews
      if (Array.isArray(stats.reviews)) {
        stats.reviews.forEach(review => {
          if (review && review.movieId && typeof review.rating === 'number') {
            if (!movieStats[review.movieId]) movieStats[review.movieId] = { id: review.movieId, watchlist: 0, favorites: 0, reviews: 0, ratings: [] };
            movieStats[review.movieId].reviews++;
            movieStats[review.movieId].ratings.push(review.rating);
          }
        });
      }
    });
    
    // Calcul des moyennes
    for (const movieId in movieStats) {
      const ratings = movieStats[movieId].ratings;
      if (ratings.length > 0) {
        movieStats[movieId].averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
      } else {
        movieStats[movieId].averageRating = null;
      }
      delete movieStats[movieId].ratings;
      
      try {
        // Récupérer les détails du film depuis une API externe
        // const apiKey = process.env.TMDB_API_KEY;
        // const response = await axios.get(
        //   `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
        // );
        
        const response = await axios.get(`/api/movies/${movieId}`);
        
        if (response.data) {
          movieStats[movieId].title = response.data.title || "Titre inconnu";
          movieStats[movieId].releaseDate = response.data.release_date || "Date inconnue";
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération des détails du film ${movieId}:`, error);
        movieStats[movieId].title = "Titre inconnu";
        movieStats[movieId].releaseDate = "Date inconnue";
      }
    }
    
    return res.status(200).json(Object.values(movieStats));
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Obtenir des statistiques globales sur les films dans l'application
const getTotalMoviesStats = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    
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
    
    return res.status(200).json({ totalMovies, totalFavorites });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques totales:", error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

export {
  createUserProfile,
  getUserProfile,
  updateProfile,
  checkUsernameAvailability,
  deleteUserAccount,
  getMovieStats,
  getTotalMoviesStats
};