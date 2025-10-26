// components/ProtectedRoute.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    router.push("/login");
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
