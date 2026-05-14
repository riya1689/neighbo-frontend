"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  History, 
  FileText, 
  LogOut, 
  UserCircle,
  ChevronRight,
  Mail,
  AtSign,
  Menu,
  X,
  Calendar
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Please login to access dashboard.");
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userStr));
    } catch (e) {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Close sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (loading) return <div className="h-screen flex items-center justify-center text-primary font-bold">Loading dashboard...</div>;
  if (!user) return null;

  const navItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { name: "Revenue Overview", icon: <History size={20} />, href: "/dashboard/revenue" },
    { name: "Followers List", icon: <History size={20} />, href: "/dashboard/followers" },
    { name: "Followings List", icon: <History size={20} />, href: "/dashboard/following" },
    { name: "Neighbos", icon: <History size={20} />, href: "/dashboard/neighbos" },
    { name: "Premium Content Purchases", icon: <History size={20} />, href: "/dashboard/purchases" },
    { name: "Post Management", icon: <FileText size={20} />, href: "/dashboard/posts" },
    { name: "My Premium Plans", icon: <History size={20} />, href: "/dashboard/plans" },
    { name: "Create Event", icon: <Calendar size={20} />, href: "/dashboard/events" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 fixed top-0 w-full z-30 shadow-sm">
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="p-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-all"
           >
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
           <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">N</div>
            <span className="font-poppins font-bold text-2xl text-primary tracking-tight hidden sm:block">Neighbo</span>
          </Link>
          <div className="h-6 w-[1px] bg-slate-200 mx-4 hidden lg:block"></div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden lg:block">My Dashboard</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <h3 className="font-bold text-slate-800 text-sm leading-none">{user.displayName || user.name}</h3>
            <div className="flex items-center justify-end gap-3 mt-1.5">
               <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <AtSign size={10} />
                  <span>{user.username}</span>
               </div>
               <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Mail size={10} />
                  <span>{user.email}</span>
               </div>
            </div>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border-2 border-white shadow-sm">
            <UserCircle size={24} />
          </div>
        </div>
      </header>

      <div className="flex pt-20 relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={`
          w-72 bg-white border-r border-slate-200 flex flex-col fixed h-[calc(100vh-80px)] z-20 p-6
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-primary text-white shadow-xl shadow-primary/30 translate-x-2" 
                      : "text-slate-500 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="font-bold text-sm">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-slate-100 mt-auto">
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-slate-400 hover:text-accent-red hover:bg-accent-red/5 transition-all group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="font-bold text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-4 md:p-8 min-h-[calc(100vh-80px)] w-full">
           {children}
        </main>
      </div>
    </div>
  );
}
