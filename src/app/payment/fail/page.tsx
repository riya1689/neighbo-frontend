"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

function FailContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Payment Failed</h1>
        <p className="text-slate-500 mb-8">
          Your payment could not be processed. No charges were made to your account.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/premium")}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <FailContent />
    </Suspense>
  );
}
