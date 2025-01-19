import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function createUserProfile(userId, data) {
  try { 
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      displayName: data.displayName, 
      email: data.email,
      role : "user", 
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

//   const updateDisplayName = async (newName) => {
//     try {
//       await updateUserProfile({ displayName: newName });
//     } catch (error) {
//       throw new Error('Erreur lors de la mise à jour du nom d\'utilisateur');
//     }
//   };