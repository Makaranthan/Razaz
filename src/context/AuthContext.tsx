import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = React.useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const logout = React.useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Verify token and get latest user data
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data.user);
          localStorage.setItem('user', JSON.stringify(data.data.user));
        } else {
          // Token invalid or expired
          logout();
        }
      })
      .catch(() => {
        // Network error, keep existing user data for now
      });
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthModalOpen, setIsAuthModalOpen }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
