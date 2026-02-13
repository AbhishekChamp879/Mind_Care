import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  user: {
    name: string;
    role: 'student' | 'counselor' | 'admin';
    email: string;
  } | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (userData: AuthState['user']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = (userData: AuthState['user']) => {
    setAuthState({
      user: userData,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
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