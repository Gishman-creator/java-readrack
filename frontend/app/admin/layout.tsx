"use client";
import type React from "react"
import { Inter } from "next/font/google"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken && window.location.pathname.startsWith("/admin")) {
      router.push("/login");
    }
  }, [router]);

  return (
    <html lang="en" className="light">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
