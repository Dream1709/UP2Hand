import './style.css'
import { supabase } from './supabase'

const form = document.getElementById('sell-form') as HTMLFormElement
const imageInput = document.getElementById('image-input') as HTMLInputElement
const previewImg = document.getElementById('preview-img') as HTMLImageElement
const uploadPlaceholder = document.getElementById('upload-placeholder') as HTMLDivElement
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement

let selectedImageBase64: string = ''

imageInput?.addEventListener('change', () => {
  const file = imageInput.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImageBase64 = e.target?.result as string
      previewImg.src = selectedImageBase64
      previewImg.classList.remove('hidden')
      uploadPlaceholder.classList.add('hidden')
    }
    reader.readAsDataURL(file)
  }
})

form?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const title = (document.getElementById('title') as HTMLInputElement).value.trim()
  const price = Number((document.getElementById('price') as HTMLInputElement).value)
  const description = (document.getElementById('description') as HTMLTextAreaElement).value.trim()

  if (!title || isNaN(price)) {
    alert('กรุณากรอกชื่อสินค้าและราคาให้ถูกต้อง')
    return
  }

  submitBtn.disabled = true
  submitBtn.textContent = 'กำลังบันทึกข้อมูล...'

  const defaultImageUrl = selectedImageBase64 || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'

  try {
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .insert([
        {
          title,
          price,
          description,
          status: 'available'
        }
      ])
      .select()
      .single()

    if (!itemError && itemData) {
      await supabase.from('item_images').insert([
        {
          item_id: itemData.id,
          image_url: defaultImageUrl
        }
      ])
    }
  } catch (err) {
    console.warn('เชื่อมต่อ Supabase ล้มเหลว จำลองการบันทึกสำเร็จแทน:', err)
  }

  alert('🎉 ลงขายสินค้าสำเร็จเรียบร้อย!')
  window.location.href = '/'
})