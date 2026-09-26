import './style.css'
import { supabase } from './supabase'

const container = document.getElementById('item-container') as HTMLDivElement

const urlParams = new URLSearchParams(window.location.search)
const itemId = urlParams.get('id')

const fallbackDetails: Record<string, any> = {
  '1': {
    title: 'iPad Air 5 64GB สภาพดี มีเคสแถม นัดรับหน้ามอได้',
    price: 13500,
    status: 'available',
    description: 'สภาพ 98% ไร้รอยตกหล่น ใช้งานเรียนเลกเชอร์อย่างเดียว อุปกรณ์ครบกล่อง แถมเคสแม่เหล็กอย่างดี นัดรับตรวจเช็คเครื่องได้ที่หน้ามอหรือตึก ICT ครับ',
    location: 'หน้ามอ พะเยา',
    seller: 'กิตติศักดิ์ (นิสิต ICT)',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80'
  }
}

async function loadItemDetail() {
  if (!itemId) {
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-red-500 font-medium">ไม่พบรหัสสินค้า</p>
        <a href="/" class="text-purple-600 underline text-sm mt-2 inline-block">กลับหน้าแรก</a>
      </div>`
    return
  }

  const { data, error } = await supabase
    .from('items')
    .select('*, item_images(image_url), members(full_name, contact_info)')
    .eq('id', itemId)
    .single()

  const item = (!error && data) ? data : fallbackDetails[itemId] || {
    title: `สินค้ารหัส #${itemId}`,
    price: 990,
    status: 'available',
    description: 'รายละเอียดสินค้าตัวอย่าง',
    location: 'มหาวิทยาลัยพะเยา',
    seller: 'นิสิต ม.พะเยา',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  }

  renderDetail(item)
}

function renderDetail(item: any) {
  const imageUrl = item.image || item.item_images?.[0]?.image_url || 'https://placehold.co/600x400?text=UP2Hand'
  const formattedPrice = new Intl.NumberFormat('th-TH').format(item.price)

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <!-- Image Section (จำกัดขนาดและล็อกความกว้างสูงสุด) -->
      <div class="w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
        <img 
          src="${imageUrl}" 
          alt="${item.title}" 
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Details Section -->
      <div class="flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 text-xs font-bold rounded-md ${
              item.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
            }">
              ${item.status === 'available' ? 'พร้อมส่งต่อ' : 'ขายแล้ว'}
            </span>
            <span class="text-xs text-slate-500">📍 ${item.location || 'ใน ม.พะเยา'}</span>
          </div>

          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">${item.title}</h1>
          <p class="text-2xl sm:text-3xl font-extrabold text-purple-800">฿${formattedPrice}</p>

          <div class="border-t border-slate-100 pt-4">
            <h3 class="text-sm font-semibold text-slate-700 mb-2">รายละเอียดสินค้า</h3>
            <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">${item.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
          </div>

          <div class="border-t border-slate-100 pt-4">
            <h3 class="text-sm font-semibold text-slate-700 mb-1">ข้อมูลผู้ลงขาย</h3>
            <p class="text-sm text-slate-600 font-medium">👤 ${item.seller || item.members?.full_name || 'นิสิต ม.พะเยา'}</p>
          </div>
        </div>

        <div class="pt-4">
          <button class="w-full py-3.5 px-6 rounded-xl bg-purple-700 hover:bg-purple-800 text-amber-300 font-bold text-sm shadow-md hover:shadow-lg transition">
            💬 ทักแชทสอบถาม / นัดรับ
          </button>
        </div>
      </div>
    </div>
  `
}

loadItemDetail()