"use client";

import React, { useRef, useState } from "react";
import { X, Download, Link2, CheckCircle2 } from "lucide-react";
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

// CHANGED: Completely removed html2canvas import and usage.
// html2canvas crashes with Tailwind v4 because it tries to parse oklab()/oklch()
// color functions from stylesheets, which its internal CSS parser doesn't support.
// Solution: draw the PDF directly with jsPDF's vector drawing API — no DOM,
// no stylesheet parsing, no color function issues at all.
function buildPdf(transaction: TransactionData): jsPDF {
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4", compress: true });

  const W = pdf.internal.pageSize.getWidth(); // 210mm
  const margin = 16;
  const contentW = W - margin * 2;
  let y = margin;

  // ── Drawing helpers ─────────────────────────────────────────────────────────

  const drawText = (
    str: string,
    x: number,
    yPos: number,
    opts: { size?: number; bold?: boolean; color?: string; align?: "left" | "right" | "center" } = {}
  ) => {
    pdf.setFontSize(opts.size ?? 10);
    pdf.setFont("helvetica", opts.bold ? "bold" : "normal");
    pdf.setTextColor(opts.color ?? "#1e293b");
    pdf.text(str, x, yPos, { align: opts.align ?? "left" });
  };

  const drawLine = (yPos: number, color = "#e2e8f0") => {
    pdf.setDrawColor(color);
    pdf.setLineWidth(0.3);
    pdf.line(margin, yPos, W - margin, yPos);
  };

  const drawRect = (
    x: number, yPos: number, w: number, h: number,
    fillColor?: string, strokeColor?: string
  ) => {
    if (fillColor) pdf.setFillColor(fillColor);
    if (strokeColor) pdf.setDrawColor(strokeColor);
    else pdf.setDrawColor(fillColor ?? "#ffffff");
    pdf.setLineWidth(0.3);
    const style = fillColor && strokeColor ? "FD" : fillColor ? "F" : "S";
    pdf.roundedRect(x, yPos, w, h, 2, 2, style);
  };

  // ── Header ──────────────────────────────────────────────────────────────────
  drawRect(margin, y, 8, 8, "#ede9fe");
  drawText("Neighbo", margin + 11, y + 5.5, { size: 16, bold: true, color: "#0f172a" });
  drawText(" Invoice", margin + 32, y + 5.5, { size: 16, bold: false, color: "#7c3aed" });
  drawText("Connecting communities through modern commerce.", margin + 11, y + 10, { size: 7, color: "#94a3b8" });

  const invNum = transaction.sslTranId || transaction.tranId.slice(-12).toUpperCase();
  drawText("INVOICE NUMBER", W - margin, y + 3, { size: 7, bold: true, color: "#94a3b8", align: "right" });
  drawRect(W - margin - 46, y + 4.5, 46, 7, "#f8fafc", "#e2e8f0");
  drawText(invNum, W - margin - 2, y + 9.8, { size: 8, bold: true, color: "#0f172a", align: "right" });

  y += 18;
  drawLine(y);
  y += 8;

  // ── Buyer / Seller ──────────────────────────────────────────────────────────
  drawText("BUYER DETAILS", margin, y, { size: 7, bold: true, color: "#94a3b8" });
  drawText("SELLER IDENTITY", W - margin, y, { size: 7, bold: true, color: "#94a3b8", align: "right" });
  y += 5;
  drawText(`@${transaction.buyer.username}`, margin, y, { size: 9, bold: true });
  drawText("Neighbo Premium Content", W - margin, y, { size: 9, bold: true, align: "right" });
  y += 4.5;
  drawText(transaction.buyer.email, margin, y, { size: 8, color: "#64748b" });
  drawText("Verified Community Merchant", W - margin, y, { size: 8, color: "#64748b", align: "right" });
  y += 4;
  drawText(transaction.buyer.neighborhood, margin, y, { size: 8, color: "#64748b" });
  y += 10;

  // ── Purchase Date / Payment Method ──────────────────────────────────────────
  const purchaseDate = transaction.paidAt
    ? format(new Date(transaction.paidAt), "MMMM dd, yyyy • hh:mm a")
    : format(new Date(transaction.createdAt), "MMMM dd, yyyy • hh:mm a");

  drawText("PURCHASE DATE", margin, y, { size: 7, bold: true, color: "#94a3b8" });
  drawText("PAYMENT METHOD", W - margin, y, { size: 7, bold: true, color: "#94a3b8", align: "right" });
  y += 5;
  drawText(purchaseDate, margin, y, { size: 9, bold: true });
  drawText("Digital Wallet (SSLCommerz)", W - margin, y, { size: 9, bold: true, align: "right" });
  y += 10;

  // ── Transaction ID box ──────────────────────────────────────────────────────
  drawRect(margin, y, contentW, 13, "#f8fafc", "#e2e8f0");
  drawText("TRANSACTION ID", margin + 3, y + 4.5, { size: 7, bold: true, color: "#94a3b8" });
  drawText(transaction.tranId, margin + 3, y + 9.5, { size: 8, bold: true, color: "#334155" });
  y += 18;

  // ── Items Table ─────────────────────────────────────────────────────────────
  // Table header row
  drawRect(margin, y, contentW, 9, "#f8fafc", "#e2e8f0");
  drawText("PRODUCT TYPE", margin + 3, y + 5.5, { size: 7, bold: true, color: "#94a3b8" });
  drawText("PLAN / CONTENT TITLE", margin + 46, y + 5.5, { size: 7, bold: true, color: "#94a3b8" });
  drawText("AMOUNT (BDT)", W - margin - 2, y + 5.5, { size: 7, bold: true, color: "#94a3b8", align: "right" });
  y += 9;

  const productLabel = transaction.type === "PLAN" ? "PREMIUM CONTENT" : "CONTENT UNLOCK";
  const contentTitle = transaction.type === "PLAN"
    ? transaction.planType || "Premium Plan"
    : transaction.postTitle || "Premium Post";

  const titleLines = pdf.splitTextToSize(contentTitle, 78) as string[];
  const rowH = Math.max(18, titleLines.length * 5 + 12);

  // Table item row
  drawRect(margin, y, contentW, rowH, "#ffffff", "#e2e8f0");

  // Product type badge
  drawRect(margin + 3, y + 3.5, 38, 6, "#ede9fe");
  drawText(productLabel, margin + 4.5, y + 7.8, { size: 6.5, bold: true, color: "#7c3aed" });

  // Content title lines
  titleLines.forEach((line: string, i: number) => {
    drawText(line, margin + 46, y + 7.5 + i * 5, { size: 9, bold: true });
  });

  // Sub-description
  const subY = y + 7.5 + titleLines.length * 5;
  if (transaction.type === "PLAN") {
    drawText("Unlimited access to premium content & priority listings.", margin + 46, subY, { size: 7, color: "#64748b" });
  } else if (transaction.type === "UNLOCK" && transaction.creator) {
    drawText(`Premium content by @${transaction.creator.username}`, margin + 46, subY, { size: 7, color: "#64748b" });
  }

  // Amount value
  drawText(`${transaction.amount.toLocaleString("en-BD")}`, W - margin - 2, y + 9, {
    size: 13, bold: true, align: "right",
  });

  y += rowH + 6;

  // ── Subtotal ────────────────────────────────────────────────────────────────
  drawText("Subtotal", W - margin - 58, y, { size: 9, color: "#64748b" });
  drawText(`${transaction.amount.toLocaleString("en-BD")}.00 BDT`, W - margin, y, {
    size: 9, bold: true, align: "right",
  });
  y += 8;

  // ── Total box ───────────────────────────────────────────────────────────────
  drawRect(W - margin - 74, y, 74, 14, "#f5f3ff", "#ddd6fe");
  drawText("Total Amount", W - margin - 72 + 3, y + 8.5, { size: 10, bold: true, color: "#7c3aed" });
  drawText(`${transaction.amount.toLocaleString("en-BD")}.00 BDT`, W - margin - 2, y + 8.5, {
    size: 11, bold: true, color: "#7c3aed", align: "right",
  });
  y += 22;

  // ── Footer ──────────────────────────────────────────────────────────────────
  drawLine(y);
  y += 6;
  drawText("This is a digitally generated invoice. No signature required.", margin, y, {
    size: 7, color: "#94a3b8",
  });
  drawText("(c) 2026 Neighbo Community Platform.", W - margin, y, {
    size: 7, color: "#94a3b8", align: "right",
  });

  return pdf;
}

export default function CashMemoModal({ transaction, onClose }: CashMemoModalProps) {
  const memoRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // CHANGED: No more html2canvas. Calls buildPdf() which draws purely with
  // jsPDF vector commands — immune to oklab/oklch CSS parsing errors.
  const handleDownloadPdf = async () => {
    const toastId = toast.loading("Preparing your PDF...");
    try {
      const pdf = buildPdf(transaction);
      const fileName = `neighbo-invoice-${transaction.tranId || "download"}.pdf`;
      pdf.save(fileName);
      toast.success("PDF downloaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error("PDF Generation Error Detail:", err);
      toast.error(`Failed to generate PDF: ${err.message || "Unknown error"}`, { id: toastId });
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

        {/* Scrollable Content — UI preview only, PDF is generated separately */}
        <div className="max-h-[85vh] overflow-y-auto">
          <div ref={memoRef} id="neighbo-invoice-content" className="bg-white p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-black text-sm">◆</span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-800">Neighbo Invoice</h1>
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

            <div className="h-px bg-slate-100 mb-6" />

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

            <div className="bg-slate-50 rounded-xl p-3 mb-6 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
              <p className="text-xs font-mono font-bold text-slate-700 break-all">{transaction.tranId}</p>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden mb-6">
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

            <div className="flex justify-end mb-2">
              <div className="w-64 flex justify-between items-center">
                <p className="text-sm text-slate-500">Subtotal</p>
                <p className="text-sm font-bold text-slate-800">
                  {transaction.amount.toLocaleString("en-BD")}.00 BDT
                </p>
              </div>
            </div>

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


// "use client";

// import React, { useRef, useState } from "react";
// import { X, Download, Link2, CheckCircle2 } from "lucide-react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import toast from "react-hot-toast";
// import { format } from "date-fns";

// interface TransactionData {
//   type: "PLAN" | "UNLOCK";
//   tranId: string;
//   sslTranId?: string;
//   planType?: string;
//   postTitle?: string;
//   amount: number;
//   status: string;
//   paidAt: string;
//   createdAt: string;
//   purchaseNo?: number;
//   buyer: {
//     displayName: string;
//     username: string;
//     email: string;
//     neighborhood: string;
//   };
//   creator?: {
//     displayName: string;
//     username: string;
//   };
// }

// interface CashMemoModalProps {
//   transaction: TransactionData;
//   onClose: () => void;
// }

// // CHANGED: Helper to recursively replace any unsupported CSS color functions
// // (oklab, oklch, lch, lab, color()) with safe fallback colors so html2canvas
// // doesn't crash. We walk every element inside the invoice container, read its
// // computedStyle, and force-set the property as an inline style with a plain
// // rgb/hex value resolved by the browser's own color-parsing.
// function sanitizeColorsForCanvas(root: HTMLElement) {
//   const PROPS = [
//     "color",
//     "backgroundColor",
//     "borderColor",
//     "borderTopColor",
//     "borderRightColor",
//     "borderBottomColor",
//     "borderLeftColor",
//     "outlineColor",
//     "boxShadow",
//   ];

//   // Regex that matches any modern color function html2canvas can't parse
//   const UNSUPPORTED = /oklab|oklch|lch\(|lab\(|color\(/i;

//   // We create a tiny off-screen element to let the browser convert any color
//   // string to a simple rgb() value.
//   const probe = document.createElement("div");
//   probe.style.display = "none";
//   document.body.appendChild(probe);

//   const resolveColor = (value: string): string => {
//     if (!UNSUPPORTED.test(value)) return value; // already safe
//     probe.style.color = value;
//     const resolved = getComputedStyle(probe).color; // browser gives back rgb(...)
//     probe.style.color = "";
//     return resolved || "rgb(0,0,0)";
//   };

//   const walk = (el: HTMLElement) => {
//     const cs = getComputedStyle(el);
//     for (const prop of PROPS) {
//       const val = cs[prop as any] as string;
//       if (val && UNSUPPORTED.test(val)) {
//         // boxShadow may contain multiple colors — replace each one
//         if (prop === "boxShadow") {
//           // Simplest safe fallback: just remove box-shadow to avoid crash
//           (el.style as any)[prop] = "none";
//         } else {
//           (el.style as any)[prop] = resolveColor(val);
//         }
//       }
//     }
//     for (const child of Array.from(el.children)) {
//       walk(child as HTMLElement);
//     }
//   };

//   walk(root);
//   document.body.removeChild(probe);
// }

// // CHANGED: Restore inline styles we forcibly set during capture so the UI
// // looks normal again after the PDF is generated.
// function restoreColors(root: HTMLElement) {
//   const PROPS = [
//     "color",
//     "backgroundColor",
//     "borderColor",
//     "borderTopColor",
//     "borderRightColor",
//     "borderBottomColor",
//     "borderLeftColor",
//     "outlineColor",
//     "boxShadow",
//   ];
//   const restore = (el: HTMLElement) => {
//     for (const prop of PROPS) {
//       (el.style as any)[prop] = "";
//     }
//     for (const child of Array.from(el.children)) {
//       restore(child as HTMLElement);
//     }
//   };
//   restore(root);
// }

// export default function CashMemoModal({ transaction, onClose }: CashMemoModalProps) {
//   const memoRef = useRef<HTMLDivElement>(null);
//   const [copied, setCopied] = useState(false);

//   const handleDownloadPdf = async () => {
//     const element = document.getElementById("neighbo-invoice-content");
//     if (!element) {
//       toast.error("Invoice content not found.");
//       return;
//     }

//     const toastId = toast.loading("Preparing your PDF...");

//     try {
//       await new Promise(resolve => setTimeout(resolve, 300));

//       // CHANGED: Strip all oklab/oklch/lch/lab color functions before capture
//       // so html2canvas doesn't throw "unsupported color function" errors.
//       sanitizeColorsForCanvas(element as HTMLElement);

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         logging: false,        // CHANGED: turned off noisy logging
//         allowTaint: true,
//         scrollX: 0,
//         scrollY: 0,
//         windowWidth: element.scrollWidth,
//         windowHeight: element.scrollHeight,
//         // CHANGED: onclone lets us sanitize the cloned DOM too, which is what
//         // html2canvas actually renders — double-safety net.
//         onclone: (_doc, clonedEl) => {
//           sanitizeColorsForCanvas(clonedEl as HTMLElement);
//         },
//       });

//       // CHANGED: Restore original styles on the live DOM after capture
//       restoreColors(element as HTMLElement);

//       const imgData = canvas.toDataURL("image/png", 1.0);
//       const pdf = new jsPDF({
//         orientation: "p",
//         unit: "mm",
//         format: "a4",
//         compress: true,
//       });

//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

//       const fileName = `neighbo-invoice-${transaction.tranId || "download"}.pdf`;
//       pdf.save(fileName);

//       toast.success("PDF downloaded successfully!", { id: toastId });
//     } catch (err: any) {
//       console.error("PDF Generation Error Detail:", err);
//       toast.error(`Failed to generate PDF: ${err.message || "Unknown error"}`, { id: toastId });
//     }
//   };

//   const handleShareLink = () => {
//     const url = `${window.location.origin}/payment/success?tran_id=${transaction.tranId}`;
//     navigator.clipboard.writeText(url).then(() => {
//       setCopied(true);
//       toast.success("Invoice link copied to clipboard!");
//       setTimeout(() => setCopied(false), 3000);
//     });
//   };

//   const invoiceNumber = transaction.sslTranId || transaction.tranId.slice(-12).toUpperCase();
//   const purchaseDate = transaction.paidAt
//     ? format(new Date(transaction.paidAt), "MMMM dd, yyyy • hh:mm a")
//     : format(new Date(transaction.createdAt), "MMMM dd, yyyy • hh:mm a");

//   const productLabel = transaction.type === "PLAN" ? "PREMIUM CONTENT" : "CONTENT UNLOCK";
//   const contentTitle = transaction.type === "PLAN"
//     ? transaction.planType || "Premium Plan"
//     : transaction.postTitle || "Premium Post";

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
//         >
//           <X size={20} />
//         </button>

//         {/* Scrollable Content */}
//         <div className="max-h-[85vh] overflow-y-auto">
//           {/* ──── PRINTABLE CASH MEMO ──── */}
//           <div ref={memoRef} id="neighbo-invoice-content" className="bg-white p-8">
//             {/* Header */}
//             <div className="flex items-start justify-between mb-8">
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
//                     <span className="text-primary font-black text-sm">◆</span>
//                   </div>
//                   <h1 className="text-2xl font-black text-slate-800 font-poppins">
//                     Neighbo Invoice
//                   </h1>
//                 </div>
//                 <p className="text-xs text-slate-400 ml-10">
//                   Connecting communities through modern commerce.
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Number</p>
//                 <p className="text-sm font-black text-slate-800 bg-slate-50 px-3 py-1 rounded-lg mt-1 border border-slate-100">
//                   {invoiceNumber}
//                 </p>
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="h-px bg-slate-100 mb-6" />

//             {/* Buyer & Seller Row */}
//             <div className="grid grid-cols-2 gap-6 mb-6">
//               <div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Buyer Details</p>
//                 <p className="font-bold text-slate-800 text-sm">@{transaction.buyer.username}</p>
//                 <p className="text-xs text-slate-500">{transaction.buyer.email}</p>
//                 <p className="text-xs text-slate-500">{transaction.buyer.neighborhood}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Seller Identity</p>
//                 <p className="font-bold text-slate-800 text-sm">Neighbo Premium Content</p>
//                 <p className="text-xs text-slate-500">Verified Community Merchant</p>
//               </div>
//             </div>

//             {/* Purchase Date & Payment Method */}
//             <div className="grid grid-cols-2 gap-6 mb-8">
//               <div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purchase Date</p>
//                 <p className="text-sm font-bold text-slate-800">{purchaseDate}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
//                 <p className="text-sm font-bold text-slate-800">Digital Wallet (SSLCommerz)</p>
//               </div>
//             </div>

//             {/* Transaction ID Row */}
//             <div className="bg-slate-50 rounded-xl p-3 mb-6 border border-slate-100">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
//               <p className="text-xs font-mono font-bold text-slate-700 break-all">{transaction.tranId}</p>
//             </div>

//             {/* Items Table */}
//             <div className="border border-slate-100 rounded-2xl overflow-hidden mb-6">
//               {/* Table Header */}
//               <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 border-b border-slate-100">
//                 <div className="col-span-3">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Type</p>
//                 </div>
//                 <div className="col-span-6">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan / Content Title</p>
//                 </div>
//                 <div className="col-span-3 text-right">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount (BDT)</p>
//                 </div>
//               </div>

//               {/* Table Row */}
//               <div className="grid grid-cols-12 items-start px-4 py-4">
//                 <div className="col-span-3">
//                   <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
//                     {productLabel}
//                   </span>
//                 </div>
//                 <div className="col-span-6">
//                   <p className="font-bold text-slate-800 text-sm">{contentTitle}</p>
//                   {transaction.type === "PLAN" && (
//                     <p className="text-xs text-slate-500 mt-1">
//                       Unlimited access to premium content, priority listings, and verified neighbor badge.
//                     </p>
//                   )}
//                   {transaction.type === "UNLOCK" && transaction.creator && (
//                     <p className="text-xs text-slate-500 mt-1">
//                       Premium content by @{transaction.creator.username}
//                     </p>
//                   )}
//                 </div>
//                 <div className="col-span-3 text-right">
//                   <p className="text-lg font-black text-slate-800">
//                     {transaction.amount.toLocaleString("en-BD")}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Subtotal */}
//             <div className="flex justify-end mb-2">
//               <div className="w-64 flex justify-between items-center">
//                 <p className="text-sm text-slate-500">Subtotal</p>
//                 <p className="text-sm font-bold text-slate-800">
//                   {transaction.amount.toLocaleString("en-BD")}.00 BDT
//                 </p>
//               </div>
//             </div>

//             {/* Total */}
//             <div className="flex justify-end mb-8">
//               <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 w-64">
//                 <div className="flex justify-between items-center">
//                   <p className="text-lg font-black text-primary">Total Amount</p>
//                   <p className="text-xl font-black text-primary">
//                     {transaction.amount.toLocaleString("en-BD")}.00 BDT
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="h-px bg-slate-100 mb-4" />
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-2 text-xs text-slate-400">
//                 <CheckCircle2 size={14} className="text-green-500" />
//                 <span>This is a digitally generated invoice. No signature required.</span>
//               </div>
//               <p className="text-xs text-slate-400">© 2026 Neighbo Community Platform.</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
//           <button
//             onClick={handleDownloadPdf}
//             className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
//           >
//             <Download size={18} />
//             Download PDF
//           </button>
//           <button
//             onClick={handleShareLink}
//             className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition border border-slate-200"
//           >
//             {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Link2 size={18} />}
//             {copied ? "Copied!" : "Copy Link"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useRef, useState } from "react";
// import { X, Download, Link2, CheckCircle2 } from "lucide-react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import toast from "react-hot-toast";
// import { format } from "date-fns";

// interface TransactionData {
//   type: "PLAN" | "UNLOCK";
//   tranId: string;
//   sslTranId?: string;
//   planType?: string;
//   postTitle?: string;
//   amount: number;
//   status: string;
//   paidAt: string;
//   createdAt: string;
//   purchaseNo?: number;
//   buyer: {
//     displayName: string;
//     username: string;
//     email: string;
//     neighborhood: string;
//   };
//   creator?: {
//     displayName: string;
//     username: string;
//   };
// }

// interface CashMemoModalProps {
//   transaction: TransactionData;
//   onClose: () => void;
// }

// export default function CashMemoModal({ transaction, onClose }: CashMemoModalProps) {
//   const memoRef = useRef<HTMLDivElement>(null);
//   const [copied, setCopied] = useState(false);

//   const handleDownloadPdf = async () => {
//     const element = document.getElementById("neighbo-invoice-content");
//     if (!element) {
//       toast.error("Invoice content not found.");
//       return;
//     }

//     const toastId = toast.loading("Preparing your PDF...");

//     try {
//       // Small delay to ensure all styles are applied and fonts are ready
//       await new Promise(resolve => setTimeout(resolve, 300));

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         logging: true,
//         allowTaint: true,
//         scrollX: 0,
//         scrollY: 0,
//         windowWidth: element.scrollWidth,
//         windowHeight: element.scrollHeight,
//       });

//       const imgData = canvas.toDataURL("image/png", 1.0);
//       const pdf = new jsPDF({
//         orientation: "p",
//         unit: "mm",
//         format: "a4",
//         compress: true
//       });

//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
//       const fileName = `neighbo-invoice-${transaction.tranId || 'download'}.pdf`;
//       pdf.save(fileName);
      
//       toast.success("PDF downloaded successfully!", { id: toastId });
//     } catch (err: any) {
//       console.error("PDF Generation Error Detail:", err);
//       toast.error(`Failed to generate PDF: ${err.message || "Unknown error"}`, { id: toastId });
//     }
//   };



//   const handleShareLink = () => {
//     const url = `${window.location.origin}/payment/success?tran_id=${transaction.tranId}`;
//     navigator.clipboard.writeText(url).then(() => {
//       setCopied(true);
//       toast.success("Invoice link copied to clipboard!");
//       setTimeout(() => setCopied(false), 3000);
//     });
//   };

//   const invoiceNumber = transaction.sslTranId || transaction.tranId.slice(-12).toUpperCase();
//   const purchaseDate = transaction.paidAt
//     ? format(new Date(transaction.paidAt), "MMMM dd, yyyy • hh:mm a")
//     : format(new Date(transaction.createdAt), "MMMM dd, yyyy • hh:mm a");

//   const productLabel = transaction.type === "PLAN" ? "PREMIUM CONTENT" : "CONTENT UNLOCK";
//   const contentTitle = transaction.type === "PLAN"
//     ? transaction.planType || "Premium Plan"
//     : transaction.postTitle || "Premium Post";

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
//       <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
//         >
//           <X size={20} />
//         </button>

//         {/* Scrollable Content */}
//         <div className="max-h-[85vh] overflow-y-auto">
//           {/* ──── PRINTABLE CASH MEMO ──── */}
//           <div ref={memoRef} id="neighbo-invoice-content" className="bg-white p-8">
//             {/* Header */}
//             <div className="flex items-start justify-between mb-8">
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
//                     <span className="text-primary font-black text-sm">◆</span>
//                   </div>
//                   <h1 className="text-2xl font-black text-slate-800 font-poppins">
//                     Neighbo Invoice
//                   </h1>
//                 </div>
//                 <p className="text-xs text-slate-400 ml-10">
//                   Connecting communities through modern commerce.
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Number</p>
//                 <p className="text-sm font-black text-slate-800 bg-slate-50 px-3 py-1 rounded-lg mt-1 border border-slate-100">
//                   {invoiceNumber}
//                 </p>
//               </div>
//             </div>

//             {/* Divider */}
//             <div className="h-px bg-slate-100 mb-6" />

//             {/* Buyer & Seller Row */}
//             <div className="grid grid-cols-2 gap-6 mb-6">
//               <div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Buyer Details</p>
//                 <p className="font-bold text-slate-800 text-sm">@{transaction.buyer.username}</p>
//                 <p className="text-xs text-slate-500">{transaction.buyer.email}</p>
//                 <p className="text-xs text-slate-500">{transaction.buyer.neighborhood}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Seller Identity</p>
//                 <p className="font-bold text-slate-800 text-sm">Neighbo Premium Content</p>
//                 <p className="text-xs text-slate-500">Verified Community Merchant</p>
//               </div>
//             </div>

//             {/* Purchase Date & Payment Method */}
//             <div className="grid grid-cols-2 gap-6 mb-8">
//               <div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purchase Date</p>
//                 <p className="text-sm font-bold text-slate-800">{purchaseDate}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
//                 <p className="text-sm font-bold text-slate-800">Digital Wallet (SSLCommerz)</p>
//               </div>
//             </div>

//             {/* Transaction ID Row */}
//             <div className="bg-slate-50 rounded-xl p-3 mb-6 border border-slate-100">
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
//               <p className="text-xs font-mono font-bold text-slate-700 break-all">{transaction.tranId}</p>
//             </div>

//             {/* Items Table */}
//             <div className="border border-slate-100 rounded-2xl overflow-hidden mb-6">
//               {/* Table Header */}
//               <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 border-b border-slate-100">
//                 <div className="col-span-3">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Type</p>
//                 </div>
//                 <div className="col-span-6">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan / Content Title</p>
//                 </div>
//                 <div className="col-span-3 text-right">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount (BDT)</p>
//                 </div>
//               </div>

//               {/* Table Row */}
//               <div className="grid grid-cols-12 items-start px-4 py-4">
//                 <div className="col-span-3">
//                   <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
//                     {productLabel}
//                   </span>
//                 </div>
//                 <div className="col-span-6">
//                   <p className="font-bold text-slate-800 text-sm">{contentTitle}</p>
//                   {transaction.type === "PLAN" && (
//                     <p className="text-xs text-slate-500 mt-1">
//                       Unlimited access to premium content, priority listings, and verified neighbor badge.
//                     </p>
//                   )}
//                   {transaction.type === "UNLOCK" && transaction.creator && (
//                     <p className="text-xs text-slate-500 mt-1">
//                       Premium content by @{transaction.creator.username}
//                     </p>
//                   )}
//                 </div>
//                 <div className="col-span-3 text-right">
//                   <p className="text-lg font-black text-slate-800">
//                     {transaction.amount.toLocaleString("en-BD")}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Subtotal */}
//             <div className="flex justify-end mb-2">
//               <div className="w-64 flex justify-between items-center">
//                 <p className="text-sm text-slate-500">Subtotal</p>
//                 <p className="text-sm font-bold text-slate-800">
//                   {transaction.amount.toLocaleString("en-BD")}.00 BDT
//                 </p>
//               </div>
//             </div>

//             {/* Total */}
//             <div className="flex justify-end mb-8">
//               <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4 w-64">
//                 <div className="flex justify-between items-center">
//                   <p className="text-lg font-black text-primary">Total Amount</p>
//                   <p className="text-xl font-black text-primary">
//                     {transaction.amount.toLocaleString("en-BD")}.00 BDT
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="h-px bg-slate-100 mb-4" />
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-2 text-xs text-slate-400">
//                 <CheckCircle2 size={14} className="text-green-500" />
//                 <span>This is a digitally generated invoice. No signature required.</span>
//               </div>
//               <p className="text-xs text-slate-400">© 2026 Neighbo Community Platform.</p>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="p-4 border-t border-slate-100 flex gap-3 bg-white">
//           <button
//             onClick={handleDownloadPdf}
//             className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/20"
//           >
//             <Download size={18} />
//             Download PDF
//           </button>
//           <button
//             onClick={handleShareLink}
//             className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-100 transition border border-slate-200"
//           >
//             {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Link2 size={18} />}
//             {copied ? "Copied!" : "Copy Link"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
