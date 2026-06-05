import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Automotive Software Factory",
  description: "AI-powered vehicle software delivery platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full bg-slate-50">
        <Providers>
          <div className="flex h-full">
            <Navbar />
            <main className="flex-1 ml-64 min-h-screen overflow-y-auto bg-slate-50">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
