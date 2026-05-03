"use client";

import { BellRing, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-softGray shadow-sm h-16">
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <span className="font-poppins font-bold text-2xl text-primary">Neighbo</span>
        </Link>

        {/* Middle: Search & Links */}
        <div className="hidden md:flex items-center gap-6 flex-1 max-w-md mx-8">
          <input 
            type="text" 
            placeholder="Search for people, groups..." 
            className="w-full bg-background border-none rounded-full px-4 py-2 focus:ring-2 ring-primary/20 outline-none"
          />
          <div className="flex gap-4 font-poppins font-medium text-sm">
            <Link href="/" className="text-primary border-b-2 border-primary">Home</Link>
            <button className="hover:text-primary transition">Explore</button>
            <button className="hover:text-primary transition">Category</button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-darkText hover:bg-primary-hover rounded-full">
            <BellRing size={20}/>
          </button>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-softGray">
                <UserIcon size={16} className="text-primary" />
                <span className="text-sm font-semibold text-darkText">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-darkText hover:text-accent-red hover:bg-accent-red/10 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <button className="font-poppins text-sm px-4 py-2 text-primary hover:bg-primary-hover rounded-lg font-semibold cursor-pointer">Login</button>
              </Link>
              <Link href="/register">
                <button className="font-poppins text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-md cursor-pointer">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}