// app/layout.tsx
"use client";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ToastProvider } from "../contexts/ToastContext";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ToastProvider>
              {" "}
              {/* اول ToastProvider */}
              <AuthProvider>
                {" "}
                {/* سپس AuthProvider */}
                <CartProvider>
                  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
                </CartProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
  