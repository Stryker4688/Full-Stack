// src/components/auth/EmailVerificationStatus.tsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Mail, RefreshCw } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

interface EmailVerificationStatusProps {
  compact?: boolean;
}

const EmailVerificationStatus: React.FC<EmailVerificationStatusProps> = ({
  compact = false,
}) => {
  const { isDark } = useTheme();
  const { user, sendVerificationEmail, loading } = useAuth();

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
    } catch (error) {
      console.error("Failed to resend verification:", error);
    }
  };

  if (!user) return null;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 text-sm ${
          user.emailVerified
            ? isDark
              ? "text-green-400"
              : "text-green-600"
            : isDark
            ? "text-amber-400"
            : "text-amber-600"
        }`}
      >
        {user.emailVerified ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <XCircle className="w-4 h-4" />
        )}
        <span>{user.emailVerified ? "Verified" : "Not Verified"}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        user.emailVerified
          ? isDark
            ? "bg-green-900/20 border-green-500/30"
            : "bg-green-50 border-green-200"
          : isDark
          ? "bg-amber-900/20 border-amber-500/30"
          : "bg-amber-50 border-amber-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${
              user.emailVerified
                ? isDark
                  ? "bg-green-500/20"
                  : "bg-green-100"
                : isDark
                ? "bg-amber-500/20"
                : "bg-amber-100"
            }`}
          >
            {user.emailVerified ? (
              <CheckCircle
                className={`w-5 h-5 ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}
              />
            ) : (
              <Mail
                className={`w-5 h-5 ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              />
            )}
          </div>

          <div>
            <h3
              className={`font-semibold ${
                user.emailVerified
                  ? isDark
                    ? "text-green-400"
                    : "text-green-600"
                  : isDark
                  ? "text-amber-400"
                  : "text-amber-600"
              }`}
            >
              Email {user.emailVerified ? "Verified" : "Not Verified"}
            </h3>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {user.emailVerified
                ? "Your email address has been successfully verified."
                : "Please verify your email address to access all features."}
            </p>

            {!user.emailVerified && (
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className={`flex items-center gap-2 mt-2 text-sm ${
                  isDark
                    ? "text-amber-400 hover:text-amber-300"
                    : "text-amber-600 hover:text-amber-700"
                } transition-colors disabled:opacity-50`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Sending..." : "Resend Verification Email"}
              </button>
            )}
          </div>
        </div>

        {user.emailVerified && (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isDark
                ? "bg-green-500/20 text-green-400"
                : "bg-green-100 text-green-600"
            }`}
          >
            Verified
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EmailVerificationStatus;
