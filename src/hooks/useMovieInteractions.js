import { useEffect, useState, useCallback } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export function useMovieInteractions(userId, movieId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const [rating, setRating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRef = userId ? doc(db, 'users', userId) : null;

  // Initialiser ou récupérer le document utilisateur
  const initializeUserDoc = async () => {
    if (!userRef) return null;
    const docSnap = await getDoc(userRef);
    return docSnap.data();
  };

  // Charger les données initiales
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId || !movieId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await initializeUserDoc();
        if (data) {
          // Utilisation de l'opérateur de coalescence nulle pour garantir un tableau
          const favorites = data.stats?.favorites ?? [];
          const watchlist = data.stats?.watchlist ?? [];
          const reviews = data.stats?.reviews ?? []

          setIsFavorite(favorites.includes(movieId));
          setIsWatchLater(watchlist.includes(movieId));
          const movieRating = reviews.find(r => r.movieId === movieId);
          setRating(movieRating?.rating ?? null);
        }
        
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger vos interactions');
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId, movieId]);

  const toggleFavorite = useCallback(async (e) => {
    e.stopPropagation();
    if (!userId || !movieId || !userRef) return;

    try {
      await updateDoc(userRef, {
        'stats.favorites': isFavorite 
          ? arrayRemove(movieId)
          : arrayUnion(movieId),
        'stats.lastUpdated': new Date()
      });

      setIsFavorite(!isFavorite);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      setError('Impossible de mettre à jour les favoris');
    }
  }, [userId, movieId, isFavorite, userRef]);

  const toggleWatchLater = useCallback(async (e) => {
    e.stopPropagation();
    if (!userId || !movieId || !userRef) return;

    try {
      await updateDoc(userRef, {
        'stats.watchlist': isWatchLater 
          ? arrayRemove(movieId)
          : arrayUnion(movieId),
        'stats.lastUpdated': new Date()
      });

      setIsWatchLater(!isWatchLater);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la liste à voir:', error);
      setError('Impossible de mettre à jour la liste à voir');
    }
  }, [userId, movieId, isWatchLater, userRef]);

  const updateRating = useCallback(async (newRating) => {
    if (!userId || !movieId || !userRef) return;

    try {
      const data = await initializeUserDoc();
      if (!data) return;

      let reviews = data.stats?.reviews ?? [];
      reviews = reviews.filter(r => r.movieId !== movieId);
      
      if (newRating > 0) {
        reviews.push({
          movieId,
          rating: newRating,
          updatedAt: new Date()
        });
      }

      await updateDoc(userRef, {
        'stats.reviews': reviews,
        'stats.lastUpdated': new Date()
      });

      setRating(newRating > 0 ? newRating : null);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
      setError('Impossible de mettre à jour la note');
    }
  }, [userId, movieId, userRef]);

  return {
    isFavorite,
    isWatchLater,
    rating,
    isLoading,
    error,
    toggleFavorite,
    toggleWatchLater,
    updateRating
  };
}