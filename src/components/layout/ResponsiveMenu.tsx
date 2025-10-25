// components/ResponsiveMenu.tsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";

interface ResponsiveMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ({ open, setOpen }) => {
  const { user, logout } = useAuth();

  return (
    <div
      className={`${
        open ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-40 flex h-screen w-[85%] flex-col justify-between bg-amber-950 px-8 pb-8 pt-20 text-black md:hidden rounded-r-2xl shadow-2xl transition-all duration-300 border-r border-amber-700`}
    >
      <div className="flex-1">
        {/* User Info */}
        {user && (
          <div className="mb-6 p-4 bg-amber-800 rounded-lg text-white">
            <div className="font-semibold">Hello, {user.name}</div>
            <div className="text-sm text-amber-200">{user.email}</div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-8">
          <ul className="flex flex-col gap-6 text-xl font-semibold text-white">
            <a href="/">
              <li
                onClick={() => setOpen(false)}
                className="cursor-pointer hover:text-amber-300 transition-colors py-3 border-b border-amber-700"
              >
                Home
              </li>
            </a>
            <a href="#menu">
              <li
                onClick={() => setOpen(false)}
                className="cursor-pointer hover:text-amber-300 transition-colors py-3 border-b border-amber-700"
              >
                Menu
              </li>
            </a>
            <a href="#about">
              <li
                onClick={() => setOpen(false)}
                className="cursor-pointer hover:text-amber-300 transition-colors py-3 border-b border-amber-700"
              >
                About
              </li>
            </a>
            <a href="#testimonial">
              <li
                onClick={() => setOpen(false)}
                className="cursor-pointer hover:text-amber-300 transition-colors py-3 border-b border-amber-700"
              >
                Testimonials
              </li>
            </a>
            <a href="#contact">
              <li
                onClick={() => setOpen(false)}
                className="cursor-pointer hover:text-amber-300 transition-colors py-3 border-b border-amber-700"
              >
                Contact
              </li>
            </a>
          </ul>
        </nav>

        {/* Auth Buttons for Mobile */}
        {!user ? (
          <div className="mt-8 flex flex-col gap-4">
            <a href="/login">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-lg font-semibold border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-900 transition-all duration-300 text-center"
              >
                Login
              </button>
            </a>
            <a href="/register">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 text-center shadow-lg"
              >
                Sign Up Free
              </button>
            </a>
          </div>
        ) : (
          <div className="mt-8">
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 text-center"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-amber-300 pt-6 border-t border-amber-700">
        <p className="text-sm">Made with ❤️ and ☕ by Rohit</p>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
