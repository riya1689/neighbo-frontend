"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExploreButton from "@/components/common/ExploreButton";
import CategoryButton from "@/components/common/CategoryButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: " Vibrant Living",
    subtitle: "Experience the heart of the city with luxury and comfort. Connect with your elite neighbors.",
    image: "https://plus.unsplash.com/premium_photo-1733342422588-c2fc9e279836?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxib29rbWFya3MtcGFnZXwzfHx8ZW58MHx8fHx8",
    accent: "from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    title: " Greenery - Peaceful Serenity",
    subtitle: "A calm oasis in the middle of the bustling metropolis. Discover hidden gems in your neighborhood.",
    image: "https://images.unsplash.com/photo-1609054841737-9feb7029bd7b?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxib29rbWFya3MtcGFnZXwyfHx8ZW58MHx8fHx8",
    accent: "from-emerald-600 to-teal-700"
  },
  {
    id: 3,
    title: " Heritage - Cultured Community",
    subtitle: "Rich history meets modern convenience. Build stronger bonds with your local heritage.",
    image: "https://plus.unsplash.com/premium_photo-1723514471119-9e5848ef6a5a?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxib29rbWFya3MtcGFnZXwxfHx8ZW58MHx8fHx8",
    accent: "from-amber-600 to-orange-700"
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-2xl group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 }
          }}
          className={`absolute inset-0 bg-gradient-to-r ${slides[currentIndex].accent} p-8 flex items-center`}
        >
          {/* Content */}
          <div className="relative z-10 max-w-lg space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-poppins text-4xl font-black leading-tight text-white drop-shadow-md">
                {slides[currentIndex].title}
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-base font-medium max-w-md leading-relaxed"
            >
              {slides[currentIndex].subtitle}
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 pt-2"
            >
              <ExploreButton variant="secondary" size="md" />
              <CategoryButton variant="glass" size="md" />
            </motion.div>
          </div>

          {/* Image Overlay */}
          <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden">
            <motion.div
              initial={{ scale: 1.1, x: 50, opacity: 0 }}
              animate={{ scale: 1, x: 0, opacity: 0.6 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 bg-white" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Arrow Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
