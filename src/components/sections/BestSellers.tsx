// src/components/sections/BestSellers.tsx - COMPLETELY UPDATED WITH BLUE THEME
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useCart } from "../../contexts/CartContext";
import {
  ShoppingCart,
  TrendingUp,
  Star,
  Award,
  Zap,
  Trophy,
} from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { CoffeeBean } from "../../types";
import { productAdapter } from "../../utils/productAdapter";
import ProtectedAction from "../auth/ProtectedAction";
import { useAuth } from "../../contexts/AuthContext";

const BestSellers: React.FC = () => {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // استفاده از محصولات Featured به عنوان Best Sellers
  const { useFeaturedProducts } = useProducts;
  const { data: featuredData, isLoading, error } = useFeaturedProducts(6);

  // تبدیل داده‌های بکند
  const bestSellers: CoffeeBean[] = React.useMemo(() => {
    if (!featuredData?.products) return [];
    return featuredData.products.map((product: any) =>
      productAdapter.toFrontend(product)
    );
  }, [featuredData]);

  const handleAddToCart = (coffee: CoffeeBean) => {
    addToCart({
      id: coffee.id,
      name: coffee.name,
      price: coffee.price,
      image: coffee.image,
      weight: coffee.weight,
    });
  };

  const getRankingBadge = (index: number) => {
    if (index === 0)
      return {
        bg: "bg-blue-500",
        text: "🥇 #1",
        label: "Top Seller",
        border: "border-blue-400",
      };
    if (index === 1)
      return {
        bg: "bg-blue-400",
        text: "🥈 #2",
        label: "Popular",
        border: "border-blue-300",
      };
    if (index === 2)
      return {
        bg: "bg-blue-600",
        text: "🥉 #3",
        label: "Trending",
        border: "border-blue-500",
      };
    return {
      bg: "bg-blue-500",
      text: `#${index + 1}`,
      label: "Best Seller",
      border: "border-blue-400",
    };
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best Selling Coffee Beans - Brew Haven",
    description:
      "Top-rated and most popular coffee beans chosen by our community of coffee enthusiasts",
    numberOfItems: bestSellers.length,
    itemListElement: bestSellers.map((coffee, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: coffee.name,
        description: coffee.description,
        category: "Coffee Beans",
        offers: {
          "@type": "Offer",
          price: coffee.price.toString(),
          priceCurrency: "USD",
          availability:
            coffee.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: coffee.rating.toString(),
          reviewCount: "50",
        },
      },
    })),
  };

  if (isLoading) {
    return (
      <section
        id="best-sellers"
        className={`py-20 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
            : "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">Loading best sellers...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="best-sellers"
        className={`py-20 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
            : "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div
              className={`p-6 rounded-2xl ${
                isDark ? "bg-blue-900/20" : "bg-blue-100"
              } border ${isDark ? "border-blue-500/30" : "border-blue-200"}`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Failed to load best sellers
              </h3>
              <p className={isDark ? "text-blue-300" : "text-blue-600"}>
                Please try refreshing the page
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        id="best-sellers"
        aria-labelledby="best-sellers-heading"
        className={`py-20 ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
            : "bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.header
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div
                className={`p-3 rounded-full ${
                  isDark ? "bg-blue-500/20" : "bg-blue-500/10"
                }`}
              >
                <Trophy
                  className={`w-8 h-8 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
            </motion.div>
            <h2
              id="best-sellers-heading"
              className={`text-4xl md:text-5xl font-bold font-cursive mb-6 ${
                isDark ? "text-blue-400" : "text-blue-900"
              }`}
            >
              Customer Favorites
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                isDark ? "text-blue-200" : "text-blue-800"
              }`}
            >
              Discover the coffees our community loves most. These highly-rated
              beans are consistently chosen for their exceptional quality and
              flavor profiles.
            </p>
          </motion.header>

          {/* Best Sellers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bestSellers.map((coffee, index) => {
              const ranking = getRankingBadge(index);

              return (
                <motion.article
                  key={coffee.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  className={`relative rounded-2xl overflow-hidden shadow-2xl ${
                    isDark ? "bg-slate-800/90" : "bg-white/95"
                  } border-2 ${ranking.border} transition-all duration-300`}
                >
                  {/* Ranking Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div
                      className={`px-3 py-2 rounded-full text-white font-bold text-sm flex items-center gap-2 ${ranking.bg} shadow-lg`}
                    >
                      <Award size={16} />
                      {ranking.text}
                    </div>
                  </div>

                  {/* Hot Badge for Top 3 */}
                  {index < 3 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Zap size={12} fill="currentColor" />
                        HOT
                      </div>
                    </div>
                  )}

                  {/* Coffee Image */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={coffee.image}
                      alt={`${coffee.name} coffee beans from ${coffee.origin}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        isDark ? "from-slate-900/80" : "from-white/40"
                      }`}
                    />
                  </div>

                  {/* Coffee Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold mb-1 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {coffee.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm ${
                              isDark ? "text-blue-400" : "text-blue-600"
                            } font-semibold`}
                          >
                            {coffee.origin}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span
                            className={`text-sm ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {coffee.roast} Roast
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${
                            isDark ? "text-blue-400" : "text-blue-900"
                          }`}
                        >
                          ${coffee.price}
                        </div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {coffee.weight}g
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.floor(coffee.rating)
                                ? isDark
                                  ? "text-blue-400 fill-blue-400"
                                  : "text-blue-600 fill-blue-600"
                                : isDark
                                ? "text-gray-600"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {coffee.rating} ({Math.floor(Math.random() * 100) + 50}{" "}
                        reviews)
                      </span>
                    </div>

                    {/* Flavor Notes */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {coffee.flavorNotes
                          .slice(0, 3)
                          .map((note, noteIndex) => (
                            <span
                              key={noteIndex}
                              className={`px-2 py-1 rounded-full text-xs ${
                                isDark
                                  ? "bg-blue-900/50 text-blue-300"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {note}
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      className={`text-sm mb-4 leading-relaxed ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {coffee.description.length > 120
                        ? `${coffee.description.substring(0, 120)}...`
                        : coffee.description}
                    </p>

                    {/* Add to Cart */}
                    <ProtectedAction
                      action={() => handleAddToCart(coffee)}
                      message="Please login to add items to your cart"
                      className="w-full"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={coffee.stock === 0}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          coffee.stock === 0
                            ? "bg-gray-400 text-gray-200 cursor-not-allowed transform-none"
                            : index === 0
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 shadow-lg hover:shadow-xl"
                            : isDark
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl"
                        } ${!user ? "opacity-90 hover:opacity-100" : ""}`}
                      >
                        <ShoppingCart size={18} />
                        {coffee.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        {index === 0 && " 🏆"}
                      </motion.button>
                    </ProtectedAction>

                    {/* Stock Info */}
                    {coffee.stock > 0 && coffee.stock < 10 && (
                      <div
                        className={`text-xs text-center mt-2 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        Only {coffee.stock}{" "}
                        {coffee.stock === 1 ? "bag" : "bags"} remaining
                      </div>
                    )}
                  </div>

                  {/* Top Seller Glow Effect */}
                  {index === 0 && (
                    <div className="absolute inset-0 rounded-2xl bg-blue-400/10 pointer-events-none animate-pulse" />
                  )}
                </motion.article>
              );
            })}
          </div>

          {/* Empty State */}
          {bestSellers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div
                className={`text-6xl mb-4 ${
                  isDark ? "text-blue-600/40" : "text-blue-300"
                }`}
              >
                🏆
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-blue-200" : "text-blue-800"
                }`}
              >
                No Best Sellers Available
              </h3>
              <p className={isDark ? "text-blue-100" : "text-blue-700"}>
                Check out our full menu to discover amazing coffees!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.querySelector("#menu");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`mt-4 px-6 py-2 rounded-lg font-semibold ${
                  isDark
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-blue-700 text-white hover:bg-blue-600"
                } transition-colors`}
              >
                Explore Full Menu
              </motion.button>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-center mt-16 p-8 rounded-2xl ${
              isDark ? "bg-blue-900/30" : "bg-blue-100"
            } border ${isDark ? "border-blue-500/30" : "border-blue-200"}`}
          >
            <h3
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-blue-400" : "text-blue-900"
              }`}
            >
              Join Our Coffee Community
            </h3>
            <p className={`mb-4 ${isDark ? "text-blue-200" : "text-blue-700"}`}>
              Experience why coffee lovers consistently choose these community
              favorites
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.querySelector("#menu");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  isDark
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "bg-blue-700 text-white hover:bg-blue-600"
                } transition-colors`}
              >
                Shop All Coffees
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.querySelector("#testimonial");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`px-6 py-3 rounded-lg font-semibold border ${
                  isDark
                    ? "border-blue-400 text-blue-400 hover:bg-blue-400/10"
                    : "border-blue-700 text-blue-700 hover:bg-blue-700/10"
                } transition-colors`}
              >
                Read Reviews
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BestSellers;
  