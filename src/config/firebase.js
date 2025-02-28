import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence} from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const usersCollectionRef = collection(db, 'users');

export const getUsers = async () => {
  const data = await getDocs(usersCollectionRef);
  return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const getUserByMail = async (email) => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('Erreur de recherche utilisateur:', error);
    return null;
  }
};

export const subscribeToUsers = (callback) => {
  return onSnapshot(usersCollectionRef, (snapshot) => {
    const users = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }));
    callback(users);
  });
};