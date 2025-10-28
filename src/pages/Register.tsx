// src/pages/Register.tsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Coffee,
  Check,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { registerSchema, RegisterFormData } from "../schemas/auth.schema";
import GoogleLoginButton from "../components/sections/GoogleLoginButton";
import TurnstileCaptcha from "../components/sections/TurnstileCaptcha";

const Register: React.FC = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const {
    register: registerUser,
    registerWithGoogle,
    loading,
    error,
    clearError,
  } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password");
  const emailValue = watch("email");

  // Sync error from AuthContext
  useEffect(() => {
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
  }, [emailValue, password]);

  const onSubmit = async (data: RegisterFormData) => {
    setLocalError(null);
    clearError();

    if (!captchaToken) {
      setLocalError("Please complete the captcha verification");
      return;
    }

    try {
      await registerUser(data.name, data.email, data.password, rememberMe);
      // فقط اگر موفق بود redirect کن
      router.push("/");
    } catch (error) {
      console.log("Register error:", error);
      // اگر خطا داشت، صفحه رو refresh نکن
    }
  };

  // Google Register با @react-oauth/google
  const googleRegister = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setGoogleLoading(true);
      setLocalError(null);
      clearError();

      try {
        await registerWithGoogle(codeResponse.code, rememberMe);
        router.push("/");
      } catch (error) {
        setLocalError("Google registration failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setLocalError("Google registration failed");
      setGoogleLoading(false);
    },
    flow: "auth-code", // تغییر به authorization code flow
  });

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaError = (error: string) => {
    setLocalError("Captcha verification failed");
    setCaptchaToken(null);
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken(null);
  };

  const passwordStrength = {
    length: password?.length >= 6,
    lowercase: /(?=.*[a-z])/.test(password || ""),
    uppercase: /(?=.*[A-Z])/.test(password || ""),
    number: /(?=.*\d)/.test(password || ""),
  };

  // Memoized components
  const headerSection = useMemo(
    () => (
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
          Join Brew Haven
        </h2>
        <p className={`mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Create your account and start your coffee journey
        </p>
      </div>
    ),
    [isDark]
  );

  const nameField = useMemo(
    () => (
      <div>
        <label
          htmlFor="name"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Full Name
        </label>
        <div className="relative">
          <User
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            } ${errors.name ? "text-red-500" : ""}`}
            size={20}
          />
          <input
            {...register("name")}
            type="text"
            autoComplete="name"
            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : isDark
                ? "border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            } ${
              isDark
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-white text-gray-900 placeholder-gray-500"
            }`}
            placeholder="Enter your full name"
          />
        </div>
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle size={14} />
            {errors.name.message}
          </motion.p>
        )}
      </div>
    ),
    [isDark, errors.name, register]
  );

  const emailField = useMemo(
    () => (
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
    ),
    [isDark, errors.email, register]
  );

  const passwordField = useMemo(
    () => (
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
            autoComplete="new-password"
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
            placeholder="Create a password"
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
    ),
    [isDark, errors.password, register, showPassword]
  );

  const confirmPasswordField = useMemo(
    () => (
      <div>
        <label
          htmlFor="confirmPassword"
          className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? "text-gray-400" : "text-gray-500"
            } ${errors.confirmPassword ? "text-red-500" : ""}`}
            size={20}
          />
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.confirmPassword
                ? "border-red-500 focus:ring-red-500"
                : isDark
                ? "border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
            } ${
              isDark
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-white text-gray-900 placeholder-gray-500"
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              isDark
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500 flex items-center gap-1"
          >
            <AlertCircle size={14} />
            {errors.confirmPassword.message}
          </motion.p>
        )}
      </div>
    ),
    [isDark, errors.confirmPassword, register, showConfirmPassword]
  );

  const rememberMeSection = useMemo(
    () => (
      <div className="flex items-center">
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
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Remember me
          </span>
        </label>
      </div>
    ),
    [isDark, rememberMe]
  );

  const passwordStrengthDisplay = useMemo(() => {
    if (!password) return null;

    return (
      <div
        className={`p-4 rounded-lg text-sm ${
          isDark ? "bg-gray-700/50 text-gray-300" : "bg-amber-50 text-gray-600"
        }`}
      >
        <p className="font-semibold mb-2">Password Strength:</p>
        <ul className="space-y-1">
          <li
            className={`flex items-center gap-2 ${
              passwordStrength.length ? "text-green-500" : "text-red-500"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                passwordStrength.length ? "bg-green-500" : "bg-red-500"
              }`}
            />
            At least 6 characters
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordStrength.lowercase ? "text-green-500" : "text-red-500"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                passwordStrength.lowercase ? "bg-green-500" : "bg-red-500"
              }`}
            />
            One lowercase letter
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordStrength.uppercase ? "text-green-500" : "text-red-500"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                passwordStrength.uppercase ? "bg-green-500" : "bg-red-500"
              }`}
            />
            One uppercase letter
          </li>
          <li
            className={`flex items-center gap-2 ${
              passwordStrength.number ? "text-green-500" : "text-red-500"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                passwordStrength.number ? "bg-green-500" : "bg-red-500"
              }`}
            />
            One number
          </li>
        </ul>
      </div>
    );
  }, [password, isDark, passwordStrength]);

  const captchaSection = useMemo(
    () => (
      <div className="py-4">
        <TurnstileCaptcha
          key={`captcha-${isDark ? "dark" : "light"}`}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onVerify={handleCaptchaVerify}
          onError={handleCaptchaError}
          onExpire={handleCaptchaExpire}
          theme={isDark ? "dark" : "light"}
        />
      </div>
    ),
    [isDark]
  );

  const errorDisplay = useMemo(() => {
    if (!localError) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-500 text-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>
              {localError === "User already exists"
                ? "👤 User with this email already registered"
                : localError === "Invalid credentials" ||
                  localError === "invalid-password"
                ? "🔐 Invalid email or password"
                : localError === "Validation failed"
                ? "📝 Invalid input data"
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
    );
  }, [localError, clearError]);

  const submitButton = useMemo(
    () => (
      <motion.button
        type="submit"
        disabled={loading || !isValid || !captchaToken}
        whileHover={{ scale: loading || !isValid || !captchaToken ? 1 : 1.02 }}
        whileTap={{ scale: loading || !isValid || !captchaToken ? 1 : 0.98 }}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
          loading || !isValid || !captchaToken
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : isDark
            ? "bg-amber-600 hover:bg-amber-500 text-white"
            : "bg-amber-900 hover:bg-amber-800 text-white"
        } flex items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </motion.button>
    ),
    [loading, isValid, captchaToken, isDark]
  );

  const googleSection = useMemo(
    () => (
      <div className="space-y-4">
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
                isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
              }`}
            >
              Or sign up with
            </span>
          </div>
        </div>
        <GoogleLoginButton
          onClick={() => googleRegister()}
          loading={googleLoading}
          text="Sign up with Google"
        />
      </div>
    ),
    [isDark, googleLoading, googleRegister]
  );

  const loginLink = useMemo(
    () => (
      <div className="text-center">
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Already have an account?{" "}
          <Link
            href="/login"
            className={`font-medium transition-colors ${
              isDark
                ? "text-amber-400 hover:text-amber-300"
                : "text-amber-600 hover:text-amber-700"
            }`}
          >
            Sign in
          </Link>
        </p>
      </div>
    ),
    [isDark]
  );

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
        {headerSection}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {nameField}
          {emailField}
          {passwordField}
          {confirmPasswordField}
          {rememberMeSection}
          {passwordStrengthDisplay}
          {captchaSection}
          {errorDisplay}
          {submitButton}
          {googleSection}
          {loginLink}
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
