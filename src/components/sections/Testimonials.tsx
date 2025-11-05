// src/components/sections/Testimonials.tsx - COMPLETELY FIXED
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Star, Quote, Award, Heart, Clock, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/axios";
import ProtectedAction from "../auth/ProtectedAction";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { Testimonial as TestimonialType } from "../../types";
import { testimonialAdapter } from "../../utils/productAdapter";

const Testimonials: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    text: "",
    rating: 5,
    location: "",
  });

  // ✅ دریافت نظرات تایید شده از route عمومی
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async (): Promise<TestimonialType[]> => {
      try {
        const response = await api.get("/testimonials/approved");
        console.log("API Response:", response.data);

        let testimonialData = [];

        if (Array.isArray(response.data)) {
          testimonialData = response.data;
        } else if (response.data && Array.isArray(response.data.testimonials)) {
          testimonialData = response.data.testimonials;
        } else if (response.data && Array.isArray(response.data.data)) {
          testimonialData = response.data.data;
        } else {
          console.warn("Unexpected API response structure:", response.data);
          testimonialData = [];
        }

        // تبدیل داده‌های بکند به فرمت فرانت
        return testimonialData.map((testimonial: any) =>
          testimonialAdapter.toFrontend(testimonial)
        );
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
      }
    },
  });

  // mutation برای ارسال نظر جدید
  const submitTestimonialMutation = useMutation({
    mutationFn: async (testimonialData: any) => {
      const response = await api.post("/testimonials", testimonialData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setNewTestimonial({ name: "", text: "", rating: 5, location: "" });
      setShowForm(false);

      addToast({
        type: "success",
        title: "Review Submitted!",
        message: "Thank you! Your review will be displayed after approval",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      console.error("Error submitting testimonial:", error);
      const errorMessage = error.response?.data?.message || "خطا در ارسال نظر";

      addToast({
        type: "error",
        title: "Submission Failed",
        message: errorMessage,
        duration: 4000,
      });
    },
  });

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name.trim() || !newTestimonial.text.trim()) {
      addToast({
        type: "error",
        title: "Missing Information",
        message: "Please fill in all required fields",
        duration: 4000,
      });
      return;
    }

    submitTestimonialMutation.mutate({
      name: newTestimonial.name,
      message: newTestimonial.text, // تبدیل text به message برای بکند
      rating: newTestimonial.rating,
      location: newTestimonial.location,
    });
  };

  // Structured data for SEO - فقط برای نظرات تایید شده
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Customer Testimonials and Reviews - Brew Haven Coffee",
    description:
      "Read authentic customer reviews and testimonials about Brew Haven's premium specialty coffee beans and exceptional service.",
    numberOfItems: testimonials.length,
    itemListElement: testimonials.map((testimonial, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        name: `Review by ${testimonial.name}`,
        author: {
          "@type": "Person",
          name: testimonial.name,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: testimonial.rating.toString(),
          bestRating: "5",
        },
        reviewBody: testimonial.text,
        datePublished: testimonial.date,
        publisher: {
          "@type": "Organization",
          name: "Brew Haven",
        },
      },
    })),
  };

  const aggregateRating = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: testimonials.length.toString(),
    bestRating: "5",
    worstRating: "1",
  };

  if (isLoading) {
    return (
      <section
        id="testimonial"
        className={`py-20 ${isDark ? "bg-gray-900" : "bg-amber-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Loading testimonials...</div>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRating) }}
      />

      <section
        id="testimonial"
        aria-labelledby="testimonials-heading"
        className={`py-20 ${
          isDark ? "testimonials-bg-dark" : "testimonials-bg-light"
        }`}
      >
        <div className="bg-content">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <motion.header
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
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
                  <Heart
                    className={`w-8 h-8 ${
                      isDark ? "text-amber-400" : "text-amber-600"
                    }`}
                  />
                </div>
              </motion.div>
              <motion.h1
                id="testimonials-heading"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className={`text-center text-4xl md:text-5xl font-bold font-cursive mb-4 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Customer Experiences
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.7 }}
                className={`text-lg md:text-xl max-w-2xl mx-auto mt-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Read what our community says about their coffee journey. Share
                your own experience too!
              </motion.p>

              {/* Aggregate Rating */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex items-center justify-center gap-6 mt-8"
              >
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    4.9/5
                  </div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < 4
                            ? isDark
                              ? "text-amber-400 fill-amber-400"
                              : "text-amber-600 fill-amber-600"
                            : isDark
                            ? "text-amber-400 fill-amber-400"
                            : "text-amber-600 fill-amber-600"
                        }
                      />
                    ))}
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    {testimonials.length}+
                  </div>
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Verified Reviews
                  </div>
                </div>
              </motion.div>
            </motion.header>

            {/* Add Testimonial Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <ProtectedAction
                action={() => setShowForm(true)}
                message="Please login to share your experience"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-3 rounded-lg font-semibold border-2 ${
                    isDark
                      ? "border-amber-400 text-amber-400 hover:bg-amber-400/10"
                      : "border-amber-600 text-amber-600 hover:bg-amber-600/10"
                  } transition-colors flex items-center gap-2 mx-auto`}
                >
                  <Send size={20} />
                  Share Your Experience
                </motion.button>
              </ProtectedAction>
            </motion.div>

            {/* Testimonial Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mb-12 p-6 rounded-2xl ${
                    isDark ? "bg-gray-800/80" : "bg-white/90"
                  } border ${
                    isDark ? "border-amber-500/30" : "border-amber-200"
                  }`}
                >
                  <h3
                    className={`text-2xl font-bold mb-4 ${
                      isDark ? "text-amber-400" : "text-amber-900"
                    }`}
                  >
                    Share Your Coffee Experience
                  </h3>
                  <form
                    onSubmit={handleSubmitTestimonial}
                    className="space-y-4"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={newTestimonial.name}
                        onChange={(e) =>
                          setNewTestimonial({
                            ...newTestimonial,
                            name: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-400"
                            : "border-gray-300 placeholder-gray-500 focus:ring-amber-900"
                        }`}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Your Location (optional)"
                        value={newTestimonial.location}
                        onChange={(e) =>
                          setNewTestimonial({
                            ...newTestimonial,
                            location: e.target.value,
                          })
                        }
                        className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-400"
                            : "border-gray-300 placeholder-gray-500 focus:ring-amber-900"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block mb-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Your Rating *
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setNewTestimonial({
                                ...newTestimonial,
                                rating: star,
                              })
                            }
                            className={`p-2 rounded ${
                              newTestimonial.rating >= star
                                ? isDark
                                  ? "bg-amber-500 text-white"
                                  : "bg-amber-600 text-white"
                                : isDark
                                ? "bg-gray-700 text-gray-400"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            <Star size={20} fill="currentColor" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      placeholder="Share your coffee experience... *"
                      value={newTestimonial.text}
                      onChange={(e) =>
                        setNewTestimonial({
                          ...newTestimonial,
                          text: e.target.value,
                        })
                      }
                      rows={4}
                      className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-400"
                          : "border-gray-300 placeholder-gray-500 focus:ring-amber-900"
                      }`}
                      required
                    />

                    <div className="flex gap-4">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={submitTestimonialMutation.isPending}
                        className={`px-6 py-3 rounded-lg font-semibold ${
                          isDark
                            ? "bg-amber-600 text-white hover:bg-amber-500"
                            : "bg-amber-900 text-white hover:bg-amber-800"
                        } transition-colors flex items-center gap-2`}
                      >
                        <Send size={16} />
                        {submitTestimonialMutation.isPending
                          ? "Submitting..."
                          : "Submit Review"}
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className={`px-6 py-3 rounded-lg font-semibold border ${
                          isDark
                            ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        } transition-colors`}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Testimonials Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              {testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((data) => (
                    <motion.article
                      key={data.id}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      itemScope
                      itemType="https://schema.org/Review"
                      className={`flex flex-col gap-4 shadow-2xl py-8 px-6 rounded-xl relative border min-h-[320px] ${
                        isDark
                          ? "bg-gray-800/80 border-amber-500/30"
                          : "bg-white/90 border-amber-200"
                      } ${data.featured ? "ring-2 ring-amber-500" : ""}`}
                    >
                      {/* Featured Badge */}
                      {data.featured && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Award size={12} />
                            Featured
                          </div>
                        </div>
                      )}

                      {/* Verified Badge */}
                      {data.verified && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            ✓ Verified
                          </div>
                        </div>
                      )}

                      <div className="mb-4 mt-4">
                        <img
                          src={data.img || "/assets/user-placeholder.jpg"}
                          alt={`${data.name}, ${data.location}`}
                          className="rounded-full w-16 h-16 mx-auto border-4 border-amber-500 shadow-lg"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-col items-center gap-4 flex-1">
                        <div className="space-y-4 text-center flex-1">
                          <p
                            className={`text-sm leading-relaxed ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                            itemProp="reviewBody"
                          >
                            "{data.text}"
                          </p>
                          <div>
                            <h2
                              className={`text-lg font-bold font-cursive2 ${
                                isDark ? "text-amber-400" : "text-amber-900"
                              }`}
                              itemProp="author"
                            >
                              {data.name}
                            </h2>
                            <div className="flex items-center justify-center gap-2 mt-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < data.rating
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
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {data.rating}.0
                              </span>
                            </div>
                            <div
                              className={`text-xs mt-2 ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <Clock size={12} />
                                <span itemProp="datePublished">
                                  {data.date
                                    ? new Date(data.date).toLocaleDateString()
                                    : "Recent"}
                                </span>
                                {data.location && (
                                  <>
                                    <span>•</span>
                                    <span itemProp="location">
                                      {data.location}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative Quotes */}
                      <Quote
                        className={`absolute top-2 left-4 w-8 h-8 ${
                          isDark ? "text-amber-400/20" : "text-amber-900/20"
                        }`}
                      />
                      <Quote
                        className={`absolute bottom-2 right-4 w-8 h-8 rotate-180 ${
                          isDark ? "text-amber-400/20" : "text-amber-900/20"
                        }`}
                      />
                    </motion.article>
                  ))}
                </div>
              ) : (
                // Empty State وقتی هیچ نظری نیست
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
                    💬
                  </div>
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    No Reviews Yet
                  </h3>
                  <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                    Be the first to share your coffee experience!
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            >
              <div
                className={`p-6 rounded-lg ${
                  isDark ? "bg-amber-900/30" : "bg-amber-100"
                }`}
              >
                <div
                  className={`text-3xl font-bold ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  {testimonials.length}+
                </div>
                <div className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Verified Reviews
                </div>
              </div>
              <div
                className={`p-6 rounded-lg ${
                  isDark ? "bg-amber-900/30" : "bg-amber-100"
                }`}
              >
                <div
                  className={`text-3xl font-bold ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  4.9
                </div>
                <div className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Average Rating
                </div>
              </div>
              <div
                className={`p-6 rounded-lg ${
                  isDark ? "bg-amber-900/30" : "bg-amber-100"
                }`}
              >
                <div
                  className={`text-3xl font-bold ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  14
                </div>
                <div className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Years Experience
                </div>
              </div>
              <div
                className={`p-6 rounded-lg ${
                  isDark ? "bg-amber-900/30" : "bg-amber-100"
                }`}
              >
                <div
                  className={`text-3xl font-bold ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  98%
                </div>
                <div className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Repeat Customers
                </div>
              </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className={`text-center mt-16 p-8 rounded-2xl ${
                isDark ? "bg-amber-900/30" : "bg-amber-100"
              } border ${isDark ? "border-amber-500/30" : "border-amber-200"}`}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDark ? "text-amber-400" : "text-amber-900"
                }`}
              >
                Join Our Community of Coffee Lovers
              </h2>
              <p
                className={`mb-6 max-w-2xl mx-auto ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Experience the quality that coffee enthusiasts are raving about.
                Share your story and help others discover their perfect brew.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ProtectedAction
                  action={() => setShowForm(true)}
                  message="Please login to share your experience"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-3 rounded-lg font-semibold ${
                      isDark
                        ? "bg-amber-600 text-white hover:bg-amber-500"
                        : "bg-amber-900 text-white hover:bg-amber-800"
                    } transition-colors flex items-center gap-2`}
                  >
                    <Send size={20} />
                    Share Your Story
                  </motion.button>
                </ProtectedAction>
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
                  Contact Us
                </motion.button>
              </div>
            </motion.section>
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
