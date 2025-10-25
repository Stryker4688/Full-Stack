import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useCart } from "../../contexts/CartContext";
import { Search, Star, Globe, Zap, Thermometer } from "lucide-react";
import ProtectedAction from "../auth/ProtectedAction";
import { useAuth } from "../../contexts/AuthContext";

interface CoffeeBean {
  id: number;
  name: string;
  origin: string;
  roast: "light" | "medium" | "medium-dark" | "dark" | "espresso";
  price: number;
  weight: number;
  description: string;
  flavorNotes: string[];
  acidity: "low" | "medium" | "high";
  body: "light" | "medium" | "full";
  processing: "washed" | "natural" | "honey";
  elevation: number;
  image: string;
  rating: number;
  stock: number;
  featured: boolean;
  score: number;
  brewMethods: string[];
  harvest: string;
  varietal: string;
}

const CoffeeData: CoffeeBean[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    roast: "light",
    price: 24.99,
    weight: 250,
    description:
      "Floral and tea-like with citrus notes, this light roast showcases the delicate flavors of Ethiopian beans from the birthplace of coffee.",
    flavorNotes: ["Bergamot", "Jasmine", "Lemon Zest", "Tea-like"],
    acidity: "high",
    body: "light",
    processing: "washed",
    elevation: 2000,
    image: "/api/placeholder/300/200",
    rating: 4.8,
    stock: 8,
    featured: true,
    score: 92,
    brewMethods: ["Pour Over", "Aeropress", "Cold Brew"],
    harvest: "Winter 2023",
    varietal: "Heirloom",
  },
  {
    id: 2,
    name: "Colombian Supremo",
    origin: "Colombia",
    roast: "medium",
    price: 19.99,
    weight: 250,
    description:
      "Well-balanced with caramel sweetness and nutty undertones. A classic crowd-pleaser from the Andes mountains.",
    flavorNotes: ["Milk Chocolate", "Caramel", "Hazelnut", "Brown Sugar"],
    acidity: "medium",
    body: "medium",
    processing: "washed",
    elevation: 1600,
    image: "/api/placeholder/300/200",
    rating: 4.6,
    stock: 23,
    featured: false,
    score: 87,
    brewMethods: ["Espresso", "Drip", "French Press"],
    harvest: "Spring 2023",
    varietal: "Caturra",
  },
  {
    id: 3,
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    roast: "dark",
    price: 22.99,
    weight: 250,
    description:
      "Bold and earthy with low acidity. Perfect for those who enjoy robust, full-bodied coffee from volcanic soils.",
    flavorNotes: ["Earthy", "Cedar", "Dark Chocolate", "Spicy"],
    acidity: "low",
    body: "full",
    processing: "natural",
    elevation: 1400,
    image: "/api/placeholder/300/200",
    rating: 4.7,
    stock: 18,
    featured: true,
    score: 85,
    brewMethods: ["French Press", "Moka Pot", "Espresso"],
    harvest: "Summer 2023",
    varietal: "Typica",
  },
  {
    id: 4,
    name: "Kenya AA",
    origin: "Kenya",
    roast: "light",
    price: 26.99,
    weight: 250,
    description:
      "Bright and wine-like with berry notes. Known for its complex acidity and clean finish from high-altitude farms.",
    flavorNotes: ["Black Currant", "Grape", "Tomato", "Bright"],
    acidity: "high",
    body: "medium",
    processing: "washed",
    elevation: 1700,
    image: "/api/placeholder/300/200",
    rating: 4.9,
    stock: 12,
    featured: true,
    score: 94,
    brewMethods: ["Pour Over", "Aeropress", "Cold Brew"],
    harvest: "Winter 2023",
    varietal: "SL28",
  },
  {
    id: 5,
    name: "Brazil Santos",
    origin: "Brazil",
    roast: "medium",
    price: 17.99,
    weight: 250,
    description:
      "Smooth and nutty with low acidity. Excellent for espresso blends and everyday drinking from Brazil's finest regions.",
    flavorNotes: ["Nutty", "Chocolate", "Smooth", "Sweet"],
    acidity: "low",
    body: "medium",
    processing: "natural",
    elevation: 1100,
    image: "/api/placeholder/300/200",
    rating: 4.5,
    stock: 30,
    featured: false,
    score: 84,
    brewMethods: ["Espresso", "Drip", "French Press"],
    harvest: "Spring 2023",
    varietal: "Bourbon",
  },
  {
    id: 6,
    name: "Guatemala Antigua",
    origin: "Guatemala",
    roast: "medium-dark",
    price: 23.99,
    weight: 250,
    description:
      "Complex with spicy and chocolate notes. Grown in the volcanic soils of Antigua valley for exceptional complexity.",
    flavorNotes: ["Spicy", "Chocolate", "Citrus", "Complex"],
    acidity: "medium",
    body: "full",
    processing: "washed",
    elevation: 1500,
    image: "/api/placeholder/300/200",
    rating: 4.7,
    stock: 20,
    featured: false,
    score: 88,
    brewMethods: ["Pour Over", "French Press", "Espresso"],
    harvest: "Spring 2023",
    varietal: "Catuai",
  },
];

const Menu: React.FC = () => {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoast, setSelectedRoast] = useState<string>("all");
  const [selectedOrigin, setSelectedOrigin] = useState<string>("all");
  const [selectedProcessing, setSelectedProcessing] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating" | "score">(
    "name"
  );
  const { user } = useAuth();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Premium Specialty Coffee Beans Menu - Brew Haven",
    description:
      "Browse our curated collection of single-origin specialty coffee beans from the world's finest growing regions. Ethically sourced, expertly roasted.",
    numberOfItems: CoffeeData.length,
    itemListElement: CoffeeData.map((coffee, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: coffee.name,
        description: coffee.description,
        sku: `${coffee.origin.toUpperCase()}-${coffee.name
          .replace(/\s+/g, "")
          .toUpperCase()}`,
        category: "Coffee Beans",
        offers: {
          "@type": "Offer",
          price: coffee.price.toString(),
          priceCurrency: "USD",
          availability:
            coffee.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          priceValidUntil: "2024-12-31",
        },
        brand: {
          "@type": "Brand",
          name: "Brew Haven",
        },
        countryOfOrigin: coffee.origin,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: coffee.rating.toString(),
          reviewCount: "50",
        },
      },
    })),
  };

  const roasts = ["all", "light", "medium", "medium-dark", "dark", "espresso"];
  const origins = [
    "all",
    ...new Set(CoffeeData.map((coffee) => coffee.origin)),
  ];
  const processingMethods = [
    "all",
    ...new Set(CoffeeData.map((coffee) => coffee.processing)),
  ];

  const filteredAndSortedCoffee = useMemo(() => {
    let filtered = CoffeeData.filter((coffee) => {
      const matchesSearch =
        coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coffee.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coffee.flavorNotes.some((note) =>
          note.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        coffee.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRoast =
        selectedRoast === "all" || coffee.roast === selectedRoast;
      const matchesOrigin =
        selectedOrigin === "all" || coffee.origin === selectedOrigin;
      const matchesProcessing =
        selectedProcessing === "all" ||
        coffee.processing === selectedProcessing;

      return (
        matchesSearch && matchesRoast && matchesOrigin && matchesProcessing
      );
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "rating":
          return b.rating - a.rating;
        case "score":
          return b.score - a.score;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedRoast, selectedOrigin, selectedProcessing, sortBy]);

  const handleAddToCart = (coffee: CoffeeBean) => {
    addToCart({
      id: coffee.id,
      name: coffee.name,
      price: coffee.price,
      image: coffee.image,
    });
  };

  const getRoastColor = (roast: string) => {
    const colors = {
      light: "bg-amber-200 text-amber-900",
      medium: "bg-amber-400 text-amber-900",
      "medium-dark": "bg-amber-600 text-white",
      dark: "bg-amber-800 text-white",
      espresso: "bg-amber-900 text-white",
    };
    return colors[roast as keyof typeof colors] || "bg-gray-200 text-gray-700";
  };

  const getAcidityIcon = (acidity: string) => {
    switch (acidity) {
      case "high":
        return "🟡";
      case "medium":
        return "🟠";
      case "low":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getBodyIcon = (body: string) => {
    switch (body) {
      case "full":
        return "🟤";
      case "medium":
        return "🟠";
      case "light":
        return "🟡";
      default:
        return "⚪";
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <section
        id="menu"
        aria-labelledby="menu-heading"
        className={`py-20 ${isDark ? "menu-bg-dark" : "menu-bg-light"}`}
      >
        <div className="bg-content">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <motion.header
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <motion.h1
                id="menu-heading"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className={`text-4xl md:text-5xl font-bold font-cursive mb-4 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Premium Coffee Collection
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.7 }}
                className={`text-lg md:text-xl max-w-3xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Discover our curated selection of specialty coffee beans from
                the world's finest growing regions. Each batch is carefully
                roasted to perfection and shipped fresh to your door.
              </motion.p>
            </motion.header>

            {/* Filters & Search */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`mb-12 p-6 rounded-2xl ${
                isDark ? "bg-gray-800/80" : "bg-white/90"
              } shadow-lg`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search coffee beans, origins, or flavors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-400"
                        : "border-gray-300 placeholder-gray-500 focus:ring-amber-900"
                    }`}
                  />
                </div>

                {/* Roast Filter */}
                <select
                  value={selectedRoast}
                  onChange={(e) => setSelectedRoast(e.target.value)}
                  className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-400"
                      : "border-gray-300 focus:ring-amber-900"
                  }`}
                >
                  <option value="all">All Roasts</option>
                  {roasts
                    .filter((r) => r !== "all")
                    .map((roast) => (
                      <option key={roast} value={roast}>
                        {roast.charAt(0).toUpperCase() + roast.slice(1)} Roast
                      </option>
                    ))}
                </select>

                {/* Origin Filter */}
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-400"
                      : "border-gray-300 focus:ring-amber-900"
                  }`}
                >
                  <option value="all">All Origins</option>
                  {origins
                    .filter((o) => o !== "all")
                    .map((origin) => (
                      <option key={origin} value={origin}>
                        {origin}
                      </option>
                    ))}
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-amber-400"
                      : "border-gray-300 focus:ring-amber-900"
                  }`}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="score">Sort by Quality</option>
                </select>
              </div>

              {/* Processing Filter */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  } mr-2`}
                >
                  Processing:
                </span>
                {processingMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedProcessing(method)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedProcessing === method
                        ? isDark
                          ? "bg-amber-600 text-white"
                          : "bg-amber-900 text-white"
                        : isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {method === "all"
                      ? "All"
                      : method.charAt(0).toUpperCase() + method.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mb-6"
            >
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
                Showing {filteredAndSortedCoffee.length} of {CoffeeData.length}{" "}
                coffees
                {searchTerm && ` for "${searchTerm}"`}
                {selectedRoast !== "all" && ` • ${selectedRoast} roast`}
                {selectedOrigin !== "all" && ` • from ${selectedOrigin}`}
                {selectedProcessing !== "all" &&
                  ` • ${selectedProcessing} processed`}
              </p>
            </motion.div>

            {/* Coffee Grid */}
            <AnimatePresence>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredAndSortedCoffee.map((coffee) => (
                  <motion.article
                    key={coffee.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    itemScope
                    itemType="https://schema.org/Product"
                    className={`rounded-2xl overflow-hidden shadow-2xl ${
                      isDark ? "bg-gray-800/90" : "bg-white/95"
                    } ${coffee.featured ? "ring-2 ring-amber-500" : ""}`}
                  >
                    {/* Featured Badge */}
                    {coffee.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Zap size={14} fill="currentColor" />
                          Featured
                        </div>
                      </div>
                    )}

                    {/* Quality Score */}
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          coffee.score >= 90
                            ? "bg-green-500 text-white"
                            : coffee.score >= 85
                            ? "bg-amber-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {coffee.score}+
                      </div>
                    </div>

                    {/* Low Stock Warning */}
                    {coffee.stock < 5 && (
                      <div className="absolute top-12 right-4 z-10">
                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {coffee.stock} left!
                        </div>
                      </div>
                    )}

                    {/* Coffee Image */}
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={coffee.image}
                        alt={`${coffee.name} coffee beans from ${coffee.origin}`}
                        className="w-full h-full object-cover"
                        itemProp="image"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${
                          isDark ? "from-gray-900/80" : "from-white/40"
                        }`}
                      />
                    </div>

                    {/* Coffee Info */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3
                            itemProp="name"
                            className={`text-xl font-bold mb-1 ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {coffee.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Globe
                              size={14}
                              className={
                                isDark ? "text-amber-400" : "text-amber-600"
                              }
                            />
                            <span
                              itemProp="countryOfOrigin"
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {coffee.origin}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${
                              isDark ? "text-amber-400" : "text-amber-900"
                            }`}
                            itemProp="price"
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

                      {/* Rating and Score */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={
                                  i < Math.floor(coffee.rating)
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
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {coffee.rating}
                          </span>
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-amber-400" : "text-amber-600"
                          }`}
                        >
                          Quality Score: {coffee.score}+
                        </div>
                      </div>

                      {/* Flavor Notes */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {coffee.flavorNotes.slice(0, 4).map((note, index) => (
                            <span
                              key={index}
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
                      </div>

                      {/* Coffee Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                isDark ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Roast
                            </span>
                            <span
                              className={`font-semibold ${getRoastColor(
                                coffee.roast
                              )} px-2 py-1 rounded-full text-xs`}
                            >
                              {coffee.roast}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                isDark ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Acidity
                            </span>
                            <span
                              className={
                                isDark ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {getAcidityIcon(coffee.acidity)} {coffee.acidity}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                isDark ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Body
                            </span>
                            <span
                              className={
                                isDark ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {getBodyIcon(coffee.body)} {coffee.body}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                isDark ? "text-gray-400" : "text-gray-500"
                              }
                            >
                              Process
                            </span>
                            <span
                              className={
                                isDark ? "text-gray-300" : "text-gray-700"
                              }
                            >
                              {coffee.processing}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div
                        className={`text-xs mb-4 space-y-1 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>Elevation: {coffee.elevation}m</span>
                          <span>Harvest: {coffee.harvest}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Varietal: {coffee.varietal}</span>
                          <span>Stock: {coffee.stock} bags</span>
                        </div>
                      </div>

                      {/* Brew Methods */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer
                            size={14}
                            className={
                              isDark ? "text-amber-400" : "text-amber-600"
                            }
                          />
                          <span
                            className={`text-xs font-semibold ${
                              isDark ? "text-amber-400" : "text-amber-600"
                            }`}
                          >
                            Best Brew Methods:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {coffee.brewMethods.map((method) => (
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

                      {/* Description */}
                      <p
                        itemProp="description"
                        className={`text-sm mb-4 leading-relaxed ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {coffee.description}
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
                              : isDark
                              ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:from-amber-500 hover:to-amber-600 shadow-lg hover:shadow-xl"
                              : "bg-gradient-to-r from-amber-800 to-amber-900 text-white hover:from-amber-700 hover:to-amber-800 shadow-lg hover:shadow-xl"
                          } ${!user ? "opacity-90 hover:opacity-100" : ""}`}
                        >
                          {coffee.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </motion.button>
                      </ProtectedAction>
                      {/* Stock Info */}
                      {coffee.stock > 0 && coffee.stock < 10 && (
                        <div
                          className={`text-xs text-center mt-2 ${
                            isDark ? "text-amber-400" : "text-amber-600"
                          }`}
                        >
                          Only {coffee.stock}{" "}
                          {coffee.stock === 1 ? "bag" : "bags"} remaining
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredAndSortedCoffee.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
                  className={`text-xl font-semibold mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  No coffee beans found
                </h3>
                <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                  Try adjusting your search criteria or filters
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRoast("all");
                    setSelectedOrigin("all");
                    setSelectedProcessing("all");
                  }}
                  className={`mt-4 px-6 py-2 rounded-lg font-semibold ${
                    isDark
                      ? "bg-amber-600 text-white hover:bg-amber-500"
                      : "bg-amber-900 text-white hover:bg-amber-800"
                  } transition-colors`}
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}

            {/* Coffee Education Section */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-16"
            >
              <div
                className={`rounded-2xl p-8 ${
                  isDark ? "bg-gray-800/80" : "bg-amber-100"
                } border ${
                  isDark ? "border-amber-500/30" : "border-amber-200"
                }`}
              >
                <h2
                  className={`text-2xl md:text-3xl font-bold font-cursive text-center mb-8 ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  Understanding Coffee Characteristics
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                  <div>
                    <h3
                      className={`font-semibold mb-2 ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      🌡️ Roast Levels
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      Light roasts preserve origin characteristics, while dark
                      roasts develop richer, bolder flavors through extended
                      roasting.
                    </p>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold mb-2 ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      🍋 Acidity
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      Not sourness, but brightness that enhances flavor
                      complexity. High acidity coffees often have wine-like or
                      citrus notes.
                    </p>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold mb-2 ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      ⚖️ Body
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      The weight and texture of coffee in your mouth.
                      Full-bodied coffees feel rich and creamy, while
                      light-bodied feel tea-like.
                    </p>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold mb-2 ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      🌱 Processing
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      How coffee cherries are processed affects flavor. Washed
                      coffees are clean and bright, natural processed are fruity
                      and complex.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu;
