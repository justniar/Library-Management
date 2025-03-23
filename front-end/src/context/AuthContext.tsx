import React, { createContext, useState, ReactNode, useEffect } from "react";

interface AuthState {
  token: string;
  role: string;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: (userAuthInfo: { data: { token: string; role: string } }) => void;
  isUserAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: "",
    role: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedToken = localStorage.getItem("token") || "";
        const storedRole = localStorage.getItem("role") || "";
        setAuthState({ token: storedToken, role: storedRole });
      } catch (error) {
        console.error("LocalStorage is not available", error);
      }
    }
  }, []);

  const setUserAuthInfo = ({ data }: { data: { token: string; role: string } }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
    }
    setAuthState({ token: data.token, role: data.role });
  };

  const isUserAuthenticated = () => {
    return Boolean(authState.token);
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState: setUserAuthInfo, isUserAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
