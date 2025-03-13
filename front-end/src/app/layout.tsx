"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/organism/sidebar/SidebarUser";
import Navbar from "@/components/organism/navbar/Navbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarAdmin from "@/components/organism/sidebar/SidebarAdmin";
import SidebarUser from "@/components/organism/sidebar/SidebarUser";

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
  
  //static
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";
  const [userRole, setUserRole] = useState<"admin" | "user">("user");
  const [username, setUsername] = useState("salsabila");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") || "user";
    const storedUser = localStorage.getItem("username") || "salsabila";

    setUserRole(storedRole as "admin" | "user");
    setUsername(storedUser);
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen">
        {isAuthPage ? (
          <>{children}</>
        ) : (
          <div className="flex">
            {userRole === "admin" ? <SidebarAdmin/> :<SidebarUser /> }
            <div className="w-full flex flex-col z-0">
              <Navbar username={username} />
              <main className="p-4">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}