import { createClient } from "@/lib/supabase/server";
import ItemCard from "@/components/ItemCard";
import { FeedSkeleton, EmptyState } from "@/components/Skeleton";
import { mockItems } from "@/lib/mock-items";
import Link from "next/link";

async function getItems(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("items")
    .select("*, item_images(*)")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(12);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching items:", error);
    return mockItems;
  }

  return data && data.length > 0 ? data : mockItems;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search;
  const items = await getItems(search);

  return (
    <div className="flex flex-col flex-1">
      <section className="bg-white border-b border-gray-200 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-up-purple tracking-tight">
              UP 2 Hand
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              ตลาดซื้อขายของมือสองสำหรับนิสิตและบุคลากร มหาวิทยาลัยพะเยา
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/sell"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-up-gold px-6 py-3 text-base font-semibold text-up-purple hover:bg-up-gold-light transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                + ลงขายสินค้า
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-up-purple px-6 py-3 text-base font-semibold text-up-purple hover:bg-up-purple/5 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {search ? `ผลการค้นหา: "${search}"` : "สินค้าล่าสุด"}
            </h2>
            {search && (
              <Link
                href="/"
                className="text-sm text-up-purple hover:underline self-start"
              >
                ← ล้างการค้นหา
              </Link>
            )}
          </div>

          {items.length === 0 ? (
            <EmptyState
              message={search ? `ไม่พบสินค้าที่คุณค้นหา: "${search}"` : "ยังไม่มีสินค้าในระบบ"}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {items.map((item) => (
                <ItemCard key={item.item_id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}