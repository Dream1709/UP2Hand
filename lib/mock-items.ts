import { ItemWithImages } from "@/types/database";

export const mockItems: ItemWithImages[] = [
  {
    item_id: 1,
    member_id: "mock-user-1",
    title: "พัดลมโต๊ะ รุ่นเล็ก ขาว สะอาด",
    description: "พัดลมโต๊ะยี่ห้อ Sharp ใช้ไม่กี่เดือน สภาพดีมาก มีลมเย็น 3 ระดับ หมุนได้ 360 องศา เหมาะสำหรับหอพักห้องเล็ก",
    price: 250,
    status: "available",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    item_images: [
      { image_id: 1, item_id: 1, image_url: "https://images.unsplash.com/photo-1603398938378-3a0a3d4e4a3d?w=400&h=300&fit=crop", created_at: new Date().toISOString() },
    ],
  },
  {
    item_id: 2,
    member_id: "mock-user-2",
    title: "ตู้เย็น 2 ประตู 160 ลิตร",
    description: "ตู้เย็น Samsung 160 ลิตร สีเงิน ใช้มา 2 ปี สภาพดี ทำความเย็นดี มีช่องแช่แยกต่างหาก ย้ายหอพักใหม่เลยขาย",
    price: 3500,
    status: "available",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    item_images: [
      { image_id: 2, item_id: 2, image_url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop", created_at: new Date().toISOString() },
    ],
  },
  {
    item_id: 3,
    member_id: "mock-user-3",
    title: "โต๊ะญี่ปุ่น ระดับสูง ปรับได้",
    description: "โต๊ะญี่ปุ่นเหล็กแข็งแรง ปรับระดับสูงได้ ใช้เรียนหนังสือ/วาดรูปสะดวกดี มีที่วางปากกาและถาดเก็บของ พับเก็บได้",
    price: 450,
    status: "available",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    item_images: [
      { image_id: 3, item_id: 3, image_url: "https://images.unsplash.com/photo-1593642702821-cfda6e39758f?w=400&h=300&fit=crop", created_at: new Date().toISOString() },
    ],
  },
  {
    item_id: 4,
    member_id: "mock-user-4",
    title: "ชั้นวางหนังสือ 5 ชั้น สีน้ำตาล",
    description: "ชั้นวางหนังสือไม้แข็ง 5 ชั้น สีน้ำตาลอ่อน สวยงาม เหมาะวางหนังสือเรียน ของตกแต่ง หรือกระเป๋า สร้างเสร็จใช้ได้ทันที",
    price: 300,
    status: "available",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    item_images: [
      { image_id: 4, item_id: 4, image_url: "https://images.unsplash.com/photo-1594620302200-9a7e5b5b5b5b?w=400&h=300&fit=crop", created_at: new Date().toISOString() },
    ],
  },
  {
    item_id: 5,
    member_id: "mock-user-5",
    title: "ชุดหนังสือเรียน วิศวกรรม ปี 1-2",
    description: "หนังสือเรียนวิศวกรรมคอมพิวเตอร์ ปี 1-2 ครบชุด (Calculus, Physics, Programming, Digital Logic) สภาพดี ไม่มีขีดเขียน ราคาปกติรวม 3000+",
    price: 800,
    status: "available",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    item_images: [
      { image_id: 5, item_id: 5, image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop", created_at: new Date().toISOString() },
    ],
  },
  {
    item_id: 6,
    member_id: "mock-user-6",
    title: "จักรยานภูเขา 21 สปีด สีดำ/แดง",
    description: "จักรยาน Giant 21 สปีด ใช้เดินทางในมहาวิทยาลัย สภาพดี เบรกดี ยางยังเหลือมาก มีหลอดไฟหน้า-หลัง รวมล็อค",
    price: 2200,
    status: "available",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    item_images: [
      { image_id: 6, item_id: 6, image_url: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop", created_at: new Date().toISOString() },
    ],
  },
  {
    item_id: 7,
    member_id: "mock-user-7",
    title: "หม้อหุงข้าวไฟฟ้า 1.8 ลิตร",
    description: "หม้อหุงข้าว Panasonic 1.8 ลิตร ใช้ทำข้าว/แกง/ต้มยำได้หมด หวานเยอะ มีฟังก์ชัน保温 (เก็บความร้อน) นาน 12 ชม. กล่องครบ",
    price: 600,
    status: "available",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    item_images: [
      { image_id: 7, item_id: 7, image_url: "https://images.unsplash.com/photo-1584990347449-9b3c3c3c3c3c?w=400&h=300&fit=crop", created_at: new Date().toISOString() },
    ],
  },
  {
    item_id: 8,
    member_id: "mock-user-8",
    title: "โคมไฟโต๊ะ LED ปรับความสว่างได้",
    description: "โคมไฟโต๊ะ LED ตาไม่เหนื่อย มี 3 ระดับสว่าง 4 โหมดสี พับเก็บได้ สาย USB ชาร์จได้จากพาวเวอร์แบงก์ หรูหราคุ้มค่า",
    price: 350,
    status: "available",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    item_images: [
      { image_id: 8, item_id: 8, image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop", created_at: new Date().toISOString() },
    ],
  },
];