"use client";
import type React from "react"
import { Inter } from "next/font/google"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin-navbar";
import { verifyAuthToken } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        router.push("/login");
        setIsLoading(false);
        return;
      }

      const isValid = await verifyAuthToken(accessToken);

      if (isValid) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <svg className="animate-spin h-12 w-12 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-0" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <AdminNavbar />
        {children}
      </body>
    </html>
  );
}
