// src/components/layout/Navbar.tsx - نسخه اصلاح شده
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
  Plus,
  Settings,
  Users,
  MessageSquare,
  Package,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useActiveSection } from "../../contexts/ActiveSectionContext";
import LogoutConfirmation from "../auth/LogoutConfirmation";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { activeSection, scrollToSection } = useActiveSection();
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/", section: "home" },
    { name: "Offer", path: "#offer", section: "offer" },
    { name: "Menu", path: "#menu", section: "menu" },
    { name: "About", path: "#about", section: "about" },
    { name: "Testimonials", path: "#testimonial", section: "testimonial" },
    { name: "Contact", path: "#contact", section: "contact" },
  ];

  const adminMenuItems = [
    {
      name: "Create Product",
      path: "/admin/products/create",
      icon: Plus,
      description: "Add new coffee products",
    },
    {
      name: "Manage Products",
      path: "/admin/products",
      icon: Package,
      description: "View and edit products",
    },
    {
      name: "Manage Reviews",
      path: "/admin/testimonials",
      icon: MessageSquare,
      description: "Approve or reject testimonials",
    },
  ];

  const superAdminMenuItems = [
    {
      name: "Manage Admins",
      path: "/admin/users",
      icon: Users,
      description: "Create and manage admin users",
    },
    {
      name: "Admin Settings",
      path: "/admin/settings",
      icon: Settings,
      description: "System configuration",
    },
  ];

  // Helper functions برای بررسی نقش کاربر
  const isAdmin = () => user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = () => user?.role === "super_admin";

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutConfirm(false);
    setIsMenuOpen(false);
    setIsAdminMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleNavClick = (
    path: string,
    section: string,
    e?: React.MouseEvent
  ) => {
    e?.preventDefault();

    if (path === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    } else if (path.startsWith("#")) {
      scrollToSection(path);
    }

    setIsMenuOpen(false);
  };

  const handleAdminNavClick = (path: string) => {
    setIsMenuOpen(false);
    setIsAdminMenuOpen(false);
  };

  const isActive = (itemSection: string) => {
    if (itemSection === "home") {
      return pathname === "/" && activeSection === "home";
    }
    return activeSection === itemSection;
  };

  const isAdminPage = pathname?.startsWith("/admin");

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isAdminMenuOpen && !target.closest(".admin-menu")) {
        setIsAdminMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAdminMenuOpen]);

  return (
    <>
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
              href="/"
              className="flex items-center space-x-2"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("/", "home", e);
              }}
            >
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/assets/coffee5-BIzYKsk9.png"
                  alt="Brew Haven Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
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
                  onClick={(e) => handleNavClick(item.path, item.section, e)}
                  className={`font-medium transition-colors relative ${
                    isActive(item.section)
                      ? isDark
                        ? "text-amber-400"
                        : "text-amber-600"
                      : isDark
                      ? "text-gray-300 hover:text-amber-400"
                      : "text-gray-700 hover:text-amber-600"
                  }`}
                >
                  {item.name}
                  {isActive(item.section) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400"
                    />
                  )}
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
                  {/* Admin Menu Dropdown */}
                  {isAdmin() && (
                    <div className="relative admin-menu">
                      <button
                        onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                          isAdminPage
                            ? isDark
                              ? "bg-amber-600 text-white"
                              : "bg-amber-600 text-white"
                            : isDark
                            ? "bg-gray-800 text-amber-400 hover:bg-gray-700"
                            : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                        }`}
                      >
                        <Settings size={18} />
                        <span className="text-sm font-medium">Admin</span>
                      </button>

                      {/* Admin Dropdown Menu */}
                      {isAdminMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`absolute right-0 top-full mt-2 w-64 rounded-lg shadow-xl border ${
                            isDark
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="p-2">
                            {/* Admin Info */}
                            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user?.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {user?.role?.replace("_", " ")}
                              </p>
                            </div>

                            {/* Admin Menu Items */}
                            <div className="space-y-1 mt-2">
                              {adminMenuItems.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.path}
                                  onClick={() => handleAdminNavClick(item.path)}
                                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                    isDark
                                      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  }`}
                                >
                                  <item.icon size={16} />
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.description}
                                    </div>
                                  </div>
                                </Link>
                              ))}

                              {/* Super Admin Items */}
                              {isSuperAdmin() && (
                                <>
                                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                                  {superAdminMenuItems.map((item) => (
                                    <Link
                                      key={item.name}
                                      href={item.path}
                                      onClick={() =>
                                        handleAdminNavClick(item.path)
                                      }
                                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                        isDark
                                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                      }`}
                                    >
                                      <item.icon size={16} />
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {item.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          {item.description}
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* User Info */}
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

                  {/* Logout */}
                  <button
                    onClick={handleLogoutClick}
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
                    href="/login"
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDark
                        ? "text-gray-300 hover:text-amber-400"
                        : "text-gray-700 hover:text-amber-600"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
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
                {/* Main Navigation */}
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={(e) => handleNavClick(item.path, item.section, e)}
                    className={`block w-full text-left px-4 py-2 font-medium transition-colors relative ${
                      isActive(item.section)
                        ? isDark
                          ? "text-amber-400 bg-gray-800"
                          : "text-amber-600 bg-amber-100"
                        : isDark
                        ? "text-gray-300 hover:text-amber-400"
                        : "text-gray-700 hover:text-amber-600"
                    }`}
                  >
                    {item.name}
                    {isActive(item.section) && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-amber-400 rounded-r" />
                    )}
                  </button>
                ))}

                {/* Admin Section - Mobile */}
                {isAuthenticated && isAdmin() && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="px-4 mb-2">
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        Admin Panel
                      </p>
                    </div>

                    {/* Admin Menu Items */}
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        onClick={() => handleAdminNavClick(item.path)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <item.icon size={18} />
                        <span>{item.name}</span>
                      </Link>
                    ))}

                    {/* Super Admin Items */}
                    {isSuperAdmin() && (
                      <>
                        {superAdminMenuItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.path}
                            onClick={() => handleAdminNavClick(item.path)}
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Mobile Auth */}
                <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <User size={18} />
                        <span>{user?.name}</span>
                        {user?.role && (
                          <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full capitalize">
                            {user.role.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center space-x-2 text-red-500 w-full"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/login"
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
                        href="/register"
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

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        userName={user?.name}
      />
    </>
  );
};

export default Navbar;
