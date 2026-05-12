"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Check, X, ShieldCheck } from "lucide-react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

interface Neighborhood {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [neighborhoodId, setNeighborhoodId] = useState("");
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPasswordValidations({
      length: password.length >= 8 && password.length <= 12,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  }, [password]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await fetch(`${apiUrl}/neighborhoods`);
        const data = await response.json();
        if (response.ok) {
          setNeighborhoods(data);
        }
      } catch (err) {
        console.error("Failed to fetch neighborhoods", err);
      }
    };
    fetchNeighborhoods();
  }, [apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!neighborhoodId) {
      setError("Please select a neighborhood");
      toast.error("Please select a neighborhood");
      setLoading(false);
      return;
    }

    const allValid = Object.values(passwordValidations).every(Boolean);
    if (!allValid) {
      setError("Please meet all password requirements");
      toast.error("Please meet all password requirements");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ displayName, email, password, neighborhoodId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Welcome to the neighborhood!");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-soft-gray">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-poppins text-primary">Join Neighbo</h1>
          <p className="text-dark-text opacity-70 mt-2">Connect with your community today.</p>
        </div>

        <GoogleLoginButton label="Sign up with Google" />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-soft-gray"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-dark-text opacity-50 font-medium tracking-wider">
              Or sign up with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-accent-red/10 text-accent-red p-3 rounded-lg text-sm font-medium border border-accent-red/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-text mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-soft-gray focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-soft-gray focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-1">Neighborhood</label>
            <select
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-soft-gray focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
              required
            >
              <option value="">Select your neighborhood</option>
              {neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-soft-gray focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              required
            />
            
            {/* Password Checker UI */}
            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" />
                Password Requirements:
              </p>
              
              <ul className="space-y-1.5">
                {[
                  { label: "8 to 12 characters", valid: passwordValidations.length },
                  { label: "At least one uppercase letter", valid: passwordValidations.uppercase },
                  { label: "At least one number", valid: passwordValidations.number },
                  { label: "At least one special character (!@#$%^&*)", valid: passwordValidations.special },
                ].map((req, i) => (
                  <li key={i} className={`flex items-center gap-2 text-xs transition-colors ${req.valid ? "text-green-600" : "text-slate-400"}`}>
                    {req.valid ? (
                      <Check size={14} className="shrink-0" />
                    ) : (
                      <X size={14} className="shrink-0 text-accent-red opacity-50" />
                    )}
                    <span className={req.valid ? "font-medium" : ""}>{req.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-linear-to-r from-primary to-primary-dark text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-dark-text opacity-70">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
