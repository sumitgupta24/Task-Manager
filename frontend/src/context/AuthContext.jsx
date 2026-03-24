import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setAuthenticated(true);
      } catch (error) {
        // Invalid JSON stored, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      const { data: userData, token } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setAuthenticated(true);
      toast.success('Registration successful!');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });

      const { data: userData, token } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setAuthenticated(true);
      toast.success('Login successful!');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthenticated(false);
    toast.success('Logged out successfully!');
  }, []);

  const value = {
    user,
    loading,
    authenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
