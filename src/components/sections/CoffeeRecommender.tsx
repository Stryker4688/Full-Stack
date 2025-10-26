"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Coffee, ArrowRight } from "lucide-react";

const CoffeeRecommender: React.FC = () => {
  const { isDark } = useTheme();
  const [userPreferences, setUserPreferences] = useState({
    taste: "",
    strength: "",
    occasion: "",
  });

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Find Your Perfect Coffee Match - Brew Haven Coffee Quiz",
    description:
      "Take our interactive coffee taste quiz to discover the best coffee beans for your flavor preferences and brewing style",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    supply: ["Coffee taste preferences", "Brewing method information"],
    tool: ["Interactive quiz", "AI recommendation engine"],
    step: [
      {
        "@type": "HowToStep",
        name: "Choose your preferred taste profile",
        text: "Select from fruity & bright, chocolate & nutty, or earthy & spicy flavor profiles to start your coffee discovery journey",
        image: "https://brewhaven.com/images/coffee-taste-quiz.jpg",
      },
      {
        "@type": "HowToStep",
        name: "Get personalized recommendations",
        text: "Receive AI-powered coffee recommendations based on your taste preferences, brewing methods, and experience level",
        image: "https://brewhaven.com/images/coffee-recommendations.jpg",
      },
      {
        "@type": "HowToStep",
        name: "Explore matched coffees",
        text: "Browse through perfectly matched coffee beans with detailed flavor notes, brewing guides, and origin stories",
      },
    ],
    totalTime: "PT2M",
  };

  const tasteProfiles = [
    {
      value: "fruity-bright",
      label: "Fruity & Bright",
      description: "Light roasts with citrus, berry, and floral notes",
      keywords: [
        "fruity coffee",
        "bright acidity",
        "light roast",
        "citrus notes",
        "floral aroma",
        "Ethiopian coffee",
        "pour over",
      ],
      icon: "🍋",
      bestFor: "Pour Over, Aeropress, Cold Brew",
    },
    {
      value: "chocolate-nutty",
      label: "Chocolate & Nutty",
      description: "Medium roasts with chocolate, caramel, and nut flavors",
      keywords: [
        "chocolate coffee",
        "nutty flavor",
        "medium roast",
        "caramel notes",
        "balanced coffee",
        "Colombian coffee",
        "espresso",
      ],
      icon: "🍫",
      bestFor: "Espresso, Drip, French Press",
    },
    {
      value: "earthy-spicy",
      label: "Earthy & Spicy",
      description: "Dark roasts with earthy, spicy, and bold flavors",
      keywords: [
        "earthy coffee",
        "spicy notes",
        "dark roast",
        "bold flavor",
        "full body coffee",
        "Sumatran coffee",
        "French press",
      ],
      icon: "🌰",
      bestFor: "French Press, Moka Pot, Cold Brew",
    },
  ];

  const recommendations = [
    {
      id: 1,
      name: "Ethiopian Yirgacheffe",
      description:
        "Bright and floral with citrus notes - perfect for morning energy and clarity",
      match: 95,
      roast: "Light Roast",
      origin: "Ethiopia",
      flavorNotes: ["Bergamot", "Jasmine", "Lemon Zest", "Tea-like"],
      brewMethods: ["Pour Over", "Aeropress", "Cold Brew"],
      process: "Washed",
      elevation: "2000m",
      score: "92+",
      price: "$24.99",
      weight: "250g",
      featured: true,
      schemaType: "Product",
    },
    {
      id: 2,
      name: "Colombian Supremo",
      description:
        "Smooth and balanced with chocolate notes - great for all-day drinking and espresso",
      match: 88,
      roast: "Medium Roast",
      origin: "Colombia",
      flavorNotes: ["Milk Chocolate", "Caramel", "Hazelnut", "Brown Sugar"],
      brewMethods: ["Espresso", "Drip", "French Press"],
      process: "Washed",
      elevation: "1600m",
      score: "87+",
      price: "$19.99",
      weight: "250g",
      featured: false,
      schemaType: "Product",
    },
    {
      id: 3,
      name: "Sumatra Mandheling",
      description:
        "Bold and earthy with spicy undertones - ideal for after dinner or strong brew lovers",
      match: 82,
      roast: "Dark Roast",
      origin: "Indonesia",
      flavorNotes: ["Earthy", "Cedar", "Dark Chocolate", "Spicy"],
      brewMethods: ["French Press", "Moka Pot", "Espresso"],
      process: "Natural",
      elevation: "1400m",
      score: "85+",
      price: "$22.99",
      weight: "250g",
      featured: false,
      schemaType: "Product",
    },
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        aria-labelledby="coffee-recommender-heading"
        className={`py-16 ${isDark ? "bg-gray-900" : "bg-amber-50"}`}
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* Header Section */}
          <header className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div
                className={`p-3 rounded-full ${
                  isDark ? "bg-amber-500/20" : "bg-amber-500/10"
                }`}
              >
                <Coffee
                  className={`w-8 h-8 ${
                    isDark ? "text-amber-400" : "text-amber-600"
                  }`}
                />
              </div>
            </motion.div>
            <motion.h2
              id="coffee-recommender-heading"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`text-3xl md:text-4xl font-bold font-cursive mb-4 ${
                isDark ? "text-amber-400" : "text-amber-900"
              }`}
            >
              Discover Your Perfect Coffee Match
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-lg md:text-xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-3xl mx-auto`}
            >
              Take our 2-minute taste quiz and get personalized coffee
              recommendations tailored to your unique flavor preferences and
              brewing style
            </motion.p>
          </header>

          {/* Main Quiz Container */}
          <article
            className={`rounded-2xl p-6 md:p-8 ${
              isDark ? "bg-gray-800" : "bg-white"
            } shadow-xl mb-12`}
          >
            {/* Taste Preferences Section */}
            <section
              aria-labelledby="taste-preferences-heading"
              className="mb-12"
            >
              <header className="text-center mb-8">
                <h3
                  id="taste-preferences-heading"
                  className={`text-2xl font-semibold mb-3 ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  What flavors do you enjoy?
                </h3>
                <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Select your preferred taste profile to get started
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tasteProfiles.map((profile) => (
                  <motion.button
                    key={profile.value}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    aria-pressed={userPreferences.taste === profile.value}
                    className={`p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                      userPreferences.taste === profile.value
                        ? "border-amber-500 bg-amber-500/10 shadow-lg"
                        : isDark
                        ? "border-gray-600 hover:border-amber-500 bg-gray-700/50"
                        : "border-gray-200 hover:border-amber-500 bg-white"
                    } group`}
                    onClick={() =>
                      setUserPreferences((prev) => ({
                        ...prev,
                        taste: profile.value,
                      }))
                    }
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{profile.icon}</span>
                      <div className="flex-1">
                        <h4
                          className={`font-bold text-lg mb-2 ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {profile.label}
                        </h4>
                        <p
                          className={`text-sm mb-3 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {profile.description}
                        </p>
                        <div className="space-y-2">
                          <div
                            className={`text-xs ${
                              isDark ? "text-amber-400" : "text-amber-600"
                            } font-semibold`}
                          >
                            Best for: {profile.bestFor}
                          </div>
                          <div
                            className={`text-xs ${
                              isDark ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            Keywords: {profile.keywords.join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* AI Recommendations Section */}
            <AnimatePresence>
              {userPreferences.taste && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  aria-labelledby="recommendations-heading"
                  className="border-t pt-8"
                >
                  <header className="text-center mb-8">
                    <h3
                      id="recommendations-heading"
                      className={`text-2xl font-semibold mb-3 ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      🎉 Perfect Matches for You!
                    </h3>
                    <p
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Based on your preference for{" "}
                      <strong>
                        {tasteProfiles
                          .find((p) => p.value === userPreferences.taste)
                          ?.label.toLowerCase()}
                      </strong>{" "}
                      flavors
                    </p>
                  </header>

                  <div className="space-y-6">
                    {recommendations.map((rec, index) => (
                      <motion.article
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        itemScope
                        itemType="https://schema.org/Product"
                        className={`p-6 rounded-xl border-2 ${
                          isDark
                            ? "border-amber-500/30 bg-amber-500/5"
                            : "border-amber-200 bg-amber-50"
                        } ${rec.featured ? "ring-2 ring-amber-500" : ""}`}
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Coffee Information */}
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                              <div>
                                <h4
                                  itemProp="name"
                                  className={`font-bold text-xl mb-2 ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {rec.name}
                                  {rec.featured && (
                                    <span className="ml-3 bg-amber-500 text-white text-sm px-2 py-1 rounded-full">
                                      Top Pick
                                    </span>
                                  )}
                                </h4>
                                <p
                                  itemProp="description"
                                  className={`text-sm mb-3 ${
                                    isDark ? "text-gray-300" : "text-gray-600"
                                  }`}
                                >
                                  {rec.description}
                                </p>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-2xl font-bold mb-1 ${
                                    isDark ? "text-amber-400" : "text-amber-600"
                                  }`}
                                >
                                  {rec.match}% Match
                                </div>
                                <div
                                  className={`text-lg font-semibold ${
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }`}
                                >
                                  {rec.price}{" "}
                                  <span className="text-sm">/{rec.weight}</span>
                                </div>
                              </div>
                            </div>

                            {/* Coffee Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                              <div>
                                <strong
                                  className={
                                    isDark ? "text-amber-400" : "text-amber-600"
                                  }
                                >
                                  Roast Level:
                                </strong>
                                <div
                                  className={
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }
                                >
                                  {rec.roast}
                                </div>
                              </div>
                              <div>
                                <strong
                                  className={
                                    isDark ? "text-amber-400" : "text-amber-600"
                                  }
                                >
                                  Origin:
                                </strong>
                                <div
                                  className={
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }
                                  itemProp="countryOfOrigin"
                                >
                                  {rec.origin}
                                </div>
                              </div>
                              <div>
                                <strong
                                  className={
                                    isDark ? "text-amber-400" : "text-amber-600"
                                  }
                                >
                                  Process:
                                </strong>
                                <div
                                  className={
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }
                                >
                                  {rec.process}
                                </div>
                              </div>
                              <div>
                                <strong
                                  className={
                                    isDark ? "text-amber-400" : "text-amber-600"
                                  }
                                >
                                  Elevation:
                                </strong>
                                <div
                                  className={
                                    isDark ? "text-gray-300" : "text-gray-700"
                                  }
                                >
                                  {rec.elevation}
                                </div>
                              </div>
                            </div>

                            {/* Flavor Notes */}
                            <div className="mb-4">
                              <strong
                                className={`text-sm ${
                                  isDark ? "text-amber-400" : "text-amber-600"
                                } mb-2 block`}
                              >
                                Flavor Profile:
                              </strong>
                              <div className="flex flex-wrap gap-2">
                                {rec.flavorNotes.map((note, noteIndex) => (
                                  <span
                                    key={noteIndex}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                      isDark
                                        ? "bg-amber-900/50 text-amber-300"
                                        : "bg-amber-100 text-amber-800"
                                    }`}
                                  >
                                    {note}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Brew Methods */}
                            <div>
                              <strong
                                className={`text-sm ${
                                  isDark ? "text-amber-400" : "text-amber-600"
                                } mb-2 block`}
                              >
                                Recommended Brew Methods:
                              </strong>
                              <div className="flex flex-wrap gap-2">
                                {rec.brewMethods.map((method) => (
                                  <span
                                    key={method}
                                    className={`px-2 py-1 rounded text-xs ${
                                      isDark
                                        ? "bg-gray-700 text-gray-300"
                                        : "bg-gray-200 text-gray-700"
                                    }`}
                                  >
                                    {method}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Section */}
                          <div className="lg:w-48 flex flex-col gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                                isDark
                                  ? "bg-amber-600 text-white hover:bg-amber-500"
                                  : "bg-amber-900 text-white hover:bg-amber-800"
                              } transition-colors`}
                            >
                              Add to Cart
                              <ArrowRight size={16} />
                            </motion.button>
                            <button
                              className={`w-full py-2 rounded-lg font-medium border ${
                                isDark
                                  ? "border-amber-400 text-amber-400 hover:bg-amber-400/10"
                                  : "border-amber-600 text-amber-600 hover:bg-amber-600/10"
                              } transition-colors`}
                            >
                              View Details
                            </button>
                            <div
                              className={`text-xs text-center ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Quality Score: {rec.score}
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>

                  {/* Results CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8 pt-6 border-t"
                  >
                    <p
                      className={`mb-4 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Ready to explore more amazing coffee options?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.a
                        href="#menu"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
                          isDark
                            ? "bg-amber-600 text-white hover:bg-amber-500"
                            : "bg-amber-900 text-white hover:bg-amber-800"
                        } transition-colors`}
                      >
                        <Coffee size={20} />
                        Browse Full Collection
                      </motion.a>
                      <button
                        className={`px-6 py-3 rounded-lg font-semibold border ${
                          isDark
                            ? "border-amber-400 text-amber-400 hover:bg-amber-400/10"
                            : "border-amber-600 text-amber-600 hover:bg-amber-600/10"
                        } transition-colors`}
                      >
                        Save My Preferences
                      </button>
                    </div>
                  </motion.div>
                </motion.section>
              )}
            </AnimatePresence>
          </article>

          {/* SEO Rich Content Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <div
              className={`prose max-w-none ${
                isDark ? "prose-invert" : ""
              } prose-amber`}
            >
              <h2
                className={`text-3xl font-bold text-center mb-8 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Why Personalized Coffee Recommendations Matter
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    Perfect Flavor Matching
                  </h3>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    Coffee beans from different regions offer unique flavor
                    profiles. Our AI-powered matching system ensures you
                    discover coffees that align with your specific taste
                    preferences, whether you enjoy bright citrus notes or rich
                    chocolate undertones.
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    Optimal Brewing Experience
                  </h3>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    Different coffee beans perform best with specific brewing
                    methods. Our recommendations consider your equipment and
                    brewing style to suggest coffees that will deliver the best
                    possible cup every time.
                  </p>
                </div>
                <div>
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    Discover New Favorites
                  </h3>
                  <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                    Break out of your coffee routine and explore new origins and
                    processing methods. Our personalized suggestions introduce
                    you to coffees you might not have discovered on your own,
                    expanding your coffee horizons.
                  </p>
                </div>
              </div>

              <div
                className={`mt-8 p-6 rounded-xl ${
                  isDark ? "bg-gray-800" : "bg-amber-100"
                }`}
              >
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  How Our Coffee Matching Works
                </h3>
                <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Our recommendation engine analyzes thousands of data points
                  including bean origin, roast profile, processing method,
                  altitude, and cupping scores. Combined with your taste
                  preferences, we match you with coffees that have similar
                  characteristics to blends you've enjoyed in the past while
                  introducing new exciting options.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </section>
    </>
  );
};

export default CoffeeRecommender;
