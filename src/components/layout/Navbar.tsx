// src/components/layout/Navbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Coffee,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "#menu" },
    { name: "About", path: "#about" },
    { name: "Testimonials", path: "#testimonial" },
    { name: "Contact", path: "#contact" },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    if (path.startsWith("#")) {
      // Handle scroll to section
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isDark
          ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-700"
          : "bg-white/95 backdrop-blur-md border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Coffee
                className={`w-8 h-8 ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              />
            </motion.div>
            <span
              className={`font-cursive text-2xl font-bold ${
                isDark ? "text-amber-400" : "text-amber-900"
              }`}
            >
              Brew Haven
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`font-medium transition-colors ${
                  location.pathname === item.path ||
                  (item.path.startsWith("#") && location.hash === item.path)
                    ? isDark
                      ? "text-amber-400"
                      : "text-amber-600"
                    : isDark
                    ? "text-gray-300 hover:text-amber-400"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-gray-800 text-amber-400 hover:bg-gray-700"
                  : "bg-amber-100 text-amber-600 hover:bg-amber-200"
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart */}
            <button className="relative p-2">
              <ShoppingCart
                className={`w-6 h-6 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs 
                  rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User
                    className={`w-5 h-5 ${
                      isDark ? "text-amber-400" : "text-amber-600"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-red-400"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "text-gray-300 hover:text-amber-400"
                      : "text-gray-700 hover:text-amber-600"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isDark
                      ? "bg-amber-600 text-white hover:bg-amber-500"
                      : "bg-amber-900 text-white hover:bg-amber-800"
                  } transition-colors`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                isDark
                  ? "bg-gray-800 text-amber-400"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart */}
            <button className="relative p-2">
              <ShoppingCart
                className={`w-6 h-6 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs 
                  rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg ${
                isDark
                  ? "bg-gray-800 text-gray-300"
                  : "bg-amber-100 text-gray-700"
              }`}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className={`block w-full text-left px-4 py-2 font-medium transition-colors ${
                    location.pathname === item.path ||
                    (item.path.startsWith("#") && location.hash === item.path)
                      ? isDark
                        ? "text-amber-400 bg-gray-800"
                        : "text-amber-600 bg-amber-100"
                      : isDark
                      ? "text-gray-300 hover:text-amber-400"
                      : "text-gray-700 hover:text-amber-600"
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {/* Mobile Auth */}
              <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <User size={18} />
                      <span>{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-500 w-full"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className={`block w-full text-center px-4 py-2 rounded-lg font-medium transition-colors ${
                        isDark
                          ? "text-gray-300 hover:text-amber-400"
                          : "text-gray-700 hover:text-amber-600"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`block w-full text-center px-4 py-2 rounded-lg font-medium ${
                        isDark
                          ? "bg-amber-600 text-white hover:bg-amber-500"
                          : "bg-amber-900 text-white hover:bg-amber-800"
                      } transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
