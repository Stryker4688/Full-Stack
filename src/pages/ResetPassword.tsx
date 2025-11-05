// src/pages/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Check, AlertCircle, Coffee } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import api from "../utils/axios";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams?.get("token");
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
    } else {
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  const passwordStrength = {
    length: formData.password.length >= 6,
    lowercase: /(?=.*[a-z])/.test(formData.password),
    uppercase: /(?=.*[A-Z])/.test(formData.password),
    number: /(?=.*\d)/.test(formData.password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!isPasswordStrong) {
      setError("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (!resetToken) {
      setError("Invalid reset session. Please start over.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/reset-password", {
        resetToken,
        newPassword: formData.password,
      });

      if (response.data.success) {
        addToast({
          type: "success",
          title: "Password Updated! ✅",
          message: "Your password has been reset successfully",
          duration: 5000,
        });

        // ریدایرکت به صفحه لاگین بعد از موفقیت
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password";
      setError(errorMessage);
      addToast({
        type: "error",
        title: "Reset Failed",
        message: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className={`text-3xl font-cursive font-bold mb-2 ${
              isDark ? "text-amber-400" : "text-amber-900"
            }`}
          >
            New Password
          </h2>

          <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Create a new password for your account
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              New Password
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                size={20}
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  error && !isPasswordStrong
                    ? "border-red-500 focus:ring-red-500"
                    : isDark
                    ? "border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                    : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                } ${
                  isDark
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-white text-gray-900 placeholder-gray-500"
                }`}
                placeholder="Create a secure password"
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
          </div>

          {/* Confirm Password Field */}
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
                }`}
                size={20}
              />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                  error && !passwordsMatch
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
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div
              className={`p-4 rounded-lg text-sm ${
                isDark
                  ? "bg-gray-700/50 text-gray-300"
                  : "bg-amber-50 text-gray-600"
              }`}
            >
              <p className="font-semibold mb-2">Password Requirements:</p>
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
                    passwordStrength.lowercase
                      ? "text-green-500"
                      : "text-red-500"
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
                    passwordStrength.uppercase
                      ? "text-green-500"
                      : "text-red-500"
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
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-500 text-sm flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !isPasswordStrong || !passwordsMatch}
            whileHover={{
              scale:
                isSubmitting || !isPasswordStrong || !passwordsMatch ? 1 : 1.02,
            }}
            whileTap={{
              scale:
                isSubmitting || !isPasswordStrong || !passwordsMatch ? 1 : 0.98,
            }}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              isSubmitting || !isPasswordStrong || !passwordsMatch
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : isDark
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-amber-900 hover:bg-amber-800 text-white"
            } flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <Check size={20} />
                Reset Password
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
