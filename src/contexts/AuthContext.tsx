// src/contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "../utils/axios";
import { useToast } from "./ToastContext";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  authProvider?: string;
  emailVerified?: boolean;
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
  loginWithGoogle: (code: string, rememberMe?: boolean) => Promise<void>;
  registerWithGoogle: (code: string, rememberMe?: boolean) => Promise<void>;
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
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const clearError = () => setError(null);

  // Regular Login mutation
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

      addToast({
        type: "success",
        title: "Login Successful!",
        message: `Welcome back ${data.user.name} 👋`,
        duration: 4000,
      });
    },
    onError: (error: any) => {
      console.log("❌ Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Login Failed",
        message: "Invalid email or password",
        duration: 5000,
      });
    },
  });

  // Regular Register mutation
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

      addToast({
        type: "success",
        title: "Account Created!",
        message: `Welcome to Brew Haven ${data.user.name} 🎉`,
        duration: 4000,
      });
    },
    onError: (error: any) => {
      console.log("❌ Register error:", error);
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Registration Failed",
        message: errorMessage,
        duration: 5000,
      });
    },
  });

  // Google Login mutation - با Authorization Code
  const loginWithGoogleMutation = useMutation({
    mutationFn: async (credentials: { code: string; rememberMe?: boolean }) => {
      console.log(
        "🔐 Sending Google login with code:",
        credentials.code.substring(0, 20) + "..."
      );
      const response = await api.post("/auth/google", {
        code: credentials.code,
        rememberMe: credentials.rememberMe || false,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Google login success");
      setToken(data.token);
      setUser(data.user);
      setError(null);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);

      addToast({
        type: "success",
        title: "Google Login Successful!",
        message: `Welcome ${data.user.name} 👋`,
        duration: 4000,
      });
    },
    onError: (error: any) => {
      console.log("❌ Google login error:", error);
      const errorMessage =
        error.response?.data?.message || "Google login failed";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Google Login Failed",
        message: errorMessage,
        duration: 5000,
      });
    },
  });

  // Google Register mutation - با Authorization Code
  const registerWithGoogleMutation = useMutation({
    mutationFn: async (credentials: { code: string; rememberMe?: boolean }) => {
      console.log(
        "🔐 Sending Google register with code:",
        credentials.code.substring(0, 20) + "..."
      );
      const response = await api.post("/auth/google", {
        code: credentials.code,
        rememberMe: credentials.rememberMe || false,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Google register success");
      setToken(data.token);
      setUser(data.user);
      setError(null);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);

      addToast({
        type: "success",
        title: "Google Registration Successful!",
        message: `Welcome to Brew Haven ${data.user.name} 🎉`,
        duration: 4000,
      });
    },
    onError: (error: any) => {
      console.log("❌ Google register error:", error);
      const errorMessage =
        error.response?.data?.message || "Google registration failed";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Google Registration Failed",
        message: errorMessage,
        duration: 5000,
      });
    },
  });

  // Functions
  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<void> => {
    clearError();
    await loginMutation.mutateAsync({
      email,
      password,
      rememberMe: rememberMe || false,
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<void> => {
    clearError();
    await registerMutation.mutateAsync({
      name,
      email,
      password,
      rememberMe: rememberMe || false,
    });
  };

  const loginWithGoogle = async (
    code: string,
    rememberMe?: boolean
  ): Promise<void> => {
    clearError();
    await loginWithGoogleMutation.mutateAsync({
      code,
      rememberMe: rememberMe || false,
    });
  };

  const registerWithGoogle = async (
    code: string,
    rememberMe?: boolean
  ): Promise<void> => {
    clearError();
    await registerWithGoogleMutation.mutateAsync({
      code,
      rememberMe: rememberMe || false,
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    queryClient.clear();

    addToast({
      type: "info",
      title: "Logout Successful",
      message: "You have been logged out successfully",
      duration: 3000,
    });

    router.push("/");
  };

  const loading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    loginWithGoogleMutation.isPending ||
    registerWithGoogleMutation.isPending;
  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    loginWithGoogle,
    registerWithGoogle,
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
