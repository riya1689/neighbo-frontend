"use client";

import React from 'react';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

interface CategoryButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export default function CategoryButton({ 
  className = "", 
  variant = 'secondary',
  size = 'md',
  href = "/categories"
}: CategoryButtonProps) {
  
  const baseStyles = "flex items-center justify-center gap-2 font-bold transition-all rounded-xl";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 hover:scale-105",
    secondary: "bg-white text-primary hover:bg-slate-50 shadow-md hover:scale-105",
    outline: "bg-transparent text-white border-2 border-white/50 hover:border-white hover:bg-white/10",
    glass: "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <Link 
      href={href}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <LayoutGrid size={size === 'sm' ? 16 : 18} />
      Category
    </Link>
  );
}
