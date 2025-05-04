import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReadRack - Your Digital Library",
  description: "Discover your next favorite book at ReadRack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className="light">
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
