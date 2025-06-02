// src/context/AuthContext.js
import { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const local = JSON.parse(localStorage.getItem('auth'));
  // const [auth, setAuth] = useState(local || null);

  let local = null;
  try {
    local = JSON.parse(localStorage.getItem('auth'));
  } catch (e) {
    console.warn('Failed to parse auth from localStorage', e);
    local = null;
  }
  const [auth, setAuth] = useState(local);


  const login = (userData) => {
    setAuth(userData);
    localStorage.setItem('auth', JSON.stringify(userData));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
