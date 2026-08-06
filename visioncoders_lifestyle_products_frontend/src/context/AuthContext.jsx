import React, { createContext, useState, useEffect } from 'react';
import apiService from '../services/apiService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncAuth = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to parse user session', e);
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncAuth();
    
    // Listen for state updates globally
    window.addEventListener('authChange', syncAuth);
    return () => {
      window.removeEventListener('authChange', syncAuth);
    };
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const userData = await apiService.auth.signin(username, password);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (username, password) => {
    setLoading(true);
    try {
      const userData = await apiService.auth.adminSignin(username, password);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      return userData;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.auth.logout();
    } catch (e) {
      console.error('Backend logout failed', e);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      window.dispatchEvent(new Event('authChange'));
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
