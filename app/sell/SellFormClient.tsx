"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PreviewImage {
  file: File;
  preview: string;
}

export default function SellFormClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews: PreviewImage[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }
      const preview = URL.createObjectURL(file);
      newPreviews.push({ file, preview });
    }

    setPreviewImages((prev) => {
      const combined = [...prev, ...newPreviews];
      return combined.slice(0, 5);
    });
    setError(null);
  };

  const removeImage = (index: number) => {
    setPreviewImages((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("กรุณากรอกชื่อสินค้า");
      return;
    }
    if (!price) {
      setError("กรุณากรอกราคา");
      return;
    }
    if (Number(price) < 0) {
      setError("ราคาต้องไม่น้อยกว่า 0");
      return;
    }
    if (previewImages.length === 0) {
      setError("กรุณาอัปโหลดรูปภาพสินค้าอย่างน้อย 1 รูป");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("price", price);
      formData.append("description", description.trim());
      previewImages.forEach((img) => formData.append("images", img.file));

      const response = await fetch("/api/items", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "สร้างประกาศไม่สำเร็จ");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/items/${result.item_id}`);
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">โพสต์สำเร็จ!</h2>
          <p className="mt-2 text-gray-600">กำลังนำคุณไปยังหน้าสินค้า...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-up-purple">+ ลงขายสินค้า</h1>
          <p className="mt-2 text-gray-600">กรอกข้อมูลสินค้าของคุณ ใช้เวลาไม่เกิน 1 นาที</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6" noValidate>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อสินค้า <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น พัดลมโต๊ะ Sharp, ตู้เย็น 2 ประตู, หนังสือเรียน Calculus"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-up-purple focus:outline-none focus:ring-2 focus:ring-up-purple/20 transition-all"
              maxLength={150}
              required
            />
            <p className="mt-1 text-sm text-gray-500">{title.length}/150 ตัวอักษร</p>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              ราคา (บาท) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:border-up-purple focus:outline-none focus:ring-2 focus:ring-up-purple/20 transition-all"
                required
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">ใส่ 0 หากต้องการแจกฟรี</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดสินค้า
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="อธิบายรายละเอียดสินค้า เช่น สภาพ เบอร์โมเดล อายุการใช้งาน เหตุผลที่ขาย วิธีการรับส่ง ฯลฯ"
              rows={5}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-up-purple focus:outline-none focus:ring-2 focus:ring-up-purple/20 transition-all resize-y"
              maxLength={2000}
            />
            <p className="mt-1 text-sm text-gray-500">{description.length}/2000 ตัวอักษร</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปภาพสินค้า <span className="text-red-500">*</span> (1-5 รูป, รูปละไม่เกิน 5MB)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-up-purple transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="sr-only"
                id="image-upload"
                disabled={previewImages.length >= 5}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-gray-600">
                    {previewImages.length >= 5 ? "อัปโหลดได้สูงสุด 5 รูป" : "คลิกหรือลากไฟล์รูปภาพมาไว้ที่นี่"}
                  </p>
                  <p className="text-sm text-gray-400">รองรับ JPG, PNG, WebP ขนาดไม่เกิน 5MB/รูป</p>
                </div>
              </label>
            </div>

            {previewImages.length > 0 && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={img.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 rounded-full bg-red-500/90 p-1 text-white hover:bg-red-600 transition-colors"
                      aria-label={`ลบรูปที่ ${index + 1}`}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-up-gold px-6 py-3 text-base font-semibold text-up-purple hover:bg-up-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "กำลังสร้าง..." : "สร้างประกาศขาย"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}