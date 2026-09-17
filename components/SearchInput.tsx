"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchInput({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery !== searchParams.get("search")) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedQuery.trim()) {
        params.set("search", debouncedQuery.trim());
      } else {
        params.delete("search");
      }
      router.push(`/?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, router, searchParams]);

  return (
    <form className="relative w-full max-w-xl" role="search">
      <label htmlFor="search-input" className="sr-only">ค้นหาสินค้า</label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาสินค้า เช่น พัดลม, ตู้เย็น, หนังสือ..."
        className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-up-purple focus:bg-white focus:outline-none focus:ring-2 focus:ring-up-purple/20 transition-all"
        autoComplete="off"
      />
      <svg
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="ล้างการค้นหา"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
}