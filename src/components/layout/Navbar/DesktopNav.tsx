// src/components/layout/DesktopNav.tsx
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";

const DesktopNav: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="hidden md:flex items-center gap-8">
      {/* Main Menu */}
      <ul className="flex gap-8 items-center text-lg font-semibold text-white">
        <a href="/">
          <li className="cursor-pointer hover:text-amber-300 transition-colors duration-300 py-2">
            Home
          </li>
        </a>
        <a href="#menu">
          <li className="cursor-pointer hover:text-amber-300 transition-colors duration-300 py-2">
            Menu
          </li>
        </a>
        <a href="#about">
          <li className="cursor-pointer hover:text-amber-300 transition-colors duration-300 py-2">
            About
          </li>
        </a>
        <a href="#testimonial">
          <li className="cursor-pointer hover:text-amber-300 transition-colors duration-300 py-2">
            Testimonials
          </li>
        </a>
        <a href="#contact">
          <li className="cursor-pointer hover:text-amber-300 transition-colors duration-300 py-2">
            Contact
          </li>
        </a>
      </ul>

      {/* Separator */}
      <div className="h-8 w-px bg-amber-600/50"></div>

      {/* Auth Section */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {user.name}</span>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a href="/login">
              <button className="px-6 py-2 rounded-lg font-semibold border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-900 transition-all duration-300">
                Login
              </button>
            </a>
            <a href="/register">
              <button className="px-6 py-2 rounded-lg font-semibold bg-amber-600 text-white hover:bg-amber-500 transition-all duration-300">
                Sign Up
              </button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DesktopNav;
