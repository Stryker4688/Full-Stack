// src/components/layout/Footer.tsx
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useActiveSection } from "../../contexts/ActiveSectionContext";

interface FooterLink {
  title: string;
  link: string;
  section: string;
}

const FooterLinks: FooterLink[] = [
  {
    title: "Home",
    link: "/",
    section: "home",
  },
  {
    title: "Offer",
    link: "#offer",
    section: "offer",
  },
  {
    title: "Menu",
    link: "#menu",
    section: "menu",
  },
  {
    title: "About",
    link: "#about",
    section: "about",
  },
  {
    title: "Testimonials",
    link: "#testimonial",
    section: "testimonial",
  },
  {
    title: "Contact",
    link: "#contact",
    section: "contact",
  },
];

const socialLinks = [
  { icon: FaInstagram, url: "#", color: "hover:text-pink-400" },
  { icon: FaFacebook, url: "#", color: "hover:text-blue-400" },
  { icon: FaLinkedin, url: "#", color: "hover:text-blue-600" },
  { icon: FaTwitter, url: "#", color: "hover:text-blue-400" },
];

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const { activeSection, scrollToSection } = useActiveSection();

  const handleFooterClick = (
    link: string,
    section: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    if (link === "/") {
      // Handle Home click
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
    } else if (link.startsWith("#")) {
      // Handle section scroll using context
      scrollToSection(link);
    }
  };

  const isActive = (section: string) => {
    return activeSection === section;
  };

  return (
    <div
      className={`relative min-h-96 ${
        isDark ? "footer-bg-dark" : "footer-bg-light"
      }`}
    >
      <div className="bg-content">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <h2 className="font-cursive text-3xl text-amber-400 mb-4">
                  Brew Haven
                </h2>
                <p className="text-gray-200 leading-relaxed mb-6">
                  Crafting exceptional coffee experiences since 2010. Join us in
                  celebrating the art of perfect brewing and creating
                  unforgettable moments.
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center transition-colors duration-300 ${social.color} text-amber-300`}
                    >
                      <social.icon className="text-lg" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-amber-400 mb-6">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  {FooterLinks.map((data, index) => (
                    <li key={index}>
                      <a
                        href={data.link}
                        onClick={(e) =>
                          handleFooterClick(data.link, data.section, e)
                        }
                        className={`text-gray-300 hover:text-amber-300 transition-colors duration-300 flex items-center group cursor-pointer relative ${
                          isActive(data.section)
                            ? "text-amber-400 font-semibold"
                            : ""
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300 ${
                            isActive(data.section)
                              ? "bg-amber-400 scale-125"
                              : "bg-amber-400"
                          }`}
                        ></span>
                        {data.title}
                        {isActive(data.section) && (
                          <motion.div
                            layoutId="footerActive"
                            className="absolute left-0 w-full h-px bg-amber-400 bottom-0"
                          />
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Contact Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7 }}
              >
                <h3 className="text-xl font-semibold text-amber-400 mb-6">
                  Contact Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-amber-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">
                      123 Coffee Street, Brew City
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-amber-400 flex-shrink-0" />
                    <span className="text-gray-300">+1 (123) 456-7890</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-amber-400 flex-shrink-0" />
                    <span className="text-gray-300">info@brewhaven.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaClock className="text-amber-400 flex-shrink-0" />
                    <span className="text-gray-300">Mon-Sun: 6AM - 10PM</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Newsletter */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                <h3 className="text-xl font-semibold text-amber-400 mb-6">
                  Newsletter
                </h3>
                <p className="text-gray-300 mb-4">
                  Subscribe for updates and special offers
                </p>
                <div className="flex flex-col space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 rounded-lg bg-amber-900/20 border border-amber-700 text-white placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-3 px-6 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-500 transition-colors duration-300"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-amber-800/50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-col md:flex-row justify-between items-center text-center"
            >
              <p className="text-amber-300/80 text-sm mb-4 md:mb-0">
                © 2024 Brew Haven. All rights reserved. | Crafted with ❤️ and ☕
              </p>
              <div className="flex space-x-6 text-sm text-amber-300/80">
                <a href="#" className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-amber-300 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-amber-300 transition-colors">
                  Cookie Policy
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
