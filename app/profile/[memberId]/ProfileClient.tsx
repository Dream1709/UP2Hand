"use client";

import Link from "next/link";
import Image from "next/image";

interface ProfileData {
  member: {
    member_id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    role: string;
    is_banned: boolean;
    created_at: string;
  };
  reviews: {
    review_id: number;
    reviewer_id: string;
    reviewee_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    reviewer: {
      member_id: string;
      name: string;
      avatar_url: string | null;
    };
  }[];
  items: {
    item_id: number;
    title: string;
    price: number;
    status: string;
    created_at: string;
    item_images: { image_url: string }[];
  }[];
  avgRating: number;
  reviewCount: number;
}

interface ProfileClientProps {
  profile: ProfileData;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const { member, reviews, items, avgRating, reviewCount } = profile;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (member.is_banned) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">บัญชีถูกระงับ</h1>
          <p className="mt-2 text-gray-600">บัญชีนี้ถูกระงับการใช้งาน หากมีข้อสงสัยกรุณาติดต่อผู้ดูแลระบบ</p>
        </div>
      </div>
    );
  }

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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-up-purple to-up-purple-light px-6 py-8 sm:px-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative h-24 w-24 rounded-full bg-white/20 overflow-hidden flex-shrink-0">
                  {member.avatar_url ? (
                    <Image
                      src={member.avatar_url}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/30">
                      <span className="text-4xl font-bold text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{member.name}</h1>
                  <p className="mt-1 text-white/80">{member.email}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                      {member.role === "admin" ? "แอดมิน" : "สมาชิก"}
                    </span>
                    <span className="text-white/70 text-sm">
                      สมาชิกตั้งแต่ {formatDate(member.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white">
                <div className="text-center">
                  <p className="text-4xl font-bold">{avgRating.toFixed(1)}</p>
                  <div className="flex items-center justify-center gap-1">{renderStars(Math.round(avgRating))}</div>
                  <p className="text-sm text-white/70">{reviewCount} รีวิว</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">รีวิวที่ได้รับ</h2>
                <span className="text-sm text-gray-500">{reviewCount} รายการ</span>
              </div>

              {reviews.length === 0 ? (
                <div className="py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">ยังไม่มีรีวิว</h3>
                  <p className="mt-1 text-gray-500">เมื่อมีการซื้อขายเสร็จสิ้น จะแสดงรีวิวที่นี่</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.review_id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="relative h-12 w-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                          {review.reviewer.avatar_url ? (
                            <Image
                              src={review.reviewer.avatar_url}
                              alt={review.reviewer.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-up-purple/10">
                              <span className="text-xl font-bold text-up-purple">
                                {review.reviewer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{review.reviewer.name}</p>
                              <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="mt-3 text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">สินค้าที่ลงขาย</h2>
                <Link
                  href={`/sell`}
                  className="hidden sm:inline-flex items-center gap-1 text-sm text-up-purple hover:underline font-medium"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  + ลงขายสินค้า
                </Link>
              </div>

              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">ยังไม่มีสินค้าที่ลงขาย</h3>
                  <p className="mt-1 text-gray-500">เริ่มลงขายสินค้าได้ที่ปุ่ม + ลงขายสินค้า</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => {
                    const image = item.item_images?.[0]?.image_url;
                    const priceText = item.price === 0 ? "แจกฟรี" : `฿${item.price.toLocaleString()}`;
                    const statusLabel = item.status === "available" ? "ว่าง" : "ขายแล้ว";
                    const statusColor = item.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";

                    return (
                      <Link
                        key={item.item_id}
                        href={`/items/${item.item_id}`}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-up-purple/30 transition-all"
                      >
                        <div className="aspect-[4/3] relative bg-gray-100">
                          {image ? (
                            <Image
                              src={image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-lg font-bold text-up-purple">{priceText}</span>
                            <time className="text-xs text-gray-400" dateTime={item.created_at}>
                              {formatDate(item.created_at)}
                            </time>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};