"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ItemWithSeller } from "@/types/database";

interface ItemDetailClientProps {
  item: ItemWithSeller & { member: { avg_rating: number; review_count: number } & ItemWithSeller["member"] };
}

export default function ItemDetailClient({ item }: ItemDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const images = item.item_images?.length > 0
    ? item.item_images.map((img) => img.image_url)
    : [];

  const priceText = item.price === 0 ? "แจกฟรี" : `฿${item.price.toLocaleString()}`;
  const statusLabel = item.status === "available" ? "ว่าง" : "ขายแล้ว";
  const statusColor = item.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";
  const createdAt = new Date(item.created_at).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleChat = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = `/login?redirect_to=/items/${item.item_id}`;
      return;
    }

    if (user.id === item.member_id) {
      alert("คุณไม่สามารถแชทกับตัวเองได้");
      return;
    }

    setChatLoading(true);

    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("conversation_id")
      .eq("item_id", item.item_id)
      .eq("member_id", user.id)
      .single();

    if (convError && convError.code !== "PGRST116") {
      console.error("Conversation fetch error:", convError);
      setChatLoading(false);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      return;
    }

    let conversationId = conversation?.conversation_id;

    if (!conversationId) {
      const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert({
          item_id: item.item_id,
          member_id: user.id,
        })
        .select("conversation_id")
        .single();

      if (createError) {
        console.error("Conversation create error:", createError);
        setChatLoading(false);
        alert("ไม่สามารถสร้างห้องแชทได้ กรุณาลองใหม่");
        return;
      }

      conversationId = newConv.conversation_id;
    }

    setChatLoading(false);
    window.location.href = `/chat/${conversationId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับสู่หน้าหลัก
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {images.length > 0 ? (
                <>
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <Image
                      src={images[selectedImageIndex]}
                      alt={`${item.title} - รูปที่ ${selectedImageIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {images.map((src, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === selectedImageIndex
                              ? "border-up-purple"
                              : "border-transparent hover:border-gray-300"
                          }`}
                          aria-label={`ดูรูปที่ ${index + 1}`}
                          aria-current={index === selectedImageIndex ? "true" : "false"}
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] flex items-center justify-center bg-gray-100">
                  <svg className="h-32 w-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-3xl font-bold text-up-purple">{priceText}</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
                <time className="text-sm text-gray-500 whitespace-nowrap" dateTime={item.created_at}>
                  โพสต์เมื่อ {createdAt}
                </time>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900">รายละเอียดสินค้า</h2>
                <p className="mt-3 text-gray-700 whitespace-pre-wrap">{item.description || "ไม่มีรายละเอียดเพิ่มเติม"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลผู้ขาย</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.member.avatar_url ? (
                    <Image
                      src={item.member.avatar_url}
                      alt={item.member.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-up-purple/10">
                      <span className="text-2xl font-bold text-up-purple">
                        {item.member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.member.name}</p>
                  <p className="text-sm text-gray-500 truncate">{item.member.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {(item.member as any).avg_rating > 0 && (
                      <>
                        <span className="flex items-center gap-1 text-sm text-gray-700">
                          <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {(item.member as any).avg_rating.toFixed(1)} ({(item.member as any).review_count} รีวิว)
                        </span>
                      </>
                    )}
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-up-purple/10 text-up-purple">
                      {item.member.role === "admin" ? "แอดมิน" : "สมาชิก"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">สมาชิกตั้งแต่: {new Date(item.member.created_at).toLocaleDateString("th-TH", { month: "long", year: "numeric" })}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              {item.status === "available" ? (
                <button
                  onClick={handleChat}
                  disabled={chatLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-up-purple px-6 py-3 text-base font-semibold text-white hover:bg-up-purple-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {chatLoading ? "กำลังเปิดแชท..." : "ทักแชทผู้ขาย"}
                </button>
              ) : (
                <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 text-base font-semibold text-gray-500 cursor-not-allowed" disabled>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  สินค้าขายแล้ว
                </button>
              )}
              <p className="mt-3 text-center text-sm text-gray-500">
                ต้องเข้าสู่ระบบด้วยบัญชี @up.ac.th ถึงจะใช้งานได้
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}