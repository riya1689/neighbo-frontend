"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  CheckCircle, 
  Clock, 
  XCircle,
  Zap,
  CreditCard,
  Download
} from "lucide-react";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  amount: number;
  status: string;
  tranId: string;
  planType: string;
  createdAt: string;
}

export default function MyPremiumPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").split(",")[0].trim();
        
        const res = await fetch(`${apiUrl}/dashboard/plans`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPlans(data);
        }
      } catch (e) {
        toast.error("Failed to fetch plan history");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">My Premium Plans</h1>
        <p className="text-slate-500 mt-1">Manage your neighborhood subscriptions.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h3 className="font-bold text-slate-800 font-poppins">Subscription History</h3>
           <div className="relative">
              <input 
                type="text" 
                placeholder="Search history..." 
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
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan Name</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Purchase Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-medium">Loading history...</td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-medium">No plans found</td>
                </tr>
              ) : (
                plans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-xs font-mono font-bold text-slate-600 uppercase">{p.tranId}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                         <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                           <Zap size={14} fill="currentColor" />
                         </div>
                         <span className="font-bold text-slate-800 text-sm uppercase">{p.planType}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-slate-500">30 Days</span>
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
                    <td className="px-8 py-5">
                      <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all">
                         <Download size={18} />
                      </button>
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
