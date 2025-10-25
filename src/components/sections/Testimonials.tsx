import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { Star, Quote, Award, Heart, Clock } from "lucide-react";
import AddTestimonial from "../coffee/AddTestimonial";
interface Testimonial {
  id: number;
  name: string;
  text: string;
  img: string;
  location: string;
  rating: number;
  date: string;
  verified: boolean;
  featured: boolean;
}

const TestimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    text: "The Ethiopian Yirgacheffe completely transformed my morning routine. The floral notes and bright acidity are exactly what I've been searching for. Brew Haven's quality is unmatched!",
    img: "https://picsum.photos/101/101",
    location: "Portland, OR",
    rating: 5,
    date: "2024-01-15",
    verified: true,
    featured: true,
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    text: "As a professional barista, I'm very particular about my beans. Brew Haven's Colombian Supremo has become my go-to for espresso. Consistent quality and amazing flavor development.",
    img: "https://picsum.photos/102/102",
    location: "Austin, TX",
    rating: 5,
    date: "2024-01-12",
    verified: true,
    featured: true,
  },
  {
    id: 3,
    name: "Emily Watson",
    text: "The coffee subscription is brilliant! Fresh beans delivered monthly, and the variety has helped me discover new favorites. Customer service is exceptional too.",
    img: "https://picsum.photos/103/103",
    location: "Chicago, IL",
    rating: 5,
    date: "2024-01-10",
    verified: true,
    featured: false,
  },
  {
    id: 4,
    name: "James Kim",
    text: "I've tried many specialty coffee roasters, but Brew Haven's attention to detail sets them apart. The Kenya AA is phenomenal - complex and vibrant.",
    img: "https://picsum.photos/104/104",
    location: "Seattle, WA",
    rating: 5,
    date: "2024-01-08",
    verified: true,
    featured: false,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    text: "The flavor notes are always accurate, and the beans arrive perfectly roasted. My daily coffee experience has improved dramatically since switching to Brew Haven.",
    img: "https://picsum.photos/105/105",
    location: "Denver, CO",
    rating: 5,
    date: "2024-01-05",
    verified: true,
    featured: false,
  },
  {
    id: 6,
    name: "David Park",
    text: "Outstanding customer service and incredible coffee. They helped me find the perfect beans for my brewing method, and the results are fantastic.",
    img: "https://picsum.photos/106/106",
    location: "San Diego, CA",
    rating: 5,
    date: "2024-01-03",
    verified: true,
    featured: false,
  },
];

const Testimonials: React.FC = () => {
  const { isDark } = useTheme();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Customer Testimonials and Reviews - Brew Haven Coffee",
    description:
      "Read authentic customer reviews and testimonials about Brew Haven's premium specialty coffee beans and exceptional service.",
    numberOfItems: TestimonialData.length,
    itemListElement: TestimonialData.map((testimonial, index) => ({
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
    reviewCount: "1274",
    bestRating: "5",
    worstRating: "1",
  };

  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(aggregateRating)}
      </script>

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
                Loved by Coffee Enthusiasts
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.7 }}
                className={`text-lg md:text-xl max-w-2xl mx-auto mt-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Discover why thousands of coffee lovers trust Brew Haven for
                their daily brew. Read authentic reviews from our community of
                passionate coffee enthusiasts.
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
                    1.2K+
                  </div>
                  <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Reviews
                  </div>
                </div>
              </motion.div>
            </motion.header>

            {/* Testimonials Carousel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              <Slider {...settings}>
                {TestimonialData.map((data) => (
                  <div key={data.id} className="my-6 px-2">
                    <motion.article
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
                          src={data.img}
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
                                  {new Date(data.date).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span itemProp="location">{data.location}</span>
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

                      {/* Schema Meta */}
                      <meta itemProp="datePublished" content={data.date} />
                      <div
                        itemProp="reviewRating"
                        itemScope
                        itemType="https://schema.org/Rating"
                      >
                        <meta
                          itemProp="ratingValue"
                          content={data.rating.toString()}
                        />
                        <meta itemProp="bestRating" content="5" />
                      </div>
                    </motion.article>
                  </div>
                ))}
              </Slider>
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
                  1.2K+
                </div>
                <div className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Happy Customers
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
                Experience the quality that thousands of coffee enthusiasts are
                raving about. Discover your new favorite coffee today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="#menu"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-3 rounded-lg font-semibold ${
                    isDark
                      ? "bg-amber-600 text-white hover:bg-amber-500"
                      : "bg-amber-900 text-white hover:bg-amber-800"
                  } transition-colors`}
                >
                  Shop Coffee Beans
                </motion.a>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-3 rounded-lg font-semibold border ${
                    isDark
                      ? "border-amber-400 text-amber-400 hover:bg-amber-400/10"
                      : "border-amber-900 text-amber-900 hover:bg-amber-900/10"
                  } transition-colors`}
                >
                  Contact Us
                </motion.a>
              </div>
            </motion.section>

            {/* SEO Rich Content */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-16"
            >
              <div
                className={`prose max-w-none ${
                  isDark ? "prose-invert" : ""
                } prose-amber text-center`}
              >
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDark ? "text-amber-400" : "text-amber-900"
                  }`}
                >
                  Why Customers Love Brew Haven
                </h2>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      🌱 Premium Quality Beans
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      Our customers consistently praise the exceptional quality
                      and freshness of our beans. Each batch is carefully
                      sourced and roasted to highlight unique flavor profiles.
                    </p>
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      🚀 Fast & Reliable Shipping
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      Freshness matters. We roast to order and ship within 24
                      hours, ensuring you receive peak-flavor coffee every time.
                      Free shipping on orders over $50.
                    </p>
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-3 ${
                        isDark ? "text-amber-400" : "text-amber-900"
                      }`}
                    >
                      💫 Exceptional Service
                    </h3>
                    <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                      From personalized recommendations to responsive support,
                      our team is dedicated to making your coffee experience
                      exceptional. We're here to help you brew better.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12"
        >
          <AddTestimonial />
        </motion.section>
      </section>
    </>
  );
};

export default Testimonials;
