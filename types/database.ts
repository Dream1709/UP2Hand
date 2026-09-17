export type MemberRole = 'member' | 'admin'

export interface Member {
  member_id: string
  name: string
  email: string
  avatar_url: string | null
  role: MemberRole
  is_banned: boolean
  created_at: string
}

export type ItemStatus = 'available' | 'sold'

export interface Item {
  item_id: number
  member_id: string
  title: string
  description: string | null
  price: number
  status: ItemStatus
  created_at: string
}

export interface ItemImage {
  image_id: number
  item_id: number
  image_url: string
  created_at: string
}

export interface Conversation {
  conversation_id: number
  item_id: number
  member_id: string
  created_at: string
}

export interface Message {
  message_id: number
  conversation_id: number
  sender_id: string
  message_text: string
  created_at: string
}

export interface Review {
  review_id: number
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

export interface ItemWithImages extends Item {
  item_images: ItemImage[]
}

export interface ItemWithSeller extends Item {
  item_images: ItemImage[]
  member: Pick<Member, 'member_id' | 'name' | 'avatar_url' | 'role'>
}

export interface ConversationWithDetails extends Conversation {
  item: Pick<Item, 'item_id' | 'title' | 'price' | 'status'>
  member: Pick<Member, 'member_id' | 'name' | 'avatar_url'>
  last_message?: Message
}

export interface MessageWithSender extends Message {
  sender: Pick<Member, 'member_id' | 'name' | 'avatar_url'>
}

export interface ReviewWithReviewer extends Review {
  reviewer: Pick<Member, 'member_id' | 'name' | 'avatar_url'>
}