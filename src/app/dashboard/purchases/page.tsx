"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";

interface Purchase {
  id: string;
  amount: number;
  status: string;
  tranId: string;
  createdAt: string;
  creator: { displayName: string; username: string };
  payer: { username: string };
  post: { title: string };
}

export default function PremiumContentPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
        
        const res = await fetch(`${apiUrl}/dashboard/purchases`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPurchases(data);
        }
      } catch (e) {
        toast.error("Failed to fetch purchase history");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Premium Content</h1>
        <p className="text-slate-500 mt-1">Content you have unlocked or purchased.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h3 className="font-bold text-slate-800 font-poppins">Purchase History</h3>
           <div className="relative">
              <input 
                type="text" 
                placeholder="Search purchases..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 ring-primary/20 outline-none w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Creator</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Content</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-medium">Loading history...</td>
                </tr>
              ) : purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-medium">No purchases found</td>
                </tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-xs font-mono font-bold text-slate-600 uppercase">{p.tranId}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{p.creator.displayName}</p>
                        <p className="text-[10px] text-primary font-bold">@{p.creator.username}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-600 truncate max-w-[150px] block">{p.post.title}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-bold text-slate-800">৳{p.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit text-[10px] font-bold ${
                        p.status === "COMPLETED" ? "bg-green-100 text-green-600" : 
                        p.status === "PENDING" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                      }`}>
                        {p.status === "COMPLETED" ? <CheckCircle size={10} /> : 
                         p.status === "PENDING" ? <Clock size={10} /> : <XCircle size={10} />}
                        {p.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-slate-400">
                      @{p.payer.username}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
