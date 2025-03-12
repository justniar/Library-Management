"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/organism/sidebar/Sidebar";
import Navbar from "@/components/organism/navbar/Navbar";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";
  const logedInUser = "salsabila"

  return (
    <html lang="en">
      <body className="min-h-screen">
        {isAuthPage ? (
          <>{children}</>
        ) : (
          <div className="flex">
            <Sidebar />
            <div className="w-full flex flex-col z-0">
              <Navbar username={logedInUser} />
              <main className="p-4">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}