import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(user) => {
      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }
      await updateLastLogin(user.uid);
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setPersistence(auth, browserLocalPersistence)
    // setPersistence(auth, browserSessionPersistence)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signup = async (email, password) => { 
    try { 
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential; 
    } catch (error) { 
        console.error("Erreur lors de l'inscription :", error.message); 
        throw error; 
      } 
    }; 

  const updateLastLogin = async (userId) => {
    const userRef = doc(db, "users", userId);
    try {
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() || {};
      await setDoc(userRef, 
        { ...userData, lastLogin: new Date().toISOString() }, 
        { merge: true }
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };
  const logout = () => {
    return signOut(auth);
  };

  return {
    user,
    loading,
    login,
    signup,
    logout
  };
}