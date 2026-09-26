import './style.css'
import { supabase } from './supabase'

interface Item {
  id: number
  title: string
  price: number
  status: string
  created_at: string
  location?: string
  item_images?: { image_url: string }[]
}

const fallbackItems: Item[] = [
  {
    id: 1,
    title: 'iPad Air 5 64GB สภาพดี มีเคสแถม นัดรับหน้ามอได้',
    price: 13500,
    status: 'available',
    created_at: '10 นาทีที่แล้ว',
    location: 'หน้ามอ',
    item_images: [{ image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80' }]
  },
  {
    id: 2,
    title: 'เนคไท + เข็มขัด มหาวิทยาลัยพะเยา ชาย สภาพ 95%',
    price: 120,
    status: 'available',
    created_at: '30 นาทีที่แล้ว',
    location: 'ตึก PKY',
    item_images: [{ image_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80' }]
  },
  {
    id: 3,
    title: 'พัดลม Hatari 16 นิ้ว ลมแรง สภาพดี ย้ายหอส่งต่อด่วน',
    price: 350,
    status: 'available',
    created_at: '2 ชั่วโมงที่แล้ว',
    location: 'หอพักหน้าป้าย มพ.',
    item_images: [{ image_url: 'https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=600&auto=format&fit=crop&q=80' }]
  },
  {
    id: 4,
    title: 'หนังสือ Calculus for Engineers พร้อมชีทสรุปข้อสอบเก่า',
    price: 180,
    status: 'available',
    created_at: 'เมื่อวาน',
    location: 'ตึก ICT',
    item_images: [{ image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' }]
  },
  {
    id: 5,
    title: 'ตู้เย็นมินิบาร์ 1.7 คิว ประหยัดไฟ ย้ายหอพัก',
    price: 1600,
    status: 'sold',
    created_at: '2 วันที่แล้ว',
    location: 'หอใน มพ.',
    item_images: [{ image_url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&auto=format&fit=crop&q=80' }]
  }
]

const itemsGrid = document.getElementById('items-grid') as HTMLDivElement
const itemCount = document.getElementById('item-count') as HTMLSpanElement
const searchInput = document.getElementById('search-input') as HTMLInputElement
const mobileSearchInput = document.getElementById('mobile-search-input') as HTMLInputElement

function renderItems(items: Item[]) {
  if (itemCount) itemCount.textContent = `${items.length} ชิ้น`

  if (items.length === 0) {
    itemsGrid.innerHTML = `
      <div class="col-span-full text-center py-16">
        <p class="text-slate-600 font-medium">ไม่พบสินค้าที่คุณค้นหา</p>
        <p class="text-slate-400 text-xs mt-1">ลองค้นหาด้วยคำอื่น เช่น หนังสือ หรือ พัดลม</p>
      </div>`
    return
  }

  itemsGrid.innerHTML = items
    .map((item) => {
      const cover = item.item_images?.[0]?.image_url || 'https://placehold.co/400x400?text=UP2Hand'
      const isAvailable = item.status === 'available'
      const formattedPrice = new Intl.NumberFormat('th-TH').format(item.price)

      return `
        <a href="/item.html?id=${item.id}" class="group bg-white rounded-xl border border-slate-200 hover:border-purple-300 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
          <div class="aspect-square bg-slate-100 overflow-hidden relative">
            <img 
              src="${cover}" 
              alt="${item.title}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <span class="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-md shadow-sm ${
              isAvailable ? 'bg-emerald-600 text-white' : 'bg-slate-600 text-white'
            }">
              ${isAvailable ? 'พร้อมส่งต่อ' : 'ขายแล้ว'}
            </span>
            ${
              item.location
                ? `<span class="absolute bottom-2 left-2 px-1.5 py-0.5 text-[10px] font-medium bg-black/60 text-white rounded backdrop-blur-sm">📍 ${item.location}</span>`
                : ''
            }
          </div>
          <div class="p-3 flex flex-col flex-1 justify-between gap-2">
            <h3 class="font-medium text-slate-800 text-xs sm:text-sm line-clamp-2 group-hover:text-purple-700 transition leading-snug">
              ${item.title}
            </h3>
            <div class="pt-1 border-t border-slate-100 flex items-baseline justify-between">
              <span class="text-purple-800 font-bold text-sm sm:text-base">฿${formattedPrice}</span>
              <span class="text-[10px] text-slate-400">${item.created_at}</span>
            </div>
          </div>
        </a>
      `
    })
    .join('')
}

async function loadItems(keyword: string = '') {
  try {
    let query = supabase
      .from('items')
      .select('id, title, price, status, created_at, item_images(image_url)')
      .order('created_at', { ascending: false })

    if (keyword.trim()) {
      query = query.ilike('title', `%${keyword}%`)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      const filtered = fallbackItems.filter((i) =>
        i.title.toLowerCase().includes(keyword.toLowerCase())
      )
      renderItems(filtered)
    } else {
      renderItems(data)
    }
  } catch {
    renderItems(fallbackItems)
  }
}

const bindSearch = (input: HTMLInputElement) => {
  let timer: number
  input?.addEventListener('input', (e) => {
    clearTimeout(timer)
    const val = (e.target as HTMLInputElement).value
    timer = window.setTimeout(() => loadItems(val), 300)
  })
}

bindSearch(searchInput)
bindSearch(mobileSearchInput)

loadItems()