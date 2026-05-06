"use client";

import React, { useRef, useState } from "react";
import { X, Download, Link2, CheckCircle2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface TransactionData {
  type: "PLAN" | "UNLOCK";
  tranId: string;
  sslTranId?: string;
  planType?: string;
  postTitle?: string;
  amount: number;
  status: string;
  paidAt: string;
  createdAt: string;
  purchaseNo?: number;
  buyer: {
    displayName: string;
    username: string;
    email: string;
    neighborhood: string;
  };
  creator?: {
    displayName: string;
    username: string;
  };
}

interface CashMemoModalProps {
  transaction: TransactionData;
  onClose: () => void;
}

export default function CashMemoModal({ transaction, onClose }: CashMemoModalProps) {
  const memoRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleDownloadPdf = async () => {
    if (!memoRef.current) return;

    try {
      const canvas = await html2canvas(memoRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`neighbo-invoice-${transaction.tranId}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF.");
    }
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/payment/success?tran_id=${transaction.tranId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Invoice link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const invoiceNumber = transaction.sslTranId || transaction.tranId.slice(-12).toUpperCase();
  const purchaseDate = transaction.paidAt
    ? format(new Date(transaction.paidAt), "MMMM dd, yyyy • hh:mm a")
    : format(new Date(transaction.createdAt), "MMMM dd, yyyy • hh:mm a");

  const productLabel = transaction.type === "PLAN" ? "PREMIUM CONTENT" : "CONTENT UNLOCK";
  const contentTitle = transaction.type === "PLAN"
    ? transaction.planType || "Premium Plan"
    : transaction.postTitle || "Premium Post";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
        >
          <X size={20} />
        </button>

        {/* Scrollable Content */}
        <div className="max-h-[85vh] overflow-y-auto">
          {/* ──── PRINTABLE CASH MEMO ──── */}
          <div ref={memoRef} className="bg-white p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-black text-sm">◆</span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-800 font-poppins">
                    Neighbo Invoice
                  </h1>
                </div>
                <p className="text-xs text-slate-400 ml-10">
                  Connecting communities through modern commerce.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Number</p>
                <p className="text-sm font-black text-slate-800 bg-slate-50 px-3 py-1 rounded-lg mt-1 border border-slate-100">
                  {invoiceNumber}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-6" />

            {/* Buyer & Seller Row */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Buyer Details</p>
                <p className="font-bold text-slate-800 text-sm">@{transaction.buyer.username}</p>
                <p className="text-xs text-slate-500">{transaction.buyer.email}</p>
                <p className="text-xs text-slate-500">{transaction.buyer.neighborhood}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Seller Identity</p>
                <p className="font-bold text-slate-800 text-sm">Neighbo Premium Content</p>
                <p className="text-xs text-slate-500">Verified Community Merchant</p>
              </div>
            </div>

            {/* Purchase Date & Payment Method */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purchase Date</p>
                <p className="text-sm font-bold text-slate-800">{purchaseDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                <p className="text-sm font-bold text-slate-800">Digital Wallet (SSLCommerz)</p>
              </div>
            </div>

            {/* Transaction ID Row */}
            <div className="bg-slate-50 rounded-xl p-3 mb-6 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
              <p className="text-xs font-mono font-bold text-slate-700 break-all">{transaction.tranId}</p>
            </div>

            {/* Items Table */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden mb-6">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 border-b border-slate-100">
                <div className="col-span-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Type</p>
                </div>
                <div className="col-span-6">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan / Content Title</p>
                </div>
                <div className="col-span-3 text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount (BDT)</p>
                </div>
              </div>

              {/* Table Row */}
              <div className="grid grid-cols-12 items-start px-4 py-4">
                <div className="col-span-3">
                  <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
                    {productLabel}
                  </span>
                </div>
                <div className="col-span-6">
                  <p className="font-bold text-slate-800 text-sm">{contentTitle}</p>
                  {transaction.type === "PLAN" && (
                    <p className="text-xs text-slate-500 mt-1">
                      Unlimited access to premium content, priority listings, and verified neighbor badge.
                    </p>
                  )}
                  {transaction.type === "UNLOCK" && transaction.creator && (
                    <p className="text-xs text-slate-500 mt-1">
                      Premium content by @{transaction.creator.username}
                    </p>
                  )}
                </div>
                <div className="col-span-3 text-right">
                  <p className="text-lg font-black text-slate-800">
                    {transaction.amount.toLocaleString("en-BD")}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex justify-end mb-2">
              <div className="w-64 flex justify-between items-center">
                <p className="text-sm text-slate-500">Subtotal</p>
                <p className="text-sm font-bold text-slate-800">
                  {transaction.amount.toLocaleString("en-BD")}.00 BDT
                </p>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-8">
              <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 w-64">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-black text-primary">Total Amount</p>
                  <p className="text-xl font-black text-primary">
                    {transaction.amount.toLocaleString("en-BD")}.00 BDT
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="h-px bg-slate-100 mb-4" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 size={14} className="text-green-500" />
                <span>This is a digitally generated invoice. No signature required.</span>
              </div>
              <p className="text-xs text-slate-400">© 2026 Neighbo Community Platform.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
          <button
            onClick={handleDownloadPdf}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={handleShareLink}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition border border-slate-200"
          >
            {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Link2 size={18} />}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
