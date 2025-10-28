// src/components/ui/LoadingSpinner.tsx
import React from "react";
import { Coffee } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text = "Loading...",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <Coffee
          className={`${sizeClasses[size]} text-amber-600 animate-pulse`}
        />
        <div
          className={`absolute inset-0 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin ${sizeClasses[size]}`}
        />
      </div>
      {text && <p className="text-gray-600 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
