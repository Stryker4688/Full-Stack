// src/pages/ForgotPassword.tsx - نسخه با ریدایرکت خودکار
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import api from "../utils/axios";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const { isDark } = useTheme();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown برای جلوگیری از ارسال مکرر
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // ریدایرکت خودکار بعد از موفقیت
  useEffect(() => {
    if (isSuccess && email) {
      const timer = setTimeout(() => {
        router.push(`/reset-password-code?email=${encodeURIComponent(email)}`);
      }, 2000); // 2 ثانیه delay برای نمایش پیام موفقیت

      return () => clearTimeout(timer);
    }
  }, [isSuccess, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.toLowerCase().trim(),
      });

      if (response.data.success) {
        setIsSuccess(true);
        setCountdown(60); // 1 دقیقه تا درخواست مجدد

        addToast({
          type: "success",
          title: "Verification Code Sent! 📧",
          message: "Check your email for the 6-digit verification code",
          duration: 5000,
        });

        console.log("✅ Code sent successfully to:", email);
        // ❌ ریدایرکت خودکار توسط useEffect بالا انجام میشه
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send verification code";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Request Failed",
        message: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleTryAnotherEmail = () => {
    setIsSuccess(false);
    setEmail("");
    setError("");
  };

  // استفاده از useMemo برای بهینه‌سازی
  const headerSection = useMemo(
    () => (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4"
        >
          <Mail className="w-8 h-8 text-white" />
        </motion.div>

        <h2
          className={`text-3xl font-cursive font-bold mb-2 ${
            isDark ? "text-amber-400" : "text-amber-900"
          }`}
        >
          {isSuccess ? "Redirecting..." : "Reset Password"}
        </h2>

        <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {isSuccess
            ? "We sent a 6-digit verification code to your email. Redirecting..."
            : "Enter your email to receive a verification code"}
        </p>
      </div>
    ),
    [isDark, isSuccess]
  );

  const emailInputSection = useMemo(
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
            } ${error ? "text-red-500" : ""}`}
            size={20}
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              error
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
            required
            disabled={isSubmitting || isSuccess}
          />
        </div>
      </div>
    ),
    [isDark, error, email, isSubmitting, isSuccess]
  );

  const errorDisplay = useMemo(() => {
    if (!error) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-500 text-sm flex items-center gap-2"
      >
        <AlertCircle size={16} />
        {error}
      </motion.div>
    );
  }, [error]);

  const submitButton = useMemo(
    () => (
      <motion.button
        type="submit"
        disabled={isSubmitting || !email || isSuccess}
        whileHover={{ scale: isSubmitting || !email || isSuccess ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting || !email || isSuccess ? 1 : 0.98 }}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
          isSubmitting || !email || isSuccess
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : isDark
            ? "bg-amber-600 hover:bg-amber-500 text-white"
            : "bg-amber-900 hover:bg-amber-800 text-white"
        } flex items-center justify-center gap-2`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending Code...
          </>
        ) : isSuccess ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Redirecting...
          </>
        ) : (
          "Send Verification Code"
        )}
      </motion.button>
    ),
    [isSubmitting, email, isDark, isSuccess]
  );

  const successContent = useMemo(
    () => (
      <div className="space-y-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-white" />
        </motion.div>

        <div className="space-y-4">
          <p
            className={`text-lg font-semibold ${
              isDark ? "text-amber-300" : "text-amber-700"
            }`}
          >
            {email}
          </p>

          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            We've sent a 6-digit verification code to your email address.
            Redirecting to code verification page...
          </p>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              💡 <strong>Tip:</strong> Check your spam folder if you don't see
              the email.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleTryAnotherEmail}
              disabled={countdown > 0}
              className={`text-sm ${
                countdown > 0
                  ? "text-gray-500 cursor-not-allowed"
                  : isDark
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-amber-600 hover:text-amber-700"
              } transition-colors`}
            >
              {countdown > 0
                ? `Resend code in ${countdown}s`
                : "Use different email"}
            </button>

            <button
              onClick={handleBackToLogin}
              className={`block text-sm ${
                isDark
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-700"
              } transition-colors`}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    ),
    [isDark, email, countdown, handleTryAnotherEmail, handleBackToLogin]
  );

  const formContent = useMemo(
    () => (
      <form className="space-y-6" onSubmit={handleSubmit}>
        {emailInputSection}
        {errorDisplay}
        {submitButton}

        <div className="text-center">
          <button
            type="button"
            onClick={handleBackToLogin}
            className={`flex items-center justify-center gap-2 mx-auto text-sm ${
              isDark
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-600 hover:text-gray-700"
            } transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </form>
    ),
    [emailInputSection, errorDisplay, submitButton, isDark, handleBackToLogin]
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
        {!isSuccess ? formContent : successContent}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
  