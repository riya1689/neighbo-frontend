"use client";
import { motion } from "framer-motion";
import { Home, Gem, Users, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLeft() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* --- MENU ITEMS SECTION --- */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-soft-gray">
        <ul className="space-y-1 font-poppins font-medium">
          <Link href="/">
            <li className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition group ${pathname === "/" ? "bg-primary-hover text-primary" : "hover:bg-primary-hover hover:text-primary text-dark-text/70"}`}>
              <Home size={20} className="group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </li>
          </Link>
          <Link href="/premium">
            <li className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition group ${pathname === "/premium" ? "bg-primary-hover text-primary" : "hover:bg-primary-hover hover:text-primary text-dark-text/70"}`}>
              <Gem size={20} className="text-dark-text/40 group-hover:text-primary transition" />
              <span>Premium Plan</span>
            </li>
          </Link>
          <Link href="/neighbos">
            <li className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition group ${pathname === "/neighbos" ? "bg-primary-hover text-primary" : "hover:bg-primary-hover hover:text-primary text-dark-text/70"}`}>
              <Users size={20} className="text-dark-text/40 group-hover:text-primary transition" />
              <span>Neighbos</span>
            </li>
          </Link>
          <Link href="/followers">
            <li className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition group ${pathname === "/followers" ? "bg-primary-hover text-primary" : "hover:bg-primary-hover hover:text-primary text-dark-text/70"}`}>
              <Users size={20} className="text-dark-text/40 group-hover:text-primary transition" />
              <span>Followers</span>
            </li>
          </Link>
          <Link href="/following">
            <li className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition group ${pathname === "/following" ? "bg-primary-hover text-primary" : "hover:bg-primary-hover hover:text-primary text-dark-text/70"}`}>
              <Users size={20} className="text-dark-text/40 group-hover:text-primary transition" />
              <span>Following</span>
            </li>
          </Link>
        </ul>
      </div>

      {/* --- INVITE NEIGHBO SECTION --- */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-soft-gray text-center space-y-4"
      >
        <div className="w-full h-32 bg-background rounded-xl flex flex-col items-center justify-center border border-dashed border-soft-gray gap-2">
           <div className="p-3 bg-primary/10 rounded-full text-primary">
             <UserPlus size={32} />
           </div>
           <span className="text-[10px] uppercase font-bold text-dark-text/30 tracking-widest">Community Growth</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-poppins font-bold text-lg text-dark-text leading-snug">Build a better neighborhood together.</h3>
          <p className="font-inter text-xs text-dark-text/60 px-2">
            Invite nearby friends to join and strengthen your community.
          </p>
        </div>

        <button className="w-full bg-primary text-white font-poppins font-bold py-3 rounded-xl shadow-md hover:bg-primary-dark hover:shadow-primary/20 transition-all">
          Invite Neighbo
        </button>
      </motion.div>
    </div>
  );
}