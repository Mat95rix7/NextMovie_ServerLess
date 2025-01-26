// import { createContext, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { use } from 'react';

// const UserContext = createContext();

// const initialState = {
//   displayName: '',
//   // Ajoutez d'autres propriétés utilisateur si nécessaire
// };

// function userReducer(state, action) {
//   switch (action.type) {
//     case 'UPDATE_DISPLAY_NAME':
//       return { ...state, displayName: action.payload };
//     // Ajoutez d'autres cas pour différentes actions
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

import { createContext, useReducer, useContext } from 'react';

const UserContext = createContext();

const initialState = {
  displayName: '',
  // Ajoutez d'autres propriétés utilisateur si nécessaire
};

function userReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_DISPLAY_NAME':
      return { ...state, displayName: action.payload };
    // Ajoutez d'autres cas pour différentes actions
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

UserProvider.propTypes = {  
  children: PropTypes.node.isRequired,
};

export default UserProvider; useUser;