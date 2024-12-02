import React, { createContext, useState, ReactNode, useEffect } from "react";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "../services/authService";
import { Alert } from "react-native";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await getAccessToken();
      const userData = await AsyncStorage.getItem("user");
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await registerApi(username, email, password);
      if (response.success) {
        setIsAuthenticated(true);
        setUser({
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
