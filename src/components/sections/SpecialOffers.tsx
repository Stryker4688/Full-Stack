"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Star, Award, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/axios";

interface Offer {
  id: number;
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

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async (): Promise<Offer[]> => {
      const response = await api.get("/offers");
      return response.data;
    },
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Star":
        return Star;
      case "Award":
        return Award;
      case "Zap":
        return Zap;
      default:
        return Star;
    }
  };

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
      price: offer.price.replace("$", "").replace("/month", ""),
      priceCurrency: "USD",
      priceValidUntil: "2024-12-31",
      itemOffered: {
        "@type": "Product",
        name: offer.title,
        sku: offer.sku,
        description: offer.description,
        offers: {
          "@type": "Offer",
          price: offer.price.replace("$", "").replace("/month", ""),
          priceCurrency: "USD",
          availability: `https://schema.org/${offer.availability}`,
        },
      },
    })),
  };

  if (isLoading) {
    return (
      <section className={`py-20 ${isDark ? "bg-gray-900" : "bg-amber-50"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Loading offers...</div>
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
              Limited-time bundles and subscriptions crafted for true coffee
              enthusiasts. Save on premium beans while discovering new flavors.
            </motion.p>
          </header>

          {/* Offers Grid */}
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
                    content={offer.price.replace("$", "").replace("/month", "")}
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
                    <ul className="space-y-2 mb-6" aria-label="Offer features">
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
                      Get This Offer
                    </motion.button>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </motion.article>
              );
            })}
          </div>

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

          {/* SEO Rich Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <div
              className={`prose max-w-none ${
                isDark ? "prose-invert" : ""
              } prose-amber text-center`}
            >
              <h3
                className={`text-2xl font-bold mb-6 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Why Choose Our Coffee Bundles?
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4
                    className={`text-lg font-semibold mb-3 ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    💰 Best Value
                  </h4>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    Save up to 25% compared to buying individual bags. Our
                    bundles offer the perfect balance of quality and
                    affordability.
                  </p>
                </div>
                <div>
                  <h4
                    className={`text-lg font-semibold mb-3 ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    🌍 Global Selection
                  </h4>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    Experience coffees from Ethiopia, Colombia, Kenya, and more.
                    Each bundle is carefully curated to showcase diverse flavor
                    profiles.
                  </p>
                </div>
                <div>
                  <h4
                    className={`text-lg font-semibold mb-3 ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    ⚡ Freshness Guaranteed
                  </h4>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    All beans are roasted to order and shipped within 24 hours.
                    Enjoy peak freshness and flavor with every brew.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SpecialOffers;
