// components/Contact.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import ProtectedAction from "./../auth/ProtectedAction";
import { useAuth } from "../../contexts/AuthContext";

const Contact: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitAction = () => {
    // بدون پارامتر event
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div
      id="contact"
      className={`min-h-screen flex items-center justify-center py-20 ${
        isDark ? "contact-bg-dark" : "contact-bg-light"
      }`}
    >
      <div className="bg-content w-full max-w-6xl mx-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className={`rounded-2xl shadow-2xl overflow-hidden ${
            isDark ? "bg-gray-800/95" : "bg-white/95"
          }`}
        >
          <div className="md:flex">
            {/* Contact Info Section */}
            <div
              className={`md:w-2/5 p-8 md:p-12 ${
                isDark ? "bg-amber-900/20" : "bg-amber-50"
              }`}
            >
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`text-3xl font-cursive mb-8 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Get In Touch
              </motion.h2>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="flex items-start space-x-4"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDark ? "bg-amber-900/40" : "bg-amber-100"
                    }`}
                  >
                    <span
                      className={`text-lg ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      📍
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      Address
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      123 Coffee Street
                      <br />
                      Brew City, BC 12345
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="flex items-start space-x-4"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDark ? "bg-amber-900/40" : "bg-amber-100"
                    }`}
                  >
                    <span
                      className={`text-lg ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      📞
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      Phone
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      +1 (123) 456-7890
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="flex items-start space-x-4"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDark ? "bg-amber-900/40" : "bg-amber-100"
                    }`}
                  >
                    <span
                      className={`text-lg ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      ✉️
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      Email
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      info@brewhaven.com
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 1.0 }}
                  className="flex items-start space-x-4"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDark ? "bg-amber-900/40" : "bg-amber-100"
                    }`}
                  >
                    <span
                      className={`text-lg ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      🕒
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      Hours
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      Mon-Sun: 6AM - 10PM
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="md:w-3/5 p-8 md:p-12">
              <motion.h2
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`text-3xl font-cursive text-center mb-8 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Send Us a Message
              </motion.h2>

              <form className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-400 focus:border-amber-400"
                        : "border-amber-200 placeholder-gray-500 focus:ring-amber-900 focus:border-amber-900"
                    }`}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-400 focus:border-amber-400"
                        : "border-amber-200 placeholder-gray-500 focus:ring-amber-900 focus:border-amber-900"
                    }`}
                    required
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your coffee experience or ask us anything..."
                    rows={6}
                    className={`w-full py-3 px-4 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-400 focus:border-amber-400"
                        : "border-amber-200 placeholder-gray-500 focus:ring-amber-900 focus:border-amber-900"
                    }`}
                    required
                  ></textarea>
                </motion.div>

                <ProtectedAction
                  action={handleSubmitAction}
                  message="Please login to send us a message"
                >
                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    type="button"
                    className={`w-full py-4 px-6 font-bold rounded-lg shadow-lg transition-all duration-300 text-lg ${
                      isDark
                        ? "bg-amber-600 text-white hover:bg-amber-500"
                        : "bg-amber-900 text-white hover:bg-amber-800"
                    }`}
                  >
                    Send Message
                  </motion.button>
                </ProtectedAction>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
