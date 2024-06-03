import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useState, useContext,useReducer, useEffect } from 'react';

const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state

  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  useEffect(() => {
    const getUserFromStorage = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          // If user data exists, parse it and dispatch LOGIN action
          dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
        }
      } catch (error) {
        console.error('Error retrieving user data from AsyncStorage:', error);
      }
    };

    getUserFromStorage();
  }, []);

  console.log('AuthContext state : ', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>

  )
}
export const useAuth = () => useContext(AuthContext);


// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = (userData) => {
//     // Here you can perform any login logic, like validating user credentials
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
