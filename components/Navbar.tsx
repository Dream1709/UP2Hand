"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SearchInputWrapper from "@/components/SearchInputWrapper";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Login error:", error);
      alert("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="UP 2 Hand Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-up-purple">
              <span className="text-up-gold font-bold text-xl">UP</span>
            </div>
            <span className="hidden font-bold text-xl text-up-purple sm:inline">2 Hand</span>
          </Link>

          <div className="flex flex-1 items-center justify-center gap-4 md:gap-6">
            <div className="relative w-full max-w-xl hidden md:block" role="search">
<SearchInputWrapper />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                href="/sell"
                className="hidden rounded-lg bg-up-gold px-4 py-2 text-sm font-semibold text-up-purple hover:bg-up-gold-light transition-colors whitespace-nowrap md:inline-flex"
              >
                + ลงขาย
              </Link>
              <button
                onClick={handleLogin}
                className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-up-purple hover:text-up-purple transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>เข้าสู่ระบบด้วย UP Mail</span>
              </button>
            </div>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-expanded={isSearchOpen}
            aria-controls="mobile-search"
            aria-label={isSearchOpen ? "ปิดการค้นหา" : "เปิดการค้นหา"}
          >
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {isSearchOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              )}
            </svg>
          </button>
        </div>

        {isSearchOpen && (
          <div id="mobile-search" className="md:hidden px-4 pb-4" role="search">
            <SearchInputWrapper />
          </div>
        )}
      </nav>
    </header>
  );
}