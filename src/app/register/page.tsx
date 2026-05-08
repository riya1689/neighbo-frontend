"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Neighborhood {
  id: string;
  name: string;
}

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState("");
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
