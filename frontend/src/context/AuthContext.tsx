import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../utils/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth on app start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Failed to load auth:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const setAuth = async (user: User, token: string) => {
    setUser(user);
    setToken(token);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, setAuth, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
