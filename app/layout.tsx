import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UP 2 Hand - ตลาดซื้อขายของมือสอง มหาวิทยาลัยพะเยา",
  description: "แพลตฟอร์มกลางซื้อขายและแลกเปลี่ยนสินค้ามือสองสำหรับนิสิตและบุคลากร มหาวิทยาลัยพะเยา",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              UP 2 Hand &copy; {new Date().getFullYear()} - มหาวิทยาลัยพะเยา
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}