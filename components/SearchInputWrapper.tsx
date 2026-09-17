"use client";

import { Suspense } from "react";
import SearchInput from "@/components/SearchInput";

export default function SearchInputWrapper({ initialValue = "" }: { initialValue?: string }) {
  return (
    <Suspense fallback={<div className="w-full max-w-xl" />}>
      <SearchInput initialValue={initialValue} />
    </Suspense>
  );
}