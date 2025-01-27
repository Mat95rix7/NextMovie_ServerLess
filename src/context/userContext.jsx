// import { createContext, useReducer, useContext } from 'react';

// const UserContext = createContext();

// const initialState = {
//   displayName: '',
// };

// function userReducer(state, action) {
//   switch (action.type) {
//     case 'UPDATE_DISPLAY_NAME':
//       return { ...state, displayName: action.payload };
//     default:
//       return state;
//   }
// }

// export function UserProvider({ children }) {
//   const [state, dispatch] = useReducer(userReducer, initialState);

//   return (
//     <UserContext.Provider value={{ state, dispatch }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export function useUser() {
//   return useContext(UserContext);
// }

// UserProvider.propTypes = {  
//   children: PropTypes.node.isRequired,
// };

// export default UserProvider; useUser;

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
        setUser({ ...user, role: userProfile?.role });
        
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
