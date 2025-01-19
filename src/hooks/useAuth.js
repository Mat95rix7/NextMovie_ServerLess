import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
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