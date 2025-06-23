import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  type: "vendedor" | "entregador";
  name: string;
  email?: string;
  establishmentId?: string;
}

interface AuthenticatedEstablishment {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  authenticatedEstablishment: AuthenticatedEstablishment | null;
  login: (userData: User) => void;
  logout: () => void;
  setEstablishment: (establishment: AuthenticatedEstablishment) => void;
  clearEstablishment: () => void;
  isAuthenticated: boolean;
  isEstablishmentAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("mototrack_user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [authenticatedEstablishment, setAuthenticatedEstablishment] =
    useState<AuthenticatedEstablishment | null>(() => {
      if (typeof window !== "undefined") {
        const savedEstablishment = localStorage.getItem(
          "mototrack_establishment"
        );
        return savedEstablishment ? JSON.parse(savedEstablishment) : null;
      }
      return null;
    });

  const login = (userData: User) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("mototrack_user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mototrack_user");
    }
  };

  const setEstablishment = (establishment: AuthenticatedEstablishment) => {
    setAuthenticatedEstablishment(establishment);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "mototrack_establishment",
        JSON.stringify(establishment)
      );
    }
  };

  const clearEstablishment = () => {
    setAuthenticatedEstablishment(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mototrack_establishment");
      localStorage.removeItem("mototrack_user");
    }
  };

  const isAuthenticated = !!user;
  const isEstablishmentAuthenticated = !!authenticatedEstablishment;

  const value: AuthContextType = {
    user,
    authenticatedEstablishment,
    login,
    logout,
    setEstablishment,
    clearEstablishment,
    isAuthenticated,
    isEstablishmentAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export type { User, AuthenticatedEstablishment };
