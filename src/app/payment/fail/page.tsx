"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { XCircle, RefreshCcw, Home, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <Navbar />
      
      <main className="container mx-auto max-w-2xl px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-8 md:p-12 text-center border border-slate-100"
        >
          <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <XCircle size={48} strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl md:text-4xl font-poppins font-black text-slate-800 mb-4 tracking-tight">
            Payment Failed
          </h1>
          
          <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            We couldn't process your payment. This could be due to insufficient funds, an expired card, or a temporary gateway issue.
          </p>

          <div className="bg-amber-50 rounded-2xl p-4 mb-10 border border-amber-100 flex items-start gap-3 text-left">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-sm font-bold text-amber-900">What happened?</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                The transaction with ID <span className="font-mono font-bold">{tranId || "Unknown"}</span> was rejected by the payment provider. No money has been deducted from your account.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/premium"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
            >
              <RefreshCcw size={18} />
              Try Again
            </Link>
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition"
            >
              <Home size={18} />
              Go to Feed
            </Link>
          </div>

          <p className="mt-10 text-xs text-slate-400">
            If you believe this is an error, please contact our support team.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
