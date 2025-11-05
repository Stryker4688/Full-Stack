// src/pages/EmailVerification.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Clock,
  RefreshCw,
  ArrowLeft,
  Copy,
  CheckCircle,
  Shield,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import api from "../utils/axios";

const EmailVerification: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastVerifiedCode, setLastVerifiedCode] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // تنظیم ref برای هر input
  const setInputRef = useCallback(
    (index: number) => (el: HTMLInputElement | null) => {
      inputRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const emailFromUrl = searchParams?.get("email");
    const pendingEmail = localStorage.getItem("pendingVerificationEmail");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else if (pendingEmail) {
      setEmail(pendingEmail);
    } else if (user?.email) {
      setEmail(user.email);
    } else {
      router.push("/register");
    }
  }, [searchParams, user, router]);

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
  }, [lockCountdown, isLocked]);

  // 🔥 اتوماتیک verify زمانی که همه فیلدها پر شد
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 6 && fullCode !== lastVerifiedCode && !isLocked) {
      console.log("🔍 Auto-verifying code:", fullCode);
      handleAutoVerify(fullCode);
    }
  }, [code]);

  const handleAutoVerify = async (fullCode: string) => {
    if (isSubmitting || isLocked) return;

    setIsSubmitting(true);
    setLastVerifiedCode(fullCode);

    try {
      const response = await api.post("/auth/verify-email", {
        code: fullCode,
        email: email,
      });

      console.log("✅ Auto-verification successful!", response.data);

      // ✅ ذخیره توکن و کاربر
      if (response.data.token && response.data.user) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // ایمیل pending رو پاک کن
        localStorage.removeItem("pendingVerificationEmail");

        // نمایش toast موفقیت
        addToast({
          type: "success",
          title: "Email Verified! 🎉",
          message: "Welcome to Brew Haven!",
          duration: 4000,
        });

        // ✅ ریدایرکت به صفحه اصلی
        setTimeout(() => {
          window.location.href = "/"; // از window.location استفاده کن برای رفرش state
        }, 1500);
      } else {
        throw new Error("No token received from server");
      }
    } catch (error: any) {
      console.error("❌ Auto-verification failed:", error);

      const errorMessage =
        error.response?.data?.message || error.message || "Verification failed";
      setError(errorMessage);
      setLastVerifiedCode(""); // اجازه دوباره تلاش کردن

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
      const firstInput = inputRefs.current[0];
      firstInput?.focus();
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
    const numbersOnly = pastedData.replace(/\D/g, ""); // فقط اعداد

    if (numbersOnly.length === 6) {
      const newCode = numbersOnly.split("").slice(0, 6);
      setCode(newCode);

      // فوکوس رو به آخرین فیلد ببر
      const lastInput = inputRefs.current[5];
      lastInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      prevInput?.focus();
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 6 && !isLocked) {
      handleAutoVerify(fullCode);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isLocked) return;

    try {
      const response = await api.post("/auth/resend-verification", {
        email: email,
      });

      if (response.data.success) {
        setCountdown(60);
        setError("");
        setCode(["", "", "", "", "", ""]); // کد رو پاک کن
        setLastVerifiedCode(""); // ریست کن
        setFailedAttempts(0); // ریست تعداد خطاها

        // فوکوس به فیلد اول
        const firstInput = inputRefs.current[0];
        firstInput?.focus();

        addToast({
          type: "success",
          title: "Code Sent! 📧",
          message: "New verification code sent to your email",
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: "info",
      title: "Copied!",
      message: "Text copied to clipboard",
      duration: 2000,
    });
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  // فرمت کردن زمان برای نمایش
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            className="mx-auto w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mb-6"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>

          <h2
            className={`text-3xl font-cursive font-bold mb-2 ${
              isDark ? "text-amber-400" : "text-amber-900"
            }`}
          >
            Verify Your Email
          </h2>

          <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            We sent a 6-digit code to
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <p
              className={`font-semibold text-lg ${
                isDark ? "text-amber-400" : "text-amber-600"
              }`}
            >
              {email}
            </p>
            <button
              onClick={() => copyToClipboard(email)}
              className={`p-1 rounded transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              title="Copy email"
            >
              <Copy size={16} />
            </button>
          </div>

          <p
            className={`text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            } mb-6`}
          >
            Enter the 6-digit code to verify your email address
          </p>

          {/* ❌ Paste Hint حذف شد */}

          {/* Lock Warning */}
          {isLocked && (
            <div
              className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
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

        <form className="space-y-6" onSubmit={handleManualSubmit}>
          <div
            className="flex justify-center space-x-2"
            onPaste={isLocked ? undefined : handlePaste}
          >
            {code.map((digit, index) => (
              <motion.input
                key={index}
                ref={setInputRef(index)}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={isLocked ? undefined : handlePaste}
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
              ✅ Code complete - Auto-verifying...
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
              <RefreshCw
                className={`w-4 h-4 ${isSubmitting ? "animate-spin" : ""}`}
              />
              {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
            </button>
          </div>

          {/* دکمه submit دستی برای موارد خاص */}
          <motion.button
            type="submit"
            disabled={!isCodeComplete || isSubmitting || isLocked}
            whileHover={{
              scale: !isCodeComplete || isSubmitting || isLocked ? 1 : 1.02,
            }}
            whileTap={{
              scale: !isCodeComplete || isSubmitting || isLocked ? 1 : 0.98,
            }}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              !isCodeComplete || isSubmitting || isLocked
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : isDark
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-amber-900 hover:bg-amber-800 text-white"
            } flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : isLocked ? (
              <>
                <Shield className="w-5 h-5" />
                Locked
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify Email
              </>
            )}
          </motion.button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
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
      </motion.div>
    </div>
  );
};

export default EmailVerification;
