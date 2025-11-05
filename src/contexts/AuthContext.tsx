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
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user:", e);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const clearError = () => setError(null);

  // Login mutation
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

      // اگر ایمیل تأیید نشده باشد
      if (data.message === "email-not-verified") {
        console.log("📧 Email not verified - redirecting to verification page");

        // ذخیره ایمیل برای صفحه verification
        localStorage.setItem("pendingVerificationEmail", variables.email);

        // ریدایرکت به صفحه verification
        window.location.href = `/email-verification?email=${encodeURIComponent(
          variables.email
        )}`;
        return;
      }

      // اگر لاگین موفق بود
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

      // اگر خطای ایمیل تأیید نشده از سمت سرور برگردد
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

  // Register mutation - FIXED: No automatic redirect
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

      // ❌ هیچ توکنی ذخیره نکن - کاربر باید اول ایمیل رو verify کنه
      setError(null);

      // فقط ایمیل رو برای ریدایرکت ذخیره کن
      localStorage.setItem("pendingVerificationEmail", variables.email);

      // ❌ تاست رو حذف کردیم - کاربر مستقیماً به صفحه verification میره
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

  // Send Verification Email mutation
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

  // Verify Email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (code: string) => {
      console.log("🔍 Sending verification code to backend:", code);
      const response = await api.post("/auth/verify-email", { code });
      return response.data;
    },
    onSuccess: (data) => {
      // آپدیت وضعیت کاربر
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

  // Google Auth mutations
  const loginWithGoogleMutation = useMutation({
    mutationFn: async (credentials: { code: string; rememberMe?: boolean }) => {
      const response = await api.post("/auth/google", {
        code: credentials.code,
        rememberMe: credentials.rememberMe || false,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // 🔥 هندل کردن وضعیت google_registration_pending برای login هم
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

      // لاگین معمولی
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

      // 🔥 هندل کردن وضعیت google_registration_pending
      if (
        data.action === "google_registration_pending" ||
        data.requiresPasswordSetup
      ) {
        console.log("🔍 Google user requires password setup - redirecting...");

        // ساخت URL برای صفحه تنظیم رمز عبور
        const params = new URLSearchParams();
        if (data.tempToken) params.append("token", data.tempToken);
        if (data.email) params.append("email", data.email);
        params.append("type", "google");

        window.location.href = `/google-password-setup?${params.toString()}`;
        return;
      }

      // در غیر این صورت، ثبت‌نام معمولی
      console.log("✅ Google registration successful - setting token and user");

      // ذخیره توکن و کاربر
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

      // ریدایرکت به صفحه اصلی
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
    registerWithGoogleMutation.isPending ||
    sendVerificationEmailMutation.isPending ||
    verifyEmailMutation.isPending;

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
