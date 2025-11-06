// src/pages/ResetPasswordCode.tsx - نسخه نهایی
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Clock, RefreshCw, ArrowLeft, Shield } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import api from "../utils/axios";

const ResetPasswordCode: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const { addToast } = useToast();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const emailFromUrl = searchParams?.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else {
      router.push("/forgot-password");
    }
  }, [searchParams, router]);

  // Countdown برای resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Countdown برای lock
  useEffect(() => {
    if (lockCountdown > 0) {
      const timer = setTimeout(() => setLockCountdown(lockCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockCountdown === 0) {
      setIsLocked(false);
      setFailedAttempts(0);
      addToast({
        type: "info",
        title: "Lock Lifted",
        message: "You can try verifying again",
        duration: 3000,
      });
    }
  }, [lockCountdown, isLocked, addToast]);

  // اتوماتیک verify زمانی که همه فیلدها پر شد
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 6 && !isLocked) {
      handleVerifyCode(fullCode);
    }
  }, [code]);

  const handleVerifyCode = async (fullCode: string) => {
    if (isSubmitting || isLocked) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-reset-code", {
        code: fullCode,
        email: email,
      });

      if (response.data.success) {
        const resetToken = response.data.resetToken;

        addToast({
          type: "success",
          title: "Code Verified! ✅",
          message: "You can now set your new password",
          duration: 4000,
        });

        // هدایت به صفحه تنظیم رمز عبور جدید
        setTimeout(() => {
          router.push(
            `/google-password-setup?type=password-reset&token=${encodeURIComponent(
              resetToken
            )}&email=${encodeURIComponent(email)}`
          );
        }, 1000);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Verification failed";
      setError(errorMessage);

      // افزایش تعداد خطاها
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);

      // اگر 3 بار خطا کرد، قفل کن
      if (newFailedAttempts >= 3) {
        setIsLocked(true);
        setLockCountdown(300); // 5 دقیقه
        addToast({
          type: "error",
          title: "Account Locked 🔒",
          message: "Too many failed attempts. Please wait 5 minutes.",
          duration: 5000,
        });
      } else {
        addToast({
          type: "error",
          title: "Verification Failed",
          message: `${errorMessage} (${
            3 - newFailedAttempts
          } attempts remaining)`,
          duration: 5000,
        });
      }

      // کد رو پاک کن و به فیلد اول برو
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (isLocked) return;

    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // اتوماتیک به فیلد بعدی برو
      if (value && index < 5) {
        const nextInput = inputRefs.current[index + 1];
        nextInput?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (isLocked) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numbersOnly = pastedData.replace(/\D/g, "");

    if (numbersOnly.length === 6) {
      const newCode = numbersOnly.split("").slice(0, 6);
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      prevInput?.focus();
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isLocked) return;

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email,
      });

      if (response.data.success) {
        setCountdown(60);
        setError("");
        setCode(["", "", "", "", "", ""]);
        setFailedAttempts(0);

        inputRefs.current[0]?.focus();

        addToast({
          type: "success",
          title: "Code Sent! 📧",
          message: "New reset code sent to your email",
          duration: 4000,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend code";
      setError(errorMessage);

      addToast({
        type: "error",
        title: "Resend Failed",
        message: errorMessage,
        duration: 5000,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isCodeComplete = code.every((digit) => digit !== "");

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
            <Mail className="w-8 h-8 text-white" />
          </motion.div>

          <h2
            className={`text-3xl font-cursive font-bold mb-2 ${
              isDark ? "text-amber-400" : "text-amber-900"
            }`}
          >
            Enter Reset Code
          </h2>

          <p className={`mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            We sent a 6-digit code to
          </p>

          <p
            className={`font-semibold text-lg mb-6 ${
              isDark ? "text-amber-400" : "text-amber-600"
            }`}
          >
            {email}
          </p>

          {/* Lock Warning */}
          {isLocked && (
            <div
              className={`flex items-center justify-center gap-2 p-4 rounded-lg mb-4 ${
                isDark
                  ? "bg-red-900/30 border border-red-700/50"
                  : "bg-red-100 border border-red-300"
              }`}
            >
              <Shield
                size={20}
                className={isDark ? "text-red-400" : "text-red-600"}
              />
              <div className="text-center">
                <p
                  className={`text-sm font-semibold ${
                    isDark ? "text-red-300" : "text-red-700"
                  }`}
                >
                  Account Locked 🔒
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  Too many failed attempts. Try again in{" "}
                  {formatTime(lockCountdown)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div
            className="flex justify-center space-x-2"
            onPaste={isLocked ? undefined : handlePaste}
          >
            {code.map((digit, index) => (
              <motion.input
                key={index}
                ref={setInputRef(index)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                whileFocus={{ scale: isLocked ? 1 : 1.05 }}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  error && !isSubmitting
                    ? "border-red-500 focus:ring-red-500"
                    : isSubmitting
                    ? "border-blue-500 focus:ring-blue-500"
                    : isLocked
                    ? "border-gray-400 cursor-not-allowed"
                    : isDark
                    ? "border-gray-600 focus:border-amber-500 focus:ring-amber-500"
                    : "border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                } ${
                  isDark ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                } ${isSubmitting ? "animate-pulse" : ""} ${
                  isLocked ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={isSubmitting || isLocked}
                autoFocus={index === 0 && !isLocked}
              />
            ))}
          </div>

          {error && !isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-500 text-sm text-center"
            >
              {error}{" "}
              {failedAttempts > 0 &&
                `(${3 - failedAttempts} attempts remaining)`}
            </motion.div>
          )}

          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-500 text-sm text-center"
            >
              🔄 Verifying your code...
            </motion.div>
          )}

          {isCodeComplete && !isSubmitting && !error && !isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-500 text-sm text-center"
            >
              ✅ Code complete - Verifying...
            </motion.div>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={countdown > 0 || isLocked}
              className={`flex items-center justify-center gap-2 mx-auto text-sm ${
                countdown > 0 || isLocked
                  ? "text-gray-500 cursor-not-allowed"
                  : isDark
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-amber-600 hover:text-amber-700"
              } transition-colors`}
            >
              <RefreshCw className="w-4 h-4" />
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className={`flex items-center justify-center gap-2 mx-auto text-sm ${
                isDark
                  ? "text-gray-400 hover:text-gray-300"
                  : "text-gray-600 hover:text-gray-700"
              } transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              Use different email
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordCode;
