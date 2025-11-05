// app/layout.tsx
"use client";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ToastProvider } from "../contexts/ToastContext";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { ActiveSectionProvider } from "../contexts/ActiveSectionContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import "../index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Brew Haven</title>
        <meta name="description" content="Artisanal Coffee & Premium Beans" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/coffee5-BIzYKsk9.png" />
      </head>
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <ToastProvider>
                <AuthProvider>
                  <CartProvider>
                    <ActiveSectionProvider>
                      <Suspense fallback={<LoadingSpinner />}>
                        {children}
                      </Suspense>
                    </ActiveSectionProvider>
                  </CartProvider>
                </AuthProvider>
              </ToastProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
