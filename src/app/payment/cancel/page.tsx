"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Info, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <Navbar />
      
      <main className="container mx-auto max-w-2xl px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-8 md:p-12 text-center border border-slate-100"
        >
          <div className="w-24 h-24 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Info size={48} strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl md:text-4xl font-poppins font-black text-slate-800 mb-4 tracking-tight">
            Payment Cancelled
          </h1>
          
          <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            You have cancelled the payment process. No charges were made to your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/premium"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
            >
              <ArrowLeft size={18} />
              Return to Plans
            </Link>
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition"
            >
              <Home size={18} />
              Go to Feed
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
