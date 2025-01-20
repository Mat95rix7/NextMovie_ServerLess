import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const checkIsAdmin = async (user) => {
  if (!user) return false;
  
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  return userDoc.data()?.role === 'admin';
};

export const fetchAdminStats = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const moviesSnapshot = await getDocs(collection(db, 'movies'));
  const reviewsSnapshot = await getDocs(collection(db, 'reviews'));

  const users = usersSnapshot.docs.map(doc => doc.data());
  const movies = moviesSnapshot.docs.map(doc => doc.data());
  const reviews = reviewsSnapshot.docs.map(doc => doc.data());

  const totalViews = movies.reduce((acc, movie) => acc + (movie.views || 0), 0);
  const totalRatings = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  
  return {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.lastLogin > Date.now() - 30 * 24 * 60 * 60 * 1000).length,
    totalMovies: movies.length,
    totalViews,
    totalReviews: reviews.length,
    totalFavorites: movies.reduce((acc, movie) => acc + (movie.favoritesCount || 0), 0),
    averageRating: reviews.length > 0 ? totalRatings / reviews.length : 0
  };
};

export const fetchUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  return usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toLocaleDateString(),
    lastLogin: doc.data().lastLogin?.toDate().toLocaleDateString()
  }));
};

export const fetchMovies = async () => {
  const moviesSnapshot = await getDocs(collection(db, 'movies'));
  return moviesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const deleteUser = async (userId) => {
  await deleteDoc(doc(db, 'users', userId));
};

export const deleteMovie = async (movieId) => {
  await deleteDoc(doc(db, 'movies', movieId));
};

export const updateUser = async (userId, data) => {
  await updateDoc(doc(db, 'users', userId), data);
};

export const updateMovie = async (movieId, data) => {
  await updateDoc(doc(db, 'movies', movieId), data);
};