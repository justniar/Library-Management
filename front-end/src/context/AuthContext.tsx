import React, { createContext, useState, ReactNode, useEffect } from "react";

interface AuthState {
  token: string;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: (userAuthInfo: { data: { data: string } }) => void;
  isUserAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: localStorage.getItem("token") || "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAuthState({ token: storedToken });
    }
  }, []);

  const setUserAuthInfo = ({ data }: { data: { data: string } }) => {
    const token = data.data;
    localStorage.setItem("token", token);
    setAuthState({ token });
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
