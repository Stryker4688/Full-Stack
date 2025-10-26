// src/components/sections/About.tsx
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Award, Users, Globe, Heart, Coffee, Star } from "lucide-react";

// Lottie رو با dynamic import بیار که فقط در client-side لود بشه
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// نوع داده‌ای برای animationData
interface AnimationData {
  [key: string]: any;
}

const About: React.FC = () => {
  const { isDark } = useTheme();
  const [animationData, setAnimationData] = useState<AnimationData | null>(
    null
  );

  useEffect(() => {
    // فقط در client-side فایل JSON رو لود کن
    import("../../assets/Coffeeanime.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Brew Haven - Our Coffee Story",
    description:
      "Learn about Brew Haven's journey from a small coffee cart to a premium specialty coffee roaster. Discover our passion for perfect coffee and commitment to quality.",
    mainEntity: {
      "@type": "Organization",
      name: "Brew Haven",
      foundingDate: "2010",
      founder: {
        "@type": "Person",
        name: "Alex Brewster",
      },
      description:
        "Premium specialty coffee roaster dedicated to sourcing and roasting the world's finest coffee beans",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Brew City",
        addressRegion: "BC",
        postalCode: "12345",
        streetAddress: "123 Coffee Street",
      },
      award: [
        "Best Specialty Coffee Roaster 2023",
        "Sustainable Business Award 2022",
        "Community Choice Award 2021",
      ],
    },
  };

  const milestones = [
    {
      year: "2010",
      title: "Humble Beginnings",
      description: "Started as a single coffee cart in downtown Brew City",
      icon: Coffee,
    },
    {
      year: "2014",
      title: "First Roastery",
      description: "Opened our first small-batch roastery and tasting room",
      icon: Award,
    },
    {
      year: "2018",
      title: "Global Sourcing",
      description:
        "Established direct trade relationships with farmers worldwide",
      icon: Globe,
    },
    {
      year: "2023",
      title: "Community Hub",
      description:
        "Served our 100,000th customer and expanded online nationwide",
      icon: Users,
    },
  ];

  const values = [
    {
      icon: Star,
      title: "Quality First",
      description:
        "We never compromise on quality. Every bean is carefully selected and roasted to perfection.",
      color: "amber",
    },
    {
      icon: Heart,
      title: "Sustainable Sourcing",
      description:
        "We work directly with farmers who practice sustainable and ethical farming methods.",
      color: "green",
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description:
        "We explore coffee-growing regions worldwide to bring you unique and exciting flavors.",
      color: "blue",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "We believe in building relationships with our customers and coffee-growing communities.",
      color: "purple",
    },
  ];

  const teamStats = [
    { number: "14+", label: "Years Experience" },
    { number: "50+", label: "Coffee Origins" },
    { number: "100K+", label: "Happy Customers" },
    { number: "24/7", label: "Fresh Roasting" },
  ];

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        id="about"
        aria-labelledby="about-heading"
        className={`min-h-screen md:py-20 py-40 flex items-center ${
          isDark ? "about-bg-dark" : "about-bg-light"
        }`}
      >
        <div className="bg-content w-full">
          <div className="max-w-7xl mx-auto px-4">
            {/* Main Header */}
            <motion.header
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-16"
            >
              <motion.h1
                id="about-heading"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className={`font-cursive text-5xl md:text-6xl text-center mb-6 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Our Coffee Journey
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.7 }}
                className={`text-xl md:text-2xl max-w-4xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                From a humble coffee cart to a beloved specialty roastery -
                discover the story behind Brew Haven's passion for perfect
                coffee
              </motion.p>
            </motion.header>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-20">
              {/* Lottie Animation Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="lg:w-1/2 flex justify-center"
              >
                {animationData ? (
                  <Lottie
                    animationData={animationData}
                    className="w-full max-w-lg"
                    loop={true}
                  />
                ) : (
                  <div className="w-full max-w-lg h-64 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                    <Coffee className="w-16 h-16 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
              </motion.div>

              {/* Story Content */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="lg:w-1/2 space-y-8"
              >
                <div>
                  <h2
                    className={`text-3xl md:text-4xl font-cursive2 mb-6 ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    Crafting Coffee Experiences Since 2010
                  </h2>
                  <p
                    className={`text-lg leading-relaxed ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    } mb-6`}
                  >
                    Founded in 2010, Brew Haven began as a single coffee cart
                    with a simple mission: to serve exceptional coffee that
                    tells a story. What started as a passion project has
                    blossomed into a beloved community hub where coffee lovers
                    gather to share moments and create memories.
                  </p>
                  <p
                    className={`text-lg leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Our founder, Alex Brewster, believed that great coffee
                    should be accessible to everyone. That vision continues to
                    drive us today as we source, roast, and share the world's
                    most extraordinary coffees with our community.
                  </p>
                </div>

                {/* Team Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8"
                >
                  {teamStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div
                        className={`text-2xl md:text-3xl font-bold mb-2 ${
                          isDark ? "text-amber-400" : "text-amber-900"
                        }`}
                      >
                        {stat.number}
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Our Values Section */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-20"
            >
              <h2
                className={`text-3xl md:text-4xl font-cursive2 text-center mb-12 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Our Core Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className={`p-6 rounded-xl text-center ${
                      isDark ? "bg-gray-800/80" : "bg-white/90"
                    } border ${
                      isDark ? "border-amber-500/30" : "border-amber-200"
                    } shadow-lg`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        value.color === "amber"
                          ? "bg-amber-500/20 text-amber-500"
                          : value.color === "green"
                          ? "bg-green-500/20 text-green-500"
                          : value.color === "blue"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-purple-500/20 text-purple-500"
                      }`}
                    >
                      <value.icon size={32} />
                    </div>
                    <h3
                      className={`text-xl font-semibold mb-3 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {value.title}
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Journey Timeline */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-20"
            >
              <h2
                className={`text-3xl md:text-4xl font-cursive2 text-center mb-12 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Our Journey Through the Years
              </h2>
              <div className="relative">
                {/* Timeline Line */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full ${
                    isDark ? "bg-amber-500/30" : "bg-amber-200"
                  }`}
                ></div>

                {/* Timeline Items */}
                <div className="space-y-12">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      className={`flex items-center gap-8 ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      {/* Content */}
                      <div
                        className={`w-1/2 ${
                          index % 2 === 0 ? "text-right" : "text-left"
                        }`}
                      >
                        <div
                          className={`inline-block p-6 rounded-xl ${
                            isDark ? "bg-gray-800/80" : "bg-white/90"
                          } border ${
                            isDark ? "border-amber-500/30" : "border-amber-200"
                          } shadow-lg`}
                        >
                          <div
                            className={`text-2xl font-bold mb-2 ${
                              isDark ? "text-amber-400" : "text-amber-900"
                            }`}
                          >
                            {milestone.year}
                          </div>
                          <h3
                            className={`text-xl font-semibold mb-2 ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {milestone.title}
                          </h3>
                          <p
                            className={
                              isDark ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {milestone.description}
                          </p>
                        </div>
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center z-10 ${
                          isDark
                            ? "bg-amber-500 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        <milestone.icon size={24} />
                      </div>

                      {/* Spacer */}
                      <div className="w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Commitment Section */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className={`rounded-2xl p-8 md:p-12 ${
                isDark ? "bg-amber-900/20" : "bg-amber-100"
              } border ${isDark ? "border-amber-500/30" : "border-amber-200"}`}
            >
              <div className="max-w-4xl mx-auto text-center">
                <h2
                  className={`text-3xl md:text-4xl font-cursive2 mb-6 ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  Our Commitment to Excellence
                </h2>
                <div className="prose max-w-none text-left">
                  <p
                    className={`text-lg leading-relaxed mb-6 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    At Brew Haven, we believe that exceptional coffee begins
                    long before the beans reach our roastery. That's why we've
                    built{" "}
                    <strong>direct relationships with coffee farmers</strong>{" "}
                    across the globe, ensuring fair prices and sustainable
                    practices at every step of the journey.
                  </p>
                  <p
                    className={`text-lg leading-relaxed mb-6 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Our master roasters combine{" "}
                    <strong>
                      traditional techniques with modern technology
                    </strong>{" "}
                    to highlight the unique characteristics of each bean. We
                    roast in small batches to ensure peak freshness and flavor
                    development, then package immediately to preserve those
                    delicate aromas and flavors.
                  </p>
                  <p
                    className={`text-lg leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Whether you're brewing at home or visiting our tasting room,
                    we're committed to providing an{" "}
                    <strong>unforgettable coffee experience</strong> that
                    celebrates the artistry and passion behind every cup.
                  </p>
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <motion.button
                    onClick={() => {
                      const element = document.querySelector("#menu");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-3 rounded-lg font-semibold ${
                      isDark
                        ? "bg-amber-600 text-white hover:bg-amber-500"
                        : "bg-amber-900 text-white hover:bg-amber-800"
                    } transition-colors`}
                  >
                    Explore Our Coffees
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      const element = document.querySelector("#contact");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-3 rounded-lg font-semibold border ${
                      isDark
                        ? "border-amber-400 text-amber-400 hover:bg-amber-400/10"
                        : "border-amber-900 text-amber-900 hover:bg-amber-900/10"
                    } transition-colors`}
                  >
                    Visit Our Roastery
                  </motion.button>
                </motion.div>
              </div>
            </motion.section>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
