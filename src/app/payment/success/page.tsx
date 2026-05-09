"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home, Receipt, Loader2, Download } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import CashMemoModal from "@/components/payment/CashMemoModal";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tranId = searchParams.get("tran_id");
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!tranId) {
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to see transaction details.");
          setLoading(false);
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/payments/verify/${tranId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          const isPlan = tranId.startsWith("P_");
          
          // Normalize buyer and neighborhood for the modal
          const buyer = data.buyer || {};
          const normalizedBuyer = {
            displayName: buyer.displayName || "User",
            username: buyer.username || "user",
            email: buyer.email || "user@example.com",
            neighborhood: buyer.neighborhood?.name || "Neighbo Community"
          };

          setTransaction({
            ...data,
            type: isPlan ? "PLAN" : "UNLOCK",
            buyer: normalizedBuyer,
            planType: data.planType,
            postTitle: data.post?.title
          });
        } else {
          toast.error("Could not verify transaction.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch transaction details.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [tranId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-slate-500 font-medium animate-pulse">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      <Navbar />
      
      <main className="container mx-auto max-w-2xl px-4 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 p-8 md:p-12 text-center border border-slate-100"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl md:text-4xl font-poppins font-black text-slate-800 mb-4 tracking-tight">
            Payment Successful!
          </h1>
          
          <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Thank you for your purchase. Your transaction has been completed and your account has been updated.
          </p>

          {transaction && (
            <div className="bg-slate-50 rounded-3xl p-6 mb-10 border border-slate-100 text-left">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Details</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">Completed</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-700">{tranId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-slate-900">৳{transaction.amount?.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Purchase Type</span>
                  <span className="font-bold text-slate-900">{transaction.type === "PLAN" ? "Premium Subscription" : "Content Unlock"}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowInvoice(true)}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20"
            >
              <Receipt size={18} />
              View Invoice
            </button>
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
            >
              <Home size={18} />
              Go to Feed
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <Link href="/premium" className="text-slate-400 hover:text-primary transition text-sm font-bold flex items-center justify-center gap-2">
              Back to Premium Plans <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </main>

      {showInvoice && transaction && (
        <CashMemoModal 
          transaction={{
            ...transaction,
            buyer: transaction.buyer || {
              displayName: "User",
              username: "user",
              email: "user@example.com",
              neighborhood: "Neighbo Community"
            }
          }}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
