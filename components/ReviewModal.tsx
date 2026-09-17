"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
  revieweeId: string;
  itemTitle: string;
  isBuyer: boolean;
}

export default function ReviewModal({ isOpen, onClose, itemId, revieweeId, itemTitle, isBuyer }: ReviewModalProps) {
  if (!isOpen) return null;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("กรุณาเลือกคะแนนดาว");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({
      reviewer_id: (await supabase.auth.getUser()).data.user?.id,
      reviewee_id: revieweeId,
      rating,
      comment: comment.trim() || null,
    });

    if (error) {
      console.error("Review error:", error);
      if (error.code === "23505") {
        setError("คุณได้ให้คะแนนรายการนี้ไปแล้ว");
      } else {
        setError("ส่งรีวิวไม่สำเร็จ กรุณาลองใหม่");
      }
      setIsSubmitting(false);
      return;
    }

    onClose();
    setRating(0);
    setComment("");
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">ให้คะแนนและรีวิว</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="ปิด"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {isBuyer ? "คุณเป็นผู้ซื้อ กรุณาให้คะแนนผู้ขาย" : "คุณเป็นผู้ขาย กรุณาให้คะแนนผู้ซื้อ"}
            <br />
            <span className="font-medium">{itemTitle}</span>
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">คะแนน <span className="text-red-500">*</span></label>
              <div className="flex items-center justify-center gap-1" role="radiogroup" aria-label="คะแนนดาว">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-yellow-400 hover:scale-110 transition-transform"
                    aria-label={`${star} ดาว`}
                    aria-checked={rating === star}
                  >
                    <svg
                      className={`h-10 w-10 ${rating >= star ? "fill-current" : ""}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {rating === 0 && <p className="mt-2 text-sm text-red-500">กรุณาเลือกคะแนนดาว</p>}
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                ความคิดเห็น (ไม่บังคับ)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="เขียนความคิดเห็นของคุณ..."
                rows={4}
                maxLength={500}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-up-purple focus:outline-none focus:ring-2 focus:ring-up-purple/20 resize-none"
              />
              <p className="mt-1 text-sm text-gray-500 text-right">{comment.length}/500 ตัวอักษร</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="flex-1 rounded-lg bg-up-purple px-6 py-3 text-base font-semibold text-white hover:bg-up-purple-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}