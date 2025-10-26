// src/components/auth/LogoutConfirmation.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { LogOut, X, AlertTriangle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-md mx-4 rounded-2xl shadow-2xl ${
          isDark ? "bg-gray-800" : "bg-white"
        } border ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isDark ? "bg-amber-500/20" : "bg-amber-100"
              }`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              />
            </div>
            <h3
              className={`text-lg font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Confirm Logout
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark
                ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p
            className={`text-center mb-6 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Are you sure you want to logout{userName ? `, ${userName}` : ""}?
            <br />
            <span className="text-sm opacity-75">
              You'll need to sign in again to access your account.
            </span>
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold border transition-colors ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                isDark
                  ? "bg-red-600 text-white hover:bg-red-500"
                  : "bg-red-600 text-white hover:bg-red-500"
              }`}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutConfirmation;
