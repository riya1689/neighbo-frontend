"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const dataString = searchParams.get("data");
    if (dataString) {
      try {
        const userData = JSON.parse(decodeURIComponent(dataString));
        
        // Store token and user data
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));

        toast.success(`Welcome back, ${userData.displayName}!`);

        // Redirect to onboarding if neighborhood is missing
        setTimeout(() => {
          if (!userData.neighborhoodId) {
            router.push("/onboarding/neighborhood");
          } else if (userData.role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }, 1000);
      } catch (error) {
        console.error("Failed to parse auth data", error);
        toast.error("Authentication failed");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-primary font-poppins">Completing Login...</h2>
        <p className="text-dark-text opacity-70 mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthSuccessContent />
    </Suspense>
  );
}
