
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string) => void; // Simplified login
  logout: () => void;
  register: (username: string) => void; // Simplified registration
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (username: string) => {
    const user: User = { id: Date.now().toString(), username };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const register = (username: string) => {
    // In a real app, this would involve API calls and more validation
    const user: User = { id: Date.now().toString(), username };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // Consider clearing other contexts' data on logout
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
