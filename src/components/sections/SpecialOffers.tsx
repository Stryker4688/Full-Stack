// src/components/sections/SpecialOffers.tsx - COMPLETELY FIXED
"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Star, Award, Zap, Coffee } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { CoffeeBean } from "../../types";
import { productAdapter } from "../../utils/productAdapter";

interface Offer {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  badge: string;
  icon: string;
  gradient: string;
  features: string[];
  sku: string;
  availability: string;
}

const SpecialOffers: React.FC = () => {
  const { isDark } = useTheme();

  // استفاده از هوک برای دریافت محصولات ویژه
  const { useFeaturedProducts } = useProducts;
  const { data: featuredData, isLoading, error } = useFeaturedProducts(8);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Star":
        return Star;
      case "Award":
        return Award;
      case "Zap":
        return Zap;
      case "Coffee":
        return Coffee;
      default:
        return Star;
    }
  };

  // تبدیل محصولات به فرمت مورد نیاز برای نمایش
  const transformProductsToOffers = (products: CoffeeBean[]): Offer[] => {
    return products.map((product, index) => {
      const gradients = [
        "from-amber-500 to-orange-500",
        "from-purple-500 to-pink-500",
        "from-green-500 to-emerald-500",
      ];
      const icons = ["Star", "Award", "Zap"];
      const badges = ["Most Popular", "Limited", "New"];

      const gradient = gradients[index % gradients.length];
      const icon = icons[index % icons.length];
      const badge = badges[index % badges.length];

      return {
        id: product.id,
        title: product.name,
        description: product.description,
        price: `$${product.price}`,
        originalPrice: `$${(product.price * 1.2).toFixed(2)}`,
        badge,
        icon,
        gradient,
        features: [
          `${product.weight}g bag`,
          `${product.roast} roast`,
          ...product.flavorNotes.slice(0, 2),
        ],
        sku: `${product.origin
          ?.substring(0, 3)
          .toUpperCase()}-${product.id.substring(0, 4)}`,
        availability: product.stock > 0 ? "InStock" : "OutOfStock",
      };
    });
  };

  const offers = featuredData?.products
    ? transformProductsToOffers(featuredData.products)
    : [];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Special Coffee Offers - Brew Haven",
    description:
      "Exclusive coffee bundles, collections, and subscription offers for coffee enthusiasts",
    numberOfItems: offers.length,
    itemListElement: offers.map((offer, index) => ({
      "@type": "Offer",
      position: index + 1,
      name: offer.title,
      description: offer.description,
      price: offer.price.replace("$", ""),
      priceCurrency: "USD",
      priceValidUntil: "2024-12-31",
      itemOffered: {
        "@type": "Product",
        name: offer.title,
        sku: offer.sku,
        description: offer.description,
        offers: {
          "@type": "Offer",
          price: offer.price.replace("$", ""),
          priceCurrency: "USD",
          availability: `https://schema.org/${offer.availability}`,
        },
      },
    })),
  };

  if (isLoading) {
    return (
      <section
        id="offer"
        className={`py-20 ${isDark ? "bg-gray-900" : "bg-amber-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-amber-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-amber-200 rounded w-64 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="h-6 bg-amber-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-amber-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-amber-200 rounded w-5/6 mb-4"></div>
                    <div className="h-10 bg-amber-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="offer"
        className={`py-20 ${isDark ? "bg-gray-900" : "bg-amber-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div
              className={`p-6 rounded-2xl ${
                isDark ? "bg-red-900/20" : "bg-red-100"
              } border ${isDark ? "border-red-500/30" : "border-red-200"}`}
            >
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                Failed to load offers
              </h3>
              <p className={isDark ? "text-red-300" : "text-red-600"}>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        id="offer"
        aria-labelledby="special-offers-heading"
        className={`py-20 ${
          isDark
            ? "bg-gradient-to-br from-gray-900 via-amber-900 to-gray-800"
            : "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <header className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div
                className={`p-3 rounded-full ${
                  isDark ? "bg-amber-500/20" : "bg-amber-500/10"
                }`}
              >
                <Award
                  className={`w-8 h-8 ${
                    isDark ? "text-amber-400" : "text-amber-600"
                  }`}
                />
              </div>
            </motion.div>
            <motion.h2
              id="special-offers-heading"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`text-4xl md:text-5xl font-bold font-cursive mb-4 ${
                isDark ? "text-amber-400" : "text-amber-900"
              }`}
            >
              Exclusive Coffee Offers
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-xl max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {offers.length > 0
                ? "Limited-time bundles and subscriptions crafted for true coffee enthusiasts. Save on premium beans while discovering new flavors."
                : "Check back soon for new exclusive offers!"}
            </motion.p>
          </header>

          {/* Offers Grid */}
          {offers.length > 0 ? (
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              role="list"
              aria-label="Special coffee offers"
            >
              {offers.map((offer, index) => {
                const IconComponent = getIconComponent(offer.icon);
                return (
                  <motion.article
                    key={offer.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{
                      scale: 1.05,
                      y: -10,
                      transition: { duration: 0.3 },
                    }}
                    role="listitem"
                    itemScope
                    itemType="https://schema.org/Offer"
                    className={`relative rounded-2xl overflow-hidden shadow-2xl ${
                      isDark ? "bg-gray-800/80" : "bg-white/90"
                    } backdrop-blur-sm border ${
                      isDark ? "border-amber-500/30" : "border-amber-200"
                    } group`}
                  >
                    <meta
                      itemProp="price"
                      content={offer.price.replace("$", "")}
                    />
                    <meta itemProp="priceCurrency" content="USD" />
                    <meta
                      itemProp="availability"
                      content={`https://schema.org/${offer.availability}`}
                    />

                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          offer.gradient.includes("amber")
                            ? "bg-amber-500 text-white"
                            : offer.gradient.includes("purple")
                            ? "bg-purple-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {offer.badge}
                      </span>
                    </div>

                    {/* Header with Gradient */}
                    <div
                      className={`bg-gradient-to-r ${offer.gradient} p-6 text-white`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="w-8 h-8" />
                        <h3
                          className="text-2xl font-bold font-cursive"
                          itemProp="name"
                        >
                          {offer.title}
                        </h3>
                      </div>
                      <p className="text-amber-100" itemProp="description">
                        {offer.description}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span
                          className={`text-3xl font-bold ${
                            isDark ? "text-amber-400" : "text-amber-900"
                          }`}
                          itemProp="price"
                        >
                          {offer.price}
                        </span>
                        <span
                          className={`text-lg line-through ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {offer.originalPrice}
                        </span>
                      </div>

                      {/* Features */}
                      <ul
                        className="space-y-2 mb-6"
                        aria-label="Offer features"
                      >
                        {offer.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isDark ? "bg-amber-400" : "bg-amber-600"
                              }`}
                            />
                            <span
                              className={
                                isDark ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-3 rounded-lg font-bold text-lg ${
                          offer.gradient.includes("amber")
                            ? "bg-amber-600 hover:bg-amber-500"
                            : offer.gradient.includes("purple")
                            ? "bg-purple-600 hover:bg-purple-500"
                            : "bg-green-600 hover:bg-green-500"
                        } text-white transition-colors`}
                        aria-label={`Get the ${offer.title} offer`}
                      >
                        Add to Cart
                      </motion.button>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </motion.article>
                );
              })}
            </div>
          ) : (
            // Empty State
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div
                className={`text-6xl mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-300"
                }`}
              >
                ☕
              </div>
              <h3
                className={`text-2xl font-semibold mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                No Featured Products Available
              </h3>
              <p
                className={`text-lg mb-8 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Check back later for new exclusive offers and featured products.
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
                className={`px-6 py-3 rounded-lg font-semibold ${
                  isDark
                    ? "bg-amber-600 text-white hover:bg-amber-500"
                    : "bg-amber-900 text-white hover:bg-amber-800"
                } transition-colors`}
              >
                Browse All Products
              </motion.button>
            </motion.div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-center mt-12 p-8 rounded-2xl ${
              isDark ? "bg-amber-900/30" : "bg-amber-100"
            } border ${isDark ? "border-amber-500/30" : "border-amber-200"}`}
          >
            <h3
              className={`text-2xl font-bold mb-2 ${
                isDark ? "text-amber-400" : "text-amber-900"
              }`}
            >
              Need Help Choosing?
            </h3>
            <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Our coffee experts will help you find the perfect match based on
              your taste preferences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  isDark
                    ? "bg-amber-600 text-white hover:bg-amber-500"
                    : "bg-amber-900 text-white hover:bg-amber-800"
                } transition-colors`}
              >
                Chat with Expert
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const element = document.querySelector("#menu");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`px-6 py-3 rounded-lg font-semibold border ${
                  isDark
                    ? "border-amber-400 text-amber-400 hover:bg-amber-400/10"
                    : "border-amber-900 text-amber-900 hover:bg-amber-900/10"
                } transition-colors`}
              >
                View All Products
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SpecialOffers;
