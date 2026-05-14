"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SidebarLeft from "@/components/layout/SidebarLeft";
import SidebarRight from "@/components/layout/SidebarRight";
import { motion } from "framer-motion";
import { Gem, Check, Star, ArrowRight, Zap, ShieldCheck, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function PremiumPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/plans`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const sorted = data.sort((a: Plan, b: Plan) => a.price - b.price);
          setPlans(sorted);
        }
      } catch (e) {
        console.error("Failed to fetch plans", e);
        toast.error("Could not load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to purchase a plan.");
      return;
    }

    setPaying(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "PLAN",
          planId: selectedPlan.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        // Redirect to SSLCommerz Gateway
        window.location.href = data.url;
      } else {
        toast.error(data.reason || data.message || "Failed to initiate payment.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-inter text-dark-text">
      <Navbar />

      <main className="container mx-auto max-w-7xl px-4 pt-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          
          {/* LEFT SIDEBAR */}
          <aside className="hidden md:block md:col-span-3">
            <SidebarLeft />
          </aside>

          {/* MIDDLE MAIN SECTION */}
          <section className="col-span-1 md:col-span-9 space-y-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wide"
              >
                <Star size={16} fill="currentColor" />
                PREMIUM ACCESS
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-poppins font-bold text-slate-800 leading-tight"
              >
                Unlock the Full Power of <span className="text-primary">Neighbo</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 text-lg"
              >
                Choose the perfect plan to support your community and get exclusive benefits.
              </motion.p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white h-[450px] rounded-3xl border border-slate-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
                {plans.map((plan, idx) => {
                  const isPopular = plan.name.includes("6");
                  const features = plan.description.split(",").map(f => f.trim());
                  
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`relative bg-white p-8 rounded-[32px] border-2 transition-all hover:shadow-2xl hover:shadow-primary/10 group ${
                        isPopular ? "border-primary shadow-xl shadow-primary/5 scale-105 z-10" : "border-slate-100"
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                          MOST POPULAR
                        </div>
                      )}

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-2xl ${isPopular ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"}`}>
                            {idx === 0 ? <Zap size={24} /> : idx === 1 ? <Gem size={24} /> : <ShieldCheck size={24} />}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-2xl font-poppins font-bold text-slate-800">{plan.name}</h3>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-4xl font-bold text-slate-900">৳{plan.price}</span>
                            <span className="text-slate-400 font-medium">/ {plan.duration} days</span>
                          </div>
                        </div>

                        <ul className="space-y-4 pt-4 border-t border-slate-50">
                          {features.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-3">
                              <div className="mt-1 p-0.5 bg-green-100 text-green-600 rounded-full">
                                <Check size={12} strokeWidth={3} />
                              </div>
                              <span className="text-sm text-slate-600 font-medium leading-tight">{feature}</span>
                            </li>
                          ))}
                          <li className="flex items-start gap-3 opacity-50">
                            <div className="mt-1 p-0.5 bg-slate-100 text-slate-400 rounded-full">
                              <Check size={12} strokeWidth={3} />
                            </div>
                            <span className="text-sm text-slate-400 font-medium leading-tight">Priority community verification</span>
                          </li>
                        </ul>

                        <button 
                          onClick={() => setSelectedPlan(plan)}
                          className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98] ${
                            isPopular 
                              ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark" 
                              : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          Get Started
                          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Comparison Table or Extra Info */}
            <div className="bg-slate-50 rounded-[40px] p-8 md:p-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-poppins font-bold text-slate-800 leading-tight">
                      Why upgrade to <span className="text-primary">Neighbo Premium</span>?
                    </h2>
                    <p className="text-slate-500">
                      Join thousands of neighbors who are unlocking the full potential of their local communities. Premium members enjoy enhanced visibility, exclusive content, and advanced community tools.
                    </p>
                    <div className="space-y-4">
                      {[
                        "Support local community growth",
                        "Post unlimited premium content",
                        "Get verified neighborhood badge",
                        "Priority in discovery feed"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Check size={14} strokeWidth={3} />
                          </div>
                          <span className="font-bold text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Gem size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">Verified Neighbor</h4>
                        <p className="text-xs text-slate-400">Exclusive badge for premium members</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full w-[75%] bg-primary" />
                       </div>
                       <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span>Visibility Boost</span>
                          <span className="text-primary">75% Higher</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </main>

      {/* ──── CONFIRMATION MODAL ──── */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 font-poppins">Confirm Purchase</h2>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Gem size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedPlan.name}</h3>
                    <p className="text-xs text-slate-500">{selectedPlan.duration} days access</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                  <span className="text-sm font-bold text-slate-600">Total Price</span>
                  <span className="text-2xl font-black text-primary">৳{selectedPlan.price.toLocaleString()} BDT</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">
                You will be redirected to SSLCommerz secure payment gateway to complete the transaction.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={paying}
                  className="flex-1 py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {paying ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Proceed to Pay
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}