"use client";

import Link from "next/link";
import { ItemWithImages } from "@/types/database";

interface ItemCardProps {
  item: ItemWithImages;
}

export default function ItemCard({ item }: ItemCardProps) {
  const firstImage = item.item_images?.[0]?.image_url;
  const priceText = item.price === 0 ? "แจกฟรี" : `฿${item.price.toLocaleString()}`;
  const statusLabel = item.status === "available" ? "ว่าง" : "ขายแล้ว";
  const statusColor = item.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";
  const createdAt = new Date(item.created_at).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-up-purple/30 transition-all duration-200">
      <Link href={`/items/${item.item_id}`} className="block relative aspect-[4/3] overflow-hidden" aria-label={`ดูรายละเอียด ${item.title}`}>
        {firstImage ? (
          <img
            src={firstImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/items/${item.item_id}`} className="block">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-up-purple transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-2">
          {item.description || "ไม่มีรายละเอียด"}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-up-purple">{priceText}</span>
          <time className="text-xs text-gray-400" dateTime={item.created_at}>
            {createdAt}
          </time>
        </div>
      </div>
    </article>
  );
}