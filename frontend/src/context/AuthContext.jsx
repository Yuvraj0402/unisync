import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('unisync_active_user');
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to restore active session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, expectedRole) => {
    const res = await loginUser({ email, password, expectedRole });
    if (res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('unisync_active_user', JSON.stringify(res.user));
    }
    return res.user;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('unisync_active_user', JSON.stringify(res.user));
    }
    return res.user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('unisync_active_user');
  };

  const value = {
    currentUser,
    role: currentUser?.role || null,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
