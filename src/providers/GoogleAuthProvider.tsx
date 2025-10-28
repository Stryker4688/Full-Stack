// src/providers/GoogleAuthProvider.tsx
"use client";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

export default function GoogleAuthProvider({
  children,
}: GoogleAuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
