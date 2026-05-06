"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ban size={40} className="text-amber-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Payment Cancelled</h1>
        <p className="text-slate-500 mb-8">
          You cancelled the payment. No charges were made.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
