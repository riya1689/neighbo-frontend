import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins", // This matches the CSS variable in globals.css
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // This matches the CSS variable in globals.css
});

export const metadata: Metadata = {
  title: "Neighbo - Building Better Neighborhoods",
  description: "Connect with your community",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#1F2937",
              boxShadow: "0 10px 25px -5px rgba(108, 77, 255, 0.2), 0 8px 10px -6px rgba(108, 77, 255, 0.2)",
              borderRadius: "16px",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: "600",
              border: "1px solid #E5E7EB",
            },
            success: {
              iconTheme: {
                primary: "#6C4DFF",
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}