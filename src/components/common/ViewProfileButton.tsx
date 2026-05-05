"use client";

import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';

interface ViewProfileButtonProps {
  username: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

export default function ViewProfileButton({ 
  username, 
  className = "", 
  variant = 'secondary',
  size = 'sm'
}: ViewProfileButtonProps) {
  
  const baseStyles = "flex items-center justify-center gap-2 font-bold transition-all rounded-xl";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md",
    secondary: "bg-primary/10 text-primary hover:bg-primary/20",
    ghost: "text-slate-500 hover:text-primary hover:bg-primary/5",
    icon: "p-2 text-slate-400 hover:text-primary hover:bg-primary/5 border border-slate-100"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px] uppercase tracking-wider",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-3 text-sm"
  };

  if (variant === 'icon') {
    return (
      <Link 
        href={`/profile/${username}`}
        className={`${variants.icon} rounded-xl transition-all ${className}`}
        title="View Profile"
      >
        <User size={18} />
      </Link>
    );
  }

  return (
    <Link 
      href={`/profile/${username}`}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      View Profile
    </Link>
  );
}
