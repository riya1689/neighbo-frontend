"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  ExternalLink, 
  CreditCard, 
  Download, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  DollarSign
} from "lucide-react";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  amount: number;
  status: string;
  tranId: string;
  createdAt: string;
  payer: { displayName: string; email: string };
  post: { title: string };
}

export default function RevenueOverview() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        
        // Fetch stats for total revenue
        const statsRes = await fetch(`${apiUrl}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        setTotalRevenue(statsData.totalRevenue || 0);

        // Fetch transactions
        const res = await fetch(`${apiUrl}/dashboard/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (e) {
        toast.error("Failed to fetch revenue data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 font-poppins tracking-tight">Revenue Overview</h1>
        <p className="text-slate-500 mt-1">Detailed breakdown of your content earnings.</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="p-6 bg-primary/10 rounded-3xl text-primary">
          <DollarSign size={48} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Accumulated Revenue</p>
          <div className="flex items-center gap-4">
             <h2 className="text-5xl font-bold text-slate-800 tracking-tighter">৳{totalRevenue.toLocaleString()}</h2>
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
                <TrendingUp size={14} />
                <span>+8.4%</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
           <h3 className="font-bold text-slate-800 font-poppins">Recent Transactions</h3>
           <div className="relative">
              <input 
                type="text" 
                placeholder="Search transactions..." 
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
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Content</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-medium">Loading history...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-medium">No transactions found</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-xs font-mono font-bold text-slate-600 uppercase">{t.tranId}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{t.payer.displayName}</p>
                        <p className="text-[10px] text-primary font-bold">@{t.payer.username}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-slate-600 truncate max-w-[150px] block">{t.post.title}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-bold text-slate-800">৳{t.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit text-[10px] font-bold ${
                        t.status === "COMPLETED" ? "bg-green-100 text-green-600" : 
                        t.status === "PENDING" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                      }`}>
                        {t.status === "COMPLETED" ? <CheckCircle size={10} /> : 
                         t.status === "PENDING" ? <Clock size={10} /> : <XCircle size={10} />}
                        {t.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                      {new Date(t.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all group">
                         <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
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
