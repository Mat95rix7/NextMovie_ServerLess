import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "../../services/userProfile";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userProfile = await getUserProfile(firebaseUser.uid);
          
          // IMPORTANT: Utiliser explicitement photoURL depuis Firestore
          // Si photoURL est null dans Firestore, celui-ci prévaut sur Firebase Auth
          const mergedUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            // Autres propriétés de base de Firebase Auth que vous souhaitez conserver
            
            // Priorité aux données Firestore pour ces champs
            displayName: userProfile?.displayName || firebaseUser.displayName,
            role: userProfile?.role || "user",
            
            // CRUCIAL: Utiliser explicitement photoURL de Firestore s'il existe, même s'il est null
            // Cela garantit que si vous avez mis photoURL à null dans Firestore, il restera null
            photoURL: userProfile?.photoURL !== undefined ? userProfile.photoURL : firebaseUser.photoURL,
          };
          
          setUser(mergedUser);
          console.log("User state set with photoURL:", mergedUser.photoURL);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      } finally {
        setIsLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    setUser,
    loading: isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};