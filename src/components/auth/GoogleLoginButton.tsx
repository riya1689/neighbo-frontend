"use client";

import React from "react";
import { FaGoogle } from "react-icons/fa";
import { API_URL } from "@/config/api";

export default function GoogleLoginButton({ label = "Continue with Google" }: { label?: string }) {
  const handleGoogleLogin = () => {
    // Redirect to the backend google auth route
    // We strip /api from API_URL to get the base backend URL if needed, 
    // but auth routes are usually under /api/auth/google
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-soft-gray bg-white text-dark-text font-medium hover:bg-slate-50 transition-all shadow-sm"
    >
      <FaGoogle className="text-accent-red" size={20} />
      <span>{label}</span>
    </button>
  );
}
