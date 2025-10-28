// src/components/sections/LiveStock.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { CoffeeBean } from "../../types";
import { ShoppingCart, Clock, TrendingUp, Zap, Star } from "lucide-react";

// Mock data - در واقعیت از API می‌آید
const mockCoffeeBeans: CoffeeBean[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    roast: "light",
    price: 24.99,
    weight: 250,
    description: "Bright and floral with citrus notes",
    flavorNotes: ["Bergamot", "Jasmine", "Lemon"],
    acidity: "high",
    body: "light",
    processing: "washed",
    elevation: 2000,
    image: "/assets/coffee1.jpg",
    rating: 4.8,
    stock: 15,
    featured: true,
    score: 92,
    brewMethods: ["Pour Over", "Aeropress"],
    harvest: "2024",
    varietal: "Heirloom",
  },
  // ... سایر آیتم‌ها
];

const LiveStock: React.FC = () => {
  const { isDark } = useTheme();
  const [coffeeBeans, setCoffeeBeans] = useState<CoffeeBean[]>([]);
  const [stockTimers, setStockTimers] = useState<{ [key: number]: number }>({});

  // شبیه‌سازی دریافت داده از API
  useEffect(() => {
    const fetchCoffeeBeans = async () => {
      // در واقعیت اینجا API call خواهد بود
      setTimeout(() => {
        const beansWithTimers = mockCoffeeBeans.map((bean) => ({
          ...bean,
          stockTimer: Math.floor(Math.random() * 3600) + 1800, // 30-90 دقیقه
        }));
        setCoffeeBeans(beansWithTimers);

        // Initialize timers
        const initialTimers: { [key: number]: number } = {};
        beansWithTimers.forEach((bean) => {
          initialTimers[bean.id] = bean.stockTimer;
        });
        setStockTimers(initialTimers);
      }, 1000);
    };

    fetchCoffeeBeans();
  }, []);

  // تایمر برای کاهش موجودی
  useEffect(() => {
    const interval = setInterval(() => {
      setStockTimers((prev) => {
        const newTimers = { ...prev };
        Object.keys(newTimers).forEach((key) => {
          const id = parseInt(key);
          if (newTimers[id] > 0) {
            newTimers[id] -= 1;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStockStatus = (stock: number, timer: number) => {
    if (stock === 0)
      return {
        status: "Out of Stock",
        color: "red",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      };
    if (stock < 5)
      return {
        status: "Very Low",
        color: "red",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
      };
    if (stock < 10 && timer < 1800)
      return {
        status: "Low Stock",
        color: "orange",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
      };
    if (stock < 15)
      return {
        status: "Selling Fast",
        color: "yellow",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
      };
    return {
      status: "In Stock",
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
    };
  };

  const addToCart = (bean: CoffeeBean) => {
    // افزودن به سبد خرید
    console.log("Added to cart:", bean.name);
  };

  return (
    <section
      id="live-stock"
      aria-labelledby="live-stock-heading"
      className={`py-20 ${isDark ? "bg-gray-900" : "bg-amber-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                isDark ? "bg-amber-500/20" : "bg-amber-500/10"
              }`}
            >
              <Zap
                className={`w-8 h-8 ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              />
            </div>
          </motion.div>
          <h2
            id="live-stock-heading"
            className={`text-4xl md:text-5xl font-bold font-cursive mb-6 ${
              isDark ? "text-amber-400" : "text-amber-900"
            }`}
          >
            Live Coffee Stock
          </h2>
          <p
            className={`text-xl max-w-2xl mx-auto ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Real-time inventory tracking. Watch as our finest beans move fast!
          </p>
        </motion.header>

        {/* Coffee Beans Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="list"
          aria-label="Coffee beans in stock"
        >
          {coffeeBeans.map((item, index) => {
            const stockStatus = getStockStatus(
              item.stock,
              stockTimers[item.id] || 0
            );

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                role="listitem"
                itemScope
                itemType="https://schema.org/Product"
                className={`relative p-6 rounded-2xl shadow-2xl border-2 ${
                  isDark
                    ? "bg-gray-800 border-amber-500/30"
                    : "bg-white border-amber-200"
                } transition-all duration-300`}
              >
                {/* Stock Status Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${stockStatus.bgColor} ${stockStatus.textColor}`}
                >
                  {stockStatus.status}
                </div>

                {/* Product Image */}
                <div className="mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-lg"
                    itemProp="image"
                  />
                </div>

                {/* Product Info */}
                <div
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <meta itemProp="price" content={item.price.toString()} />
                  <meta itemProp="priceCurrency" content="USD" />

                  <h3
                    className={`text-xl font-bold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                    itemProp="name"
                  >
                    {item.name}
                  </h3>

                  <p
                    className={`text-sm mb-3 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                    itemProp="description"
                  >
                    {item.origin} • {item.roast} Roast
                  </p>

                  {/* Flavor Notes */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.flavorNotes.map((note, noteIndex) => (
                      <span
                        key={noteIndex}
                        className={`px-2 py-1 rounded-full text-xs ${
                          isDark
                            ? "bg-amber-900/50 text-amber-300"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(item.rating)
                              ? isDark
                                ? "text-amber-400 fill-amber-400"
                                : "text-amber-600 fill-amber-600"
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
                      {item.rating}
                    </span>
                  </div>

                  {/* Stock Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Stock Left:
                      </span>
                      <span
                        className={`font-semibold ${
                          item.stock < 10
                            ? "text-red-500"
                            : isDark
                            ? "text-amber-400"
                            : "text-amber-600"
                        }`}
                      >
                        {item.stock} bags
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Time Left:
                      </span>
                      <span
                        className={`flex items-center gap-1 ${
                          isDark ? "text-amber-400" : "text-amber-600"
                        }`}
                      >
                        <Clock size={14} />
                        {formatTime(stockTimers[item.id] || 0)}
                      </span>
                    </div>

                    {/* این قسمت باعث خطای Hydration می‌شود */}
                    <div className="flex justify-between items-center">
                      <span
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      >
                        SKU: {item.id.toString().padStart(6, "0")}
                      </span>
                      <span
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      >
                        {/* استفاده از تابع formatTime برای یکسانی فرمت زمان */}
                        {formatTime(stockTimers[item.id] || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span
                        className={`text-2xl font-bold ${
                          isDark ? "text-amber-400" : "text-amber-600"
                        }`}
                        itemProp="price"
                      >
                        ${item.price}
                      </span>
                      <span
                        className={`text-sm ml-1 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        / {item.weight}g
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                        item.stock === 0
                          ? "bg-gray-400 cursor-not-allowed text-gray-200"
                          : isDark
                          ? "bg-amber-600 text-white hover:bg-amber-500"
                          : "bg-amber-900 text-white hover:bg-amber-800"
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </motion.button>
                  </div>
                </div>

                {/* Popularity Indicator */}
                {item.featured && (
                  <div className="absolute top-4 left-4">
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        isDark
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-amber-500/10 text-amber-700"
                      }`}
                    >
                      <TrendingUp size={12} />
                      Popular
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div
            className={`inline-flex items-center gap-8 p-6 rounded-2xl ${
              isDark ? "bg-gray-800/50" : "bg-white/80"
            } border ${isDark ? "border-amber-500/30" : "border-amber-200"}`}
          >
            <div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {coffeeBeans.reduce((sum, item) => sum + item.stock, 0)}
              </div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                Total Bags
              </div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {coffeeBeans.filter((item) => item.stock < 10).length}
              </div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                Low Stock
              </div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <div
                className={`text-2xl font-bold ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              >
                {coffeeBeans.filter((item) => item.featured).length}
              </div>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                Featured
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStock;
