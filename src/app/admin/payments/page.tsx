"use client";

import React, { useEffect, useState } from "react";
import { Search, ExternalLink, CreditCard, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Payment {
  id: string;
  amount: number;
  status: string;
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
  user: { name: string; email: string };
  invoice: { invoiceNumber: string } | null;
}

export default function PaymentOverview() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/admin/payments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPayments(data);
        } else {
          setPayments([]);
        }
      } catch (e) {
        toast.error("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-poppins">Payment Overview</h1>
          <p className="text-slate-500 text-sm">Monitor all platform transactions and subscription payments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">No transactions recorded</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-xs font-mono font-bold text-slate-600">{p.transactionId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">{p.user.displayName || p.user.name}</p>
                        <p className="text-xs text-slate-500">{p.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <CreditCard size={14} className="text-slate-400" />
                        <span className="text-xs font-bold uppercase">{p.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">৳{p.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full w-fit text-xs font-bold ${
                        p.status === "COMPLETED" ? "bg-green-100 text-green-600" : 
                        p.status === "PENDING" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                      }`}>
                        {p.status === "COMPLETED" ? <CheckCircle size={12} /> : 
                         p.status === "PENDING" ? <Clock size={12} /> : <XCircle size={12} />}
                        {p.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {p.invoice ? (
                        <button className="flex items-center gap-2 text-primary hover:text-primary-dark font-bold text-xs group transition-all">
                          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                          {p.invoice.invoiceNumber}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">N/A</span>
                      )}
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
