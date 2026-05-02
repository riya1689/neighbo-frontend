"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full h-[280px] bg-gradient-to-r from-primary to-primary-dark rounded-3xl overflow-hidden p-8 text-white shadow-lg"
    >
      <div className="relative z-10 max-w-md space-y-4">
        <h1 className="font-poppins text-3xl font-bold leading-tight">
          Stronger neighborhoods, better together.
        </h1>
        <p className="text-white/80 text-sm">
          Connect with neighbors, share updates, and build a safer community.
        </p>
        <div className="flex gap-3 pt-2">
          <button className="bg-white text-primary px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition">Create Post</button>
          <button className="bg-white/20 backdrop-blur-md px-5 py-2 rounded-xl font-bold text-sm border border-white/30 hover:bg-white/30 transition">Explore</button>
        </div>
      </div>
      {/* Placeholder for Illustration */}
      <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 pointer-events-none bg-[url('/hero-illustration.png')] bg-contain bg-no-repeat bg-right-bottom" />
    </motion.div>
  );
}