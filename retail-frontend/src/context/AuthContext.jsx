import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('fh_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('fh_user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data;
    localStorage.setItem('fh_token', data.token);
    localStorage.setItem('fh_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const data = res.data;
    localStorage.setItem('fh_token', data.token);
    localStorage.setItem('fh_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fh_token');
    localStorage.removeItem('fh_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
