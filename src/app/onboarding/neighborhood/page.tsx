"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle2, ChevronRight, Loader2, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/config/api";

interface Neighborhood {
  id: string;
  name: string;
}

export default function NeighborhoodOnboarding() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // If already has neighborhood, no need to be here
    if (parsedUser.neighborhoodId) {
      router.push("/");
      return;
    }

    // Fetch neighborhoods
    const fetchNeighborhoods = async () => {
      try {
        const response = await fetch(`${API_URL}/neighborhoods`);
        const data = await response.json();
        if (response.ok) {
          setNeighborhoods(data);
        }
      } catch (err) {
        console.error("Failed to fetch neighborhoods", err);
        toast.error("Failed to load neighborhoods");
      } finally {
        setFetching(false);
      }
    };

    fetchNeighborhoods();
  }, [router]);

  const handleComplete = async () => {
    if (!selectedId) {
      toast.error("Please select a neighborhood to continue");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ neighborhoodId: selectedId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update neighborhood");
      }

      // Update local storage user data
      const updatedUser = { ...user, neighborhoodId: selectedId };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Welcome to the neighborhood!");
      
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-slate-100 overflow-hidden relative z-10"
      >
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="text-primary" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight mb-3">
              One last thing!
            </h1>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
              Welcome, <span className="text-primary font-semibold">{user?.displayName}</span>! 
              Please select your neighborhood to join your local community.
            </p>
          </div>

          {/* Neighborhood List */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-10">
            {neighborhoods.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                  selectedId === n.id 
                    ? "border-primary bg-primary/5 ring-1 ring-primary" 
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    selectedId === n.id ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className={`font-bold transition-colors ${
                      selectedId === n.id ? "text-primary" : "text-slate-700"
                    }`}>
                      {n.name}
                    </h3>
                  </div>
                </div>
                
                {selectedId === n.id ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="text-primary" size={24} />
                  </motion.div>
                ) : (
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                )}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleComplete}
            disabled={!selectedId || loading}
            className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Complete Setup
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-all" />
              </>
            )}
          </button>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
