"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import { FaFacebook, FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import toast from "react-hot-toast";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({
  isOpen,
  onClose,
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  const inviteLink = "https://neighbo-frontend.vercel.app";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);

      setCopied(true);
      toast.success("Link copied to clipboard!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy link");
      console.error(error);
    }
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: <FaFacebook size={24} className="text-white" />,
      color: "bg-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        inviteLink
      )}`,
    },
    {
      name: "X",
      icon: <FaXTwitter size={24} className="text-white" />,
      color: "bg-[#000000]",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        inviteLink
      )}&text=${encodeURIComponent("Join me on Neighbo!")}`,
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp size={24} className="text-white" />,
      color: "bg-[#25D366]",
      href: `https://wa.me/?text=${encodeURIComponent(
        `Join me on Neighbo! ${inviteLink}`
      )}`,
    },
    {
      name: "Messenger",
      icon: <FaFacebookMessenger size={24} className="text-white" />,
      color: "bg-[#0084FF]",
      href: `fb-messenger://share/?link=${encodeURIComponent(inviteLink)}`,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/20 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-50 p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Share2 size={24} />
                </div>

                <h2 className="font-poppins text-2xl font-bold tracking-tight text-slate-800">
                  Invite Neighbo
                </h2>
              </div>

              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-8 p-8">
              {/* Share Options */}
              <div className="grid grid-cols-4 gap-4">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${link.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      {link.icon}
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {link.name}
                    </span>
                  </a>
                ))}
              </div>

              {/* Copy Link Section */}
              <div className="space-y-3">
                <label className="px-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                  Share Link
                </label>

                <div className="group relative">
                  <input
                    type="text"
                    readOnly
                    value={inviteLink}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 pr-14 text-sm font-medium text-slate-600 focus:outline-none"
                  />

                  <button
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-2.5 text-primary shadow-sm transition-all duration-300 hover:bg-primary hover:text-white"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-center">
                <p className="text-sm italic leading-relaxed text-slate-500">
                  "The more neighbors we have, the stronger our community
                  becomes. Invite yours today!"
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}