import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] })
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
