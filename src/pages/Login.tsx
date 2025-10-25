// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Coffee,
  Check,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const emailValue = watch("email");

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRemember = localStorage.getItem("rememberMe") === "true";

    if (savedEmail && savedRemember) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  // Sync error from AuthContext to local state
  useEffect(() => {
    console.log("🟢 Login - Auth error changed:", error);
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  // Clear error when form changes
  useEffect(() => {
    if (localError) {
      setLocalError(null);
      clearError();
    }
  }, [emailValue, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    console.log("🟢 Login onSubmit - Starting...");
    setLocalError(null);
    clearError();

    try {
      await login(data.email, data.password, rememberMe);
      console.log("🟢 Login onSubmit - Success");

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }
    } catch (error) {
      console.log("🔴 Login onSubmit - Caught error:", error);
    }
  };

  // نمایش خطا از location state (اگر از ProtectedAction آمده باشد)
  const locationError = location.state?.message;

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-amber-900"
          : "bg-gradient-to-br from-amber-50 to-amber-100"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full space-y-8 p-8 rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-800/90" : "bg-white/95"
        } backdrop-blur-sm border ${
          isDark ? "border-amber-500/30" : "border-amber-200"
        }`}
      >
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4"
          >
            <Coffee className="w-8 h-8 text-white" />
          </motion.div>
          <h2
            className={`text-3xl font-cursive font-bold ${
              isDark ? "text-amber-400" : "text-amber-900"
            }`}
          >
            Welcome Back
          </h2>
          <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Sign in to your Brew Haven account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } ${errors.email ? "text-red-500" : ""}`}
                size={20}
              />
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : isDark
                    ? "border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                    : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                } ${
                  isDark
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-white text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle size={14} />
                {errors.email.message}
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } ${errors.password ? "text-red-500" : ""}`}
                size={20}
              />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : isDark
                    ? "border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                    : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                } ${
                  isDark
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-white text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle size={14} />
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
                    rememberMe
                      ? "bg-amber-500 border-amber-500"
                      : isDark
                      ? "border-gray-500 bg-gray-700"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {rememberMe && <Check size={14} className="text-white" />}
                </div>
              </div>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Remember me
              </span>
            </label>

            <button
              type="button"
              className={`text-sm font-medium transition-colors ${
                isDark
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-amber-600 hover:text-amber-700"
              }`}
            >
              Forgot password?
            </button>
          </div>

          {/* نمایش خطا از ProtectedAction */}
          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-500 text-sm"
            >
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{locationError}</span>
              </div>
            </motion.div>
          )}

          {/* نمایش خطا از AuthContext */}
          {localError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-500 text-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>
                    {localError === "Invalid credentials" ||
                    localError === "invalid-password"
                      ? "🔐 Invalid email or password"
                      : localError === "user_not_found" ||
                        localError === "User not found"
                      ? "👤 User not found with this email address"
                      : localError === "User already exists"
                      ? "👤 User with this email already exists"
                      : `❌ ${localError}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocalError(null);
                    clearError();
                  }}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !isValid}
            whileHover={{ scale: loading || !isValid ? 1 : 1.02 }}
            whileTap={{ scale: loading || !isValid ? 1 : 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              loading || !isValid
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : isDark
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-amber-900 hover:bg-amber-800 text-white"
            } flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t ${
                  isDark ? "border-gray-600" : "border-gray-300"
                }`}
              />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className={`px-2 ${
                  isDark
                    ? "bg-gray-800 text-gray-400"
                    : "bg-white text-gray-500"
                }`}
              >
                New to Brew Haven?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className={`font-medium transition-colors ${
                isDark
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-amber-600 hover:text-amber-700"
              }`}
            >
              Create your account
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
