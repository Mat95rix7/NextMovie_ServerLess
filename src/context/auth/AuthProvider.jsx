import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile } from "../../hooks/userProfile";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userProfile = await getUserProfile(user.uid);
          setUser({
            ...user,
            displayName: userProfile?.displayName || user.displayName,
            role: userProfile?.role || "user",
          });
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