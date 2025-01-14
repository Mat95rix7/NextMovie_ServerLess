import { useEffect, useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useMovieInteractions(userId, movieId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [rating, setRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userRef = doc(db, 'users', userId);

  // Charger les données initiales
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsFavorite(data.stats.favorites?.includes(movieId) ?? false);
          setIsWatchLater(data.stats.watchlist?.includes(movieId) ?? false);
          const movieRating = data.stats.reviews?.find(r => r.movieId === movieId);
          setRating(movieRating?.rating ?? null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId, movieId]);

  const toggleFavorite = async () => {
    try {
      await updateDoc(userRef, {
        'stats.favorites': isFavorite 
          ? arrayRemove(movieId)
          : arrayUnion(movieId)
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
    }
  };

  const toggleWatchLater = async () => {
    try {
      await updateDoc(userRef, {
        'stats.watchlist': isWatchLater 
          ? arrayRemove(movieId)
          : arrayUnion(movieId)
      });
      setIsWatchLater(!isWatchLater);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la liste à voir:', error);
    }
  };

  const updateRating = async (newRating) => {
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let reviews = data.stats?.reviews || [];
        
        // Supprimer l'ancienne évaluation si elle existe
        reviews = reviews.filter(r => r.movieId !== movieId);
        
        // Ajouter la nouvelle évaluation
        if (newRating > 0) {
          reviews.push({ movieId, rating: newRating });
        }

        await updateDoc(userRef, { 'stats.reviews': reviews });
        setRating(newRating > 0 ? newRating : null);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
    }
  };

  return {
    isFavorite,
    isWatchLater,
    rating,
    isLoading,
    toggleFavorite,
    toggleWatchLater,
    updateRating
  };
}