// app/page.tsx
"use client";
import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Home from "../pages/Home";

export default function App() {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
