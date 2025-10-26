// components/ProtectedAction.tsx
"use client";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ProtectedActionProps {
  children: React.ReactNode;
  action: (e?: React.MouseEvent) => void; // Optional event parameter
  message?: string;
  className?: string;
}

const ProtectedAction: React.FC<ProtectedActionProps> = ({
  children,
  action,
  message = "Please login to continue",
  className = "",
}) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleAction = (e: React.MouseEvent) => {
    e?.stopPropagation();

    if (!user) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname;
      router.push(
        `/login?from=${currentPath}&message=${encodeURIComponent(message)}`
      );
      return;
    }

    // If user is logged in, execute the action
    action(e);
  };

  return (
    <motion.div
      onClick={handleAction}
      className={className}
      whileHover={{ scale: user ? 1.02 : 1 }}
      whileTap={{ scale: user ? 0.98 : 1 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedAction;
