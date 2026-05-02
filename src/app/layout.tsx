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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}