"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CashMemoModal from "@/components/payment/CashMemoModal";
import { CheckCircle2, AlertTriangle } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tranId = searchParams.get("tran_id");

  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!tranId) {
      setError("No transaction ID found.");
      setLoading(false);
      return;
    }

    const fetchTransaction = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/payments/verify/${tranId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to verify transaction.");
        }

        const data = await res.json();
        setTransaction(data);

        if (data.status === "COMPLETED") {
          if (data.type === "PLAN") {
            toast.success("Premium plan purchased successfully!", { duration: 5000, icon: "🎉" });
          } else {
            toast.success("Post unlocked successfully!", { duration: 5000, icon: "🔓" });
          }
          setShowModal(true);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [tranId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h1>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 mb-8">
          {transaction?.type === "PLAN"
            ? "Your premium plan is now active. Enjoy all the benefits!"
            : "The post has been unlocked. Enjoy the premium content!"}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            View Invoice
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition"
          >
            Back to Home
          </button>
        </div>
      </div>

      {showModal && transaction && (
        <CashMemoModal
          transaction={transaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
