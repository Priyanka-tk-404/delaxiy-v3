import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api';
const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('dlx_user')); } catch { return null; } });
  const [token,   setToken]   = useState(() => localStorage.getItem('dlx_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { token ? localStorage.setItem('dlx_token', token) : localStorage.removeItem('dlx_token'); }, [token]);
  useEffect(() => { user  ? localStorage.setItem('dlx_user', JSON.stringify(user))  : localStorage.removeItem('dlx_user'); }, [user]);

  useEffect(() => {
    if (!token) return;
    authApi.me().then(d => setUser(d.user)).catch(() => { setToken(null); setUser(null); });
  }, []); // eslint-disable-line

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try { const d = await authApi.register({ name, email, password }); setToken(d.token); setUser(d.user); return d; }
    finally { setLoading(false); }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try { const d = await authApi.login({ email, password }); setToken(d.token); setUser(d.user); return d; }
    finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => { setToken(null); setUser(null); }, []);

  return (
    <Ctx.Provider value={{ user, token, loading, register, login, logout, isAuth: !!token }}>
      {children}
    </Ctx.Provider>
  );
}
export const useAuth = () => useContext(Ctx);
