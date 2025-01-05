import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function createUserProfile(userId, data) {
  try { 
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      username: data.username, 
      email: data.email, 
      createdAt: new Date().toISOString(), 
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
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updateProfile(userId, data) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
}