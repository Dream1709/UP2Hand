# UP 2 Hand – Granular Task Plan

## Phase 1: Environment & Supabase Setup
- [x] 1.1 สร้าง Next.js + Tailwind v4 + ติดตั้ง @supabase/supabase-js @supabase/ssr
- [x] 1.2 วางไฟล์ `supabase/schema.sql` (จากโครงสร้าง 6 ตารางที่เราสรุปไว้)
- [x] 1.3 สร้างไฟล์ `.env.local` และ `.env.example`
- [x] 1.4 สร้าง Supabase Client utilities (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- [x] 1.5 สร้าง TypeScript Interfaces สำหรับฐานข้อมูล (`types/database.ts`)

## Phase 2: Authentication & User Profile
- [x] 2.1 ทำ Navbar/Header พร้อมปุ่ม Login และโลโก้สไตล์ UP 2 Hand
- [x] 2.2 ทำ Login Modal / Screen สำหรับเข้าสู่ระบบด้วย UP Mail (Google OAuth)
- [x] 2.3 ตั้งค่า Supabase Auth Flow (Google OAuth เป็นหลัก) และตัวกรองโดเมน `@up.ac.th`
- [x] 2.4 ทำ Auth Callback Route (`/auth/callback`)
- [ ] 2.5 ทำ Middleware ตรวจสอบ Session และสถานะ `is_banned`

## Phase 3: Feed & Browse (หน้าแรก)
- [ ] 3.1 สร้างคอมโพเนนต์ `ItemCard` (รูปภาพ, ชื่อ, ราคา, สถานะ, วันที่)
- [ ] 3.2 สร้าง Skeleton Loading และ Empty State สำหรับรายการสินค้า
- [ ] 3.3 ทำหน้าแรกดึงรายการสินค้าล่าสุดจากตาราง `items` (พร้อม fallback mock 8 ชิ้น)
- [ ] 3.4 ทำช่อง Search ค้นหาชื่อสินค้า พร้อมระบบ Debounce 300ms

## Phase 4: Item Details & Seller Info
- [ ] 4.1 สร้างหน้าไดนามิก `/items/[id]` แสดงข้อมูลสินค้าแบบละเอียด
- [ ] 4.2 ทำ Image Carousel/Gallery สำหรับดูรูปภาพสินค้าหลายรูป
- [ ] 4.3 ทำกล่องโปรไฟล์ผู้ขาย พร้อมคะแนนดาวเฉลี่ย
- [ ] 4.4 ทำปุ่ม "ทักแชทผู้ขาย" (เชื่อมโยงสิทธิ์เฉพาะคนที่ล็อกอินแล้ว)

## Phase 5: Listing Creation (ฟอร์มลงขาย)
- [ ] 5.1 สร้างหน้าฟอร์ม `/sell` (ชื่อสินค้า, ราคา, คำอธิบาย)
- [ ] 5.2 ทำ Component อัปโหลดรูปภาพสินค้า (พรีวิวรูปได้ 1-5 รูป)
- [ ] 5.3 ทำฟังก์ชันอัปโหลดรูปไปยัง Supabase Storage Bucket (`item-images`)
- [ ] 5.4 ทำ Server Action บันทึกข้อมูลลงตาราง `items` และ `item_images`

## Phase 6: In-App Realtime Chat
- [ ] 6.1 สร้างหน้ากล่องข้อความรวม `/chat` (แสดงลิสต์ห้องจาก `conversations`)
- [ ] 6.2 ทำหน้าห้องแชทเดี่ยว `/chat/[conversationId]` และดึงข้อความย้อนหลัง
- [ ] 6.3 ทำช่องพิมพ์ส่งข้อความและบันทึกลงตาราง `messages`
- [ ] 6.4 เชื่อมต่อ Supabase Realtime Channel ให้ข้อความใหม่เด้งสดโดยไม่ต้องรีเฟรช

## Phase 7: Reviews & Ratings
- [ ] 7.1 ทำ Modal ให้คะแนน (ดาว 1-5) และพิมพ์คอมเมนต์หลังปิดการขาย
- [ ] 7.2 ทำ Server Action บันทึกลงตาราง `reviews` (ป้องกันการรีวิวตัวเอง)
- [ ] 7.3 แสดงผลประวัติรีวิวและคะแนนสะสมในหน้า Profile ของผู้ใช้

## Phase 8: Admin & Moderation
- [ ] 8.1 สร้าง Route Guard สำหรับหน้า `/admin` (ตรวจ role == 'admin')
- [ ] 8.2 หน้ารายการสินค้าทั้งหมด พร้อมปุ่มให้ Admin ลบโพสต์ที่ทำผิดกฎ
- [ ] 8.3 หน้ารายชื่อสมาชิก พร้อมปุ่มกดระงับบัญชี (`is_banned = true`)

## Phase 9: Final Polish & Audit
- [ ] 9.1 ปรับแต่ง Responsive ให้รองรับทั้ง Desktop และ Mobile
- [ ] 9.2 ทดสอบรัน `npm run build` และเคลียร์ TypeScript / Linter Warnings ทั้งหมด
- [ ] 9.3 ทำ Git Tag หรือ Final Release Commit
