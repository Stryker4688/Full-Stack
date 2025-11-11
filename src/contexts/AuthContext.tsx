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
  role: "user" | "admin" | "super_admin";
  authProvider?: string;
  emailVerified: boolean;
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
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  verifyUser: () => Promise<void>;
  isSuperAdmin: () => boolean; // اضافه شد
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
        verifyUserMutation.mutate();
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setInitialLoading(false);
      }
    } else {
      setInitialLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  // اضافه شد: تابع چک کردن سوپر ادمین
  const isSuperAdmin = (): boolean => {
    return user?.role === "super_admin";
  };

  const verifyUserMutation = useMutation({
    mutationFn: async (): Promise<{ success: boolean; user: User }> => {
      const response = await api.get("/auth/verify");
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ User verification successful:", data.user);
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        queryClient.setQueryData(["user"], data.user);
      }
      setInitialLoading(false);
    },
    onError: (error: any) => {
      console.error("❌ User verification failed:", error);
      if (error.response?.status === 401 || error.response?.status === 404) {
        logout();
      }
      setInitialLoading(false);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log("✅ Login success - Data:", data);

      if (data.message === "email-not-verified") {
        console.log("📧 Email not verified - redirecting to verification page");
        localStorage.setItem("pendingVerificationEmail", variables.email);
        window.location.href = `/email-verification?email=${encodeURIComponent(
          variables.email
        )}`;
        return;
      }

      console.log("✅ Login successful - setting token and user");
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

      if (error.response?.data?.message === "email-not-verified") {
        const email = error.response?.data?.email;
        if (email) {
          console.log(
            "📧 Email not verified - redirecting to verification page"
          );
          localStorage.setItem("pendingVerificationEmail", email);
          window.location.href = `/email-verification?email=${encodeURIComponent(
            email
          )}`;
          return;
        }
      }

      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Login Failed",
        message: errorMessage,
        duration: 5000,
      });
    },
  });

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
    onSuccess: (data, variables) => {
      console.log("✅ Register success - Data:", data);
      setError(null);
      localStorage.setItem("pendingVerificationEmail", variables.email);
      console.log(
        "✅ Registration completed - Redirecting to email verification"
      );
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

  const sendVerificationEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/send-verification");
      return response.data;
    },
    onSuccess: () => {
      addToast({
        type: "success",
        title: "Verification Code Sent",
        message: "Please check your email for 6-digit verification code",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification code";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Verification Failed",
        message: errorMessage,
        duration: 5000,
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (code: string) => {
      console.log("🔍 Sending verification code to backend:", code);
      const response = await api.post("/auth/verify-email", { code });
      return response.data;
    },
    onSuccess: (data) => {
      if (user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      addToast({
        type: "success",
        title: "Email Verified!",
        message: "Your email has been successfully verified",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.log("❌ Verify email error:", error);
      const errorMessage =
        error.response?.data?.message || "Email verification failed";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Verification Failed",
        message: errorMessage,
        duration: 5000,
      });
    },
  });

  const loginWithGoogleMutation = useMutation({
    mutationFn: async (credentials: { code: string; rememberMe?: boolean }) => {
      const response = await api.post("/auth/google", {
        code: credentials.code,
        rememberMe: credentials.rememberMe || false,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (
        data.action === "google_registration_pending" ||
        data.requiresPasswordSetup
      ) {
        console.log("🔍 Google user requires password setup - redirecting...");
        const params = new URLSearchParams();
        if (data.tempToken) params.append("token", data.tempToken);
        if (data.email) params.append("email", data.email);
        params.append("type", "google");
        window.location.href = `/google-password-setup?${params.toString()}`;
        return;
      }

      setToken(data.token);
      setUser(data.user);
      setError(null);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);

      addToast({
        type: "success",
        title: "Google Login Successful!",
        message: `Welcome back ${data.user.name} 👋`,
        duration: 4000,
      });
    },
    onError: (error: any) => {
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

  const registerWithGoogleMutation = useMutation({
    mutationFn: async (credentials: { code: string; rememberMe?: boolean }) => {
      const response = await api.post("/auth/google", {
        code: credentials.code,
        rememberMe: credentials.rememberMe || false,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Google register response:", data);

      if (
        data.action === "google_registration_pending" ||
        data.requiresPasswordSetup
      ) {
        console.log("🔍 Google user requires password setup - redirecting...");
        const params = new URLSearchParams();
        if (data.tempToken) params.append("token", data.tempToken);
        if (data.email) params.append("email", data.email);
        params.append("type", "google");
        window.location.href = `/google-password-setup?${params.toString()}`;
        return;
      }

      console.log("✅ Google registration successful - setting token and user");
      setToken(data.token);
      setUser(data.user);
      setError(null);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(["user"], data.user);

      addToast({
        type: "success",
        title: "Welcome to Brew Haven! 🎉",
        message: `Hello ${data.user.name}!`,
        duration: 4000,
      });

      console.log("🚀 Redirecting to home page...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
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
    console.log("🔍 Starting Google registration...");
    await registerWithGoogleMutation.mutateAsync({
      code,
      rememberMe: rememberMe || false,
    });
  };

  const sendVerificationEmail = async (): Promise<void> => {
    clearError();
    await sendVerificationEmailMutation.mutateAsync();
  };

  const verifyEmail = async (code: string): Promise<void> => {
    clearError();
    await verifyEmailMutation.mutateAsync(code);
  };

  const verifyUser = async (): Promise<void> => {
    clearError();
    await verifyUserMutation.mutateAsync();
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
    initialLoading ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    loginWithGoogleMutation.isPending ||
    registerWithGoogleMutation.isPending ||
    sendVerificationEmailMutation.isPending ||
    verifyEmailMutation.isPending ||
    verifyUserMutation.isPending;

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
    sendVerificationEmail,
    verifyEmail,
    verifyUser,
    isSuperAdmin, // اضافه شد
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
