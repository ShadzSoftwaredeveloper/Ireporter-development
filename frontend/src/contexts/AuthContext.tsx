import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize demo users if not exists
    const users = localStorage.getItem('users');
    if (!users) {
      const demoUsers = [
        {
          id: 'demo-user',
          email: 'user@demo.com',
          name: 'Demo User',
          password: 'password',
          role: 'user',
          createdAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 'demo-admin',
          email: 'admin@demo.com',
          name: 'Admin User',
          password: 'admin',
          role: 'admin',
          createdAt: '2025-01-01T00:00:00Z',
        },
      ];
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }

    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User & { password: string }) => 
      u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Mock user registration
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      email,
      name,
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
