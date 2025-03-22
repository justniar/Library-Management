"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/organism/navbar/Navbar";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import SidebarAdmin from "@/components/organism/sidebar/SidebarAdmin";
import SidebarUser from "@/components/organism/sidebar/SidebarUser";
import { AuthContext, AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`h-screen overflow-hidden flex ${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [username, setUsername] = useState("");

  const pathname = usePathname();
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";

  const authContext = useContext(AuthContext);
  const userRole = authContext?.authState?.role || "";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("username") || "";
      setUsername(storedUsername);
    }
  }, [authContext?.authState?.token]);

  if (!isClient) return null; // Hindari SSR sebelum komponen di-mount

  return (
    <div className="flex w-full h-screen">
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <>
          {userRole === "admin" ? <SidebarAdmin /> : <SidebarUser />}
          <div className="flex flex-col w-full h-screen">
            <Navbar username={username} />
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </div>
        </>
      )}
    </div>
  );
}
