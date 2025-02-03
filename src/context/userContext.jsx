import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
import { getUserProfile } from "../hooks/userProfile";

const AuthContext = createContext();

export const useAuth2 = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        console.log(userProfile);
        setUser({...user,
          displayName: userProfile?.displayName,  // S'assurer que le displayName est bien stocké
          role: userProfile?.role || "user",  // S'assurer d'avoir un role par défaut
        });
        // setUser({ ...user, role: userProfile?.role });
        
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    setUser,
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
