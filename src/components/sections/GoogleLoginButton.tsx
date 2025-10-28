// components/sections/GoogleLoginButton.tsx
import React from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

interface GoogleLoginButtonProps {
  onClick: () => void;
  loading: boolean;
  text: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onClick,
  loading,
  text,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg font-medium transition-colors ${
        loading
          ? "bg-gray-100 cursor-not-allowed"
          : "bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-white"
      }`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <FcGoogle className="w-5 h-5" />
      )}
      <span
        className={
          loading
            ? "text-gray-500 dark:text-gray-400"
            : "text-gray-700 dark:text-gray-300"
        }
      >
        {loading ? "Loading..." : text}
      </span>
    </motion.button>
  );
};

export default GoogleLoginButton;
