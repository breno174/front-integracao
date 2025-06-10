
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import axios from '../components/config/api';

interface AuthContextType {
  currentUser: User | null;
  login: (id: string, username: string) => void;
  logout: () => void;
  register: (id: string, username: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (username: string, password: string) => {
    const user: User = { id: password, username };
    setCurrentUser(user);
    await axios.post('/api/users/login', { email: username, ip_address: password })
      .then(response => {
        console.log('Login successful:', response.data);
        const loadUser = { id: response.data.user.id, username: response.data.user.email };
        setCurrentUser(loadUser);
      }
    )
      .catch(error => {
        console.error('Login failed:', error);
      }
    );
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const register = (username: string, password: string) => {
    const user: User = { id: password, username };
    setCurrentUser(user);
    axios.post('/api/users/login', { email: username, ip_address: password })
      .then(response => {
        console.log('Login successful:', response.data);
      }
    )
      .catch(error => {
        console.error('Login failed:', error);
      }
    );
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
