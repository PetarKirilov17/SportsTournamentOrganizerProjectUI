import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType, User } from '../types';

interface JwtPayload {
  sub: string;
  id: number;
  role: 'ADMIN' | 'PARTICIPANT';
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser({
            id: decoded.id,
            username: decoded.sub,
            role: decoded.role,
          });
        } else {
          localStorage.removeItem('jwt');
        }
      } catch {
        localStorage.removeItem('jwt');
      }
    }
  }, []);

  const login = (jwt: string) => {
    localStorage.setItem('jwt', jwt);
    const decoded = jwtDecode<JwtPayload>(jwt);
    setToken(jwt);
    setUser({
      id: decoded.id,
      username: decoded.sub,
      role: decoded.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 