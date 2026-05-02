// src/components/layout/Navbar.tsx
import { BellRing } from "lucide-react";
export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-softGray shadow-sm h-16">
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">N</div>
          <span className="font-poppins font-bold text-2xl text-primary">Neighbo</span>
        </div>

        {/* Middle: Search & Links */}
        <div className="hidden md:flex items-center gap-6 flex-1 max-w-md mx-8">
          <input 
            type="text" 
            placeholder="Search for people, groups..." 
            className="w-full bg-background border-none rounded-full px-4 py-2 focus:ring-2 ring-primary/20"
          />
          <div className="flex gap-4 font-poppins font-medium text-sm">
            <button className="text-primary border-b-2 border-primary">Home</button>
            <button className="hover:text-primary transition">Explore</button>
            <button className="hover:text-primary transition">Category</button>
          </div>
        </div>

        {/* Right: Actions (Guest State Example) */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-darkText hover:bg-primary-hover rounded-full">
            <BellRing size={20}/>
            </button>
          <button className="font-poppins text-sm px-4 py-2 text-primary hover:bg-primary-hover rounded-lg font-semibold">Login</button>
          <button className="font-poppins text-sm px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-md">Register</button>
        </div>
      </div>
    </nav>
  );
}