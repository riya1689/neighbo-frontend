"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Mail,  
  MapPin, 
  Sparkles,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6"; 

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide footer on dashboard and admin pages
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAdmin = pathname?.startsWith("/admin");

  if (isDashboard || isAdmin) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-soft-gray pt-10 pb-5 mt-8"> 
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Section */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                N
              </div>
              <span className="font-poppins font-bold text-xl text-primary tracking-tight">Neighbo</span>
            </Link>
            <p className="text-dark-text/60 text-xs leading-relaxed max-w-xs font-medium">
              The heart of your community. Connecting neighbors, sharing local updates, and building a stronger neighborhood together.
            </p>
            <div className="flex items-center gap-2">
              {[
                { icon: <FaFacebook size={18} />, href: "#" },
                { icon: <FaXTwitter size={18} />, href: "#" },
                { icon: <FaInstagram size={18} />, href: "#" },
                { icon: <FaLinkedin size={18} />, href: "#" },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-4">
            <h4 className="font-poppins font-bold text-dark-text text-sm mb-4 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Explore Feed", href: "/explore" },
                { name: "Categories", href: "/categories" },
                { name: "Premium Plan", href: "/premium", highlight: true },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-dark-text/50 hover:text-primary text-xs font-semibold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                    {link.name}
                    {link.highlight && <Sparkles size={10} className="text-amber-500 animate-pulse" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-poppins font-bold text-dark-text text-sm mb-4 uppercase tracking-wider">Community</h4>
            <ul className="space-y-2">
              {[
                { name: "Find Neighbos", href: "/neighbos" },
                { name: "Suggested Users", href: "/suggested-users" },
                { name: "Local Events", href: "/upcoming-events" },
                { name: "Neighbo AI", href: "/ai" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-dark-text/50 hover:text-primary text-xs font-semibold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-poppins font-bold text-dark-text text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 group">
                <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin size={10} />
                </div>
                <span className="text-dark-text/60 text-xs font-medium pt-1">123 Neighborhood St, Community City</span>
              </li>
              <li className="flex items-center gap-2 group">
                <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail size={18} />
                </div>
                <span className="text-dark-text/60 text-xs font-medium">hello@neighbo.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-50 pt-10 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-dark-text/40 text-[8px] font-bold tracking-wide uppercase">
            <span>&copy; {currentYear} Neighbo Inc</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1">
              All rights reserved
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {["Terms", "Privacy"].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                className="text-dark-text/40 hover:text-primary text-[8px] font-bold transition-colors uppercase tracking-widest"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
