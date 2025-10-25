// components/AddTestimonial.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { Star, Send } from "lucide-react";
import ProtectedAction from "../auth/ProtectedAction";


const AddTestimonial: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!user) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert("Thank you for your review!");
      setComment("");
      setRating(5);
      setIsSubmitting(false);
    }, 1000);
  };

  const commentForm = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl mb-8 ${
        isDark ? "bg-gray-800/80" : "bg-white/90"
      } border ${
        isDark ? "border-amber-500/30" : "border-amber-200"
      } shadow-lg`}
    >
      <h3
        className={`text-xl font-semibold mb-4 ${
          isDark ? "text-amber-400" : "text-amber-900"
        }`}
      >
        Share Your Experience
      </h3>

      {/* Rating Stars */}
      <div className="flex items-center gap-2 mb-4">
        <span className={isDark ? "text-gray-300" : "text-gray-700"}>
          Your Rating:
        </span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="p-1">
              <Star
                size={24}
                className={
                  star <= rating
                    ? isDark
                      ? "text-amber-400 fill-amber-400"
                      : "text-amber-600 fill-amber-600"
                    : isDark
                    ? "text-gray-600"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment Textarea */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your coffee experience..."
        rows={4}
        className={`w-full p-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
          isDark
            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-amber-400 focus:border-amber-400"
            : "border-gray-300 placeholder-gray-500 focus:ring-amber-900 focus:border-amber-900"
        }`}
      />

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!comment.trim() || isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`mt-4 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
          !comment.trim() || isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : isDark
            ? "bg-amber-600 text-white hover:bg-amber-500"
            : "bg-amber-900 text-white hover:bg-amber-800"
        } transition-colors`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Review
          </>
        )}
      </motion.button>
    </motion.div>
  );

  return (
    <ProtectedAction
      action={() => {}} // Empty function since we're just showing the form
      message="Please login to submit a review"
    >
      {commentForm}
    </ProtectedAction>
  );
};

export default AddTestimonial;
