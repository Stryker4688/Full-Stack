// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const clearError = () => setError(null);

  // Login mutation - FIXED: استفاده درست از error response
  const loginMutation = useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Login success");
      setToken(data.token);
      setUser(data.user);
      setError(null);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      console.log("❌ Login onError - Full error:", error);
      // گرفتن پیام خطا از data.message
      const errorMessage = error.response?.data?.message || "Login failed";
      console.log("❌ Login onError - Setting error:", errorMessage);
      setError(errorMessage);
    },
  });

  // Register mutation - FIXED: استفاده درست از error response
  const registerMutation = useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const response = await api.post("/auth/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Register success");
      setToken(data.token);
      setUser(data.user);
      setError(null);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      console.log("❌ Register onError - Full error:", error);
      // گرفتن پیام خطا از data.message
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      console.log("❌ Register onError - Setting error:", errorMessage);
      setError(errorMessage);
    },
  });

  // Login function
  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<void> => {
    clearError();
    await loginMutation.mutateAsync({ email, password, rememberMe });
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<void> => {
    clearError();
    await registerMutation.mutateAsync({ name, email, password, rememberMe });
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    queryClient.clear();
    navigate("/");
  };

  const loading = loginMutation.isPending || registerMutation.isPending;
  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
