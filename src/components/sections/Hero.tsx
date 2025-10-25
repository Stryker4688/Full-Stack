import React from "react";
import coffee from "../../assets/coffee5.png";
import Bean1 from "../../assets/bean1.png";
import Bean2 from "../../assets/bean2.png";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";

const Hero: React.FC = () => {
  const { isDark } = useTheme();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CoffeeShop",
    name: "Brew Haven",
    description:
      "Premium specialty coffee beans and artisanal coffee shop serving the finest single-origin coffees from around the world",
    servesCuisine:
      "Specialty Coffee, Single-Origin Beans, Coffee Subscriptions",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brew City",
      addressRegion: "BC",
      postalCode: "12345",
      streetAddress: "123 Coffee Street",
    },
    telephone: "+1-123-456-7890",
    openingHours: "Mo-Su 06:00-22:00",
    priceRange: "$$",
    url: "https://brewhaven.com",
    sameAs: [
      "https://www.facebook.com/brewhaven",
      "https://www.instagram.com/brewhaven",
    ],
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <section
        aria-labelledby="hero-heading"
        className={`mt-14 relative overflow-hidden ${
          isDark
            ? "bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800"
            : "bg-gradient-to-r from-slate-100 to-amber-950"
        }`}
      >
        {/* Background Pattern for Dark Mode */}
        {isDark && (
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: "50px 50px",
              }}
            ></div>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 place-items-center h-[700px] md:h-[650px] relative pt-10 md:pt-0 z-10">
          {/* text section */}
          <div className="space-y-5 px-4 md:px-0">
            <motion.h3
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`font-semibold font-cursive text-lg ${
                isDark ? "text-amber-400" : "text-amber-900"
              }`}
            >
              Welcome to Brew Haven___
            </motion.h3>
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className={`text-4xl md:text-6xl font-bold font-cursive2 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Experience Artisanal{" "}
              <span className={isDark ? "text-amber-400" : "text-amber-900"}>
                Coffee
              </span>{" "}
              at Brew Haven
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
              className={isDark ? "text-gray-300" : "text-gray-700"}
            >
              Discover premium single-origin coffee beans, expertly roasted and
              delivered fresh. Join thousands of coffee lovers who trust Brew
              Haven for their daily brew.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.8 }}
              className="flex gap-2"
            >
              <a href="#menu">
                <button
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isDark
                      ? "bg-amber-600 text-white hover:bg-amber-500"
                      : "bg-amber-900 text-white hover:bg-amber-800"
                  }`}
                >
                  Shop Coffee Beans
                </button>
              </a>
              <a href="#about">
                <button
                  className={`border rounded-md px-3 py-2 transition-colors ${
                    isDark
                      ? "border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-gray-900"
                      : "border-amber-900 text-amber-900 hover:bg-amber-900 hover:text-white"
                  }`}
                >
                  Our Story
                </button>
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <div className="text-center">
                <div
                  className={`text-xl font-bold ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  1000+
                </div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-xl font-bold ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  50+
                </div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Coffee Varieties
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-xl font-bold ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  24/7
                </div>
                <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Support
                </div>
              </div>
            </motion.div>
          </div>

          {/* image section */}
          <div className="relative">
            <motion.img
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              src={coffee}
              alt="Premium specialty coffee beans from Brew Haven - fresh roasted coffee ready for brewing"
              className="w-[500px] relative z-10"
            />
            {/* Coffee Steam Effect for Dark Mode */}
            {isDark && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32">
                <div className="absolute w-4 h-16 bg-white/20 rounded-full top-4 left-1/2 transform -translate-x-1/2 animate-steam"></div>
                <div className="absolute w-3 h-12 bg-white/15 rounded-full top-2 left-1/3 transform -translate-x-1/2 animate-steam animation-delay-1000"></div>
                <div className="absolute w-3 h-14 bg-white/15 rounded-full top-3 right-1/3 transform translate-x-1/2 animate-steam animation-delay-500"></div>
              </div>
            )}
          </div>

          {/* Bean decorations */}
          <motion.img
            initial={{ opacity: 0, x: 400, scale: 0.7 }}
            whileInView={{ opacity: 1, x: 0, scale: 1, rotate: 45 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            src={Bean2}
            alt="Coffee bean decoration"
            className="absolute hidden md:block bottom-20 left-36 z-10 w-20 rotate-45"
          />
          <motion.img
            initial={{ opacity: 0, x: 600, y: 200, scale: 0.7 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            src={Bean1}
            alt="Coffee bean decoration"
            className="absolute hidden md:block top-14 left-0 z-10 w-20"
          />
          <motion.img
            initial={{ opacity: 0, x: -100, y: 100, scale: 0.7 }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 45 }}
            transition={{ duration: 1.8, delay: 0.8 }}
            src={Bean2}
            alt="Coffee bean decoration"
            className="absolute hidden md:block w-20 top-0 right-0 z-10 -rotate-45"
          />
        </div>
      </section>
    </>
  );
};

export default Hero;
