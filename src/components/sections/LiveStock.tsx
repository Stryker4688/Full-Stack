"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { TrendingDown, TrendingUp, Minus, AlertTriangle } from "lucide-react";

// داده‌های اولیه ثابت برای جلوگیری از تفاوت در هیدراسیون
const initialStockData = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    stock: 8,
    trend: "decreasing",
    sku: "ETH-YIRG-2024",
    lastUpdated: new Date().toISOString(),
    popularity: "high",
    restockDate: "2024-02-15",
  },
  {
    id: 2,
    name: "Colombian Supremo",
    stock: 23,
    trend: "stable",
    sku: "COL-SUP-2024",
    lastUpdated: new Date().toISOString(),
    popularity: "medium",
    restockDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Kenya AA",
    stock: 3,
    trend: "decreasing",
    sku: "KEN-AA-2024",
    lastUpdated: new Date().toISOString(),
    popularity: "high",
    restockDate: "2024-02-10",
  },
  {
    id: 4,
    name: "Brazil Santos",
    stock: 45,
    trend: "stable",
    sku: "BRA-SAN-2024",
    lastUpdated: new Date().toISOString(),
    popularity: "low",
    restockDate: "2024-03-01",
  },
  {
    id: 5,
    name: "Guatemala Antigua",
    stock: 12,
    trend: "decreasing",
    sku: "GUA-ANT-2024",
    lastUpdated: new Date().toISOString(),
    popularity: "medium",
    restockDate: "2024-02-18",
  },
  {
    id: 6,
    name: "Sumatra Mandheling",
    stock: 6,
    trend: "decreasing",
    sku: "SUM-MAN-2024",
    lastUpdated: new Date().toISOString(),
    popularity: "high",
    restockDate: "2024-02-12",
  },
];

const LiveStock: React.FC = () => {
  const { isDark } = useTheme();
  const [stock, setStock] = useState(initialStockData);
  const [isMounted, setIsMounted] = useState(false);

  // Structured data for SEO - با داده‌های ثابت
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemAvailability",
    name: "Live Coffee Bean Stock Updates - Brew Haven",
    description:
      "Real-time inventory tracking for premium specialty coffee beans. Monitor stock levels and availability for our most popular single-origin coffees.",
    url: "https://brewhaven.com/stock",
    itemListElement: initialStockData.map((item) => ({
      "@type": "Product",
      name: item.name,
      sku: item.sku,
      offers: {
        "@type": "Offer",
        availability:
          item.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        inventoryLevel: {
          "@type": "QuantitativeValue",
          value: item.stock,
        },
        priceValidUntil: "2024-12-31",
      },
    })),
  };

  // برای جلوگیری از هیدراسیون، فقط در کلاینت mount شود
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // تابع برای نمایش زمان به صورت ثابت
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    // استفاده از locale ثابت و فرمت 24 ساعته برای یکسانی در سرور و کلاینت
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Simulate real-time updates - فقط در کلاینت
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setStock((prev) =>
        prev.map((item) => {
          let newStock = item.stock;
          if (item.trend === "decreasing" && item.stock > 0) {
            // Higher chance to decrease for popular items
            const decreaseChance = item.popularity === "high" ? 0.7 : 0.3;
            if (Math.random() < decreaseChance) {
              newStock = Math.max(0, item.stock - 1);
            }
          } else if (item.trend === "increasing" && item.stock < 50) {
            // Chance to restock
            if (Math.random() < 0.2) {
              newStock = item.stock + Math.floor(Math.random() * 5) + 1;
            }
          }

          return {
            ...item,
            stock: newStock,
            lastUpdated: new Date().toISOString(),
          };
        })
      );
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [isMounted]);

  const getStockStatus = (stock: number, popularity: string) => {
    if (stock === 0)
      return {
        status: "Out of Stock",
        color: "red",
        bg: "bg-red-500/20",
        border: "border-red-500/30",
        text: "text-red-400",
      };
    if (stock < 5)
      return {
        status: "Very Low",
        color: "red",
        bg: "bg-red-500/20",
        border: "border-red-500/30",
        text: "text-red-400",
      };
    if (stock < 10 && popularity === "high")
      return {
        status: "Low Stock",
        color: "orange",
        bg: "bg-orange-500/20",
        border: "border-orange-500/30",
        text: "text-orange-400",
      };
    if (stock < 15)
      return {
        status: "Selling Fast",
        color: "yellow",
        bg: "bg-yellow-500/20",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
      };
    return {
      status: "In Stock",
      color: "green",
      bg: "bg-green-500/20",
      border: "border-green-500/30",
      text: "text-green-400",
    };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "decreasing":
        return <TrendingDown size={16} className="text-red-400" />;
      case "increasing":
        return <TrendingUp size={16} className="text-green-400" />;
      default:
        return <Minus size={16} className="text-gray-400" />;
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      {isMounted && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <section
        aria-labelledby="live-stock-heading"
        className={`py-12 ${isDark ? "bg-gray-800" : "bg-white"} border-y ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <header className="text-center mb-8">
            <motion.h2
              id="live-stock-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`text-2xl md:text-3xl font-bold font-cursive mb-3 ${
                isDark ? "text-amber-400" : "text-amber-900"
              }`}
            >
              🚨 Live Coffee Bean Inventory
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Real-time stock levels updated every 15 seconds. Monitor
              availability for our most popular single-origin coffees.
            </motion.p>
          </header>

          {/* Stock Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label="Coffee bean stock levels"
          >
            {stock.map((item) => {
              const stockStatus = getStockStatus(item.stock, item.popularity);
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  role="listitem"
                  itemScope
                  itemType="https://schema.org/Product"
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${stockStatus.border} ${stockStatus.bg}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      itemProp="name"
                      className={`font-semibold ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(item.trend)}
                      {item.popularity === "high" && (
                        <div
                          className="w-2 h-2 bg-red-400 rounded-full"
                          title="High popularity"
                        ></div>
                      )}
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div
                    itemProp="offers"
                    itemScope
                    itemType="https://schema.org/Offer"
                  >
                    <meta
                      itemProp="availability"
                      content={
                        item.stock > 0
                          ? "https://schema.org/InStock"
                          : "https://schema.org/OutOfStock"
                      }
                    />
                    <meta
                      itemProp="inventoryLevel"
                      content={item.stock.toString()}
                    />

                    <div className="flex items-baseline justify-between mb-2">
                      <div className={`text-2xl font-bold ${stockStatus.text}`}>
                        {item.stock}
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${stockStatus.bg} ${stockStatus.text} font-medium`}
                      >
                        {stockStatus.status}
                      </div>
                    </div>

                    <div
                      className={`text-xs mb-2 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {item.stock === 1 ? "bag left" : "bags left"}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full ${
                          stockStatus.color === "red"
                            ? "bg-red-500"
                            : stockStatus.color === "orange"
                            ? "bg-orange-500"
                            : stockStatus.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(100, (item.stock / 50) * 100)}%`,
                        }}
                      ></div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex justify-between items-center text-xs">
                      <span
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      >
                        SKU: {item.sku}
                      </span>
                      <span
                        className={isDark ? "text-gray-500" : "text-gray-400"}
                      >
                        {/* استفاده از تابع formatTime برای یکسانی فرمت زمان */}
                        Updated: {formatTime(item.lastUpdated)}
                      </span>
                    </div>

                    {/* Restock Notice */}
                    {item.stock < 10 && (
                      <div className="flex items-center gap-1 mt-2 text-xs">
                        <AlertTriangle size={12} className="text-amber-500" />
                        <span
                          className={
                            isDark ? "text-amber-400" : "text-amber-600"
                          }
                        >
                          Restock:{" "}
                          {new Date(item.restockDate).toLocaleDateString(
                            "en-US"
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Legend and Information */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Stock Status Legend */}
              <div>
                <h4
                  className={`font-semibold mb-3 ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  Stock Status Legend
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      In Stock (15+ bags)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      Selling Fast (10-14 bags)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      Low Stock (5-9 bags)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      Very Low (1-4 bags)
                    </span>
                  </div>
                </div>
              </div>

              {/* SEO Context */}
              <div>
                <h4
                  className={`font-semibold mb-3 ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  About Our Inventory
                </h4>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  We roast all coffee beans in small batches to ensure maximum
                  freshness. Popular single-origin coffees often sell quickly
                  due to limited availability and seasonal harvests. Our live
                  inventory helps you secure your favorites before they're gone.
                </p>
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-6"
            >
              <p
                className={`text-sm mb-3 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Don't miss out on your favorite coffee - stock updates in
                real-time!
              </p>
              <motion.a
                href="#menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg font-semibold ${
                  isDark
                    ? "bg-amber-600 text-white hover:bg-amber-500"
                    : "bg-amber-900 text-white hover:bg-amber-800"
                } transition-colors text-sm`}
              >
                Shop Available Coffees
              </motion.a>
            </motion.div>
          </motion.footer>
        </div>
      </section>
    </>
  );
};

export default LiveStock;
