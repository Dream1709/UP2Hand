import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatListClient from "./ChatListClient";

interface ConversationItem {
  item_id: number;
  title: string;
  price: number;
  status: string;
  member_id: string;
  item_images: { image_url: string }[];
}

interface ConversationMember {
  member_id: string;
  name: string;
  avatar_url: string | null;
}

interface ConversationMessage {
  message_id: number;
  message_text: string;
  sender_id: string;
  created_at: string;
}

interface ConversationData {
  conversation_id: number;
  created_at: string;
  item_id: number;
  member_id: string;
  item: ConversationItem | ConversationItem[] | null;
  member: ConversationMember | ConversationMember[] | null;
  messages: ConversationMessage[] | null;
}

interface FormattedConversation {
  conversation_id: number;
  item_id: number;
  member_id: string;
  created_at: string;
  item: ConversationItem | null;
  member: ConversationMember | null;
  last_message: ConversationMessage | null;
  unread_count: number;
}

async function getConversations(userId: string): Promise<FormattedConversation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(`
      conversation_id,
      created_at,
      item_id,
      member_id,
      item:item_id (
        item_id,
        title,
        price,
        status,
        member_id,
        item_images (image_url)
      ),
      member:member_id (
        member_id,
        name,
        avatar_url
      ),
      messages:messages (
        message_id,
        message_text,
        sender_id,
        created_at
      )
    `)
    .eq("member_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Conversations fetch error:", error);
    return [];
  }

  return (data as unknown as ConversationData[])?.map((conv) => {
    const item = Array.isArray(conv.item) ? conv.item[0] : conv.item;
    const member = Array.isArray(conv.member) ? conv.member[0] : conv.member;
    const sortedMessages = (conv.messages || []).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const lastMessage = sortedMessages[0] || null;
    const unreadCount = sortedMessages.filter(
      (m) => m.sender_id !== userId
    ).length;

    return {
      conversation_id: conv.conversation_id,
      item_id: conv.item_id,
      member_id: conv.member_id,
      created_at: conv.created_at,
      item,
      member,
      last_message: lastMessage,
      unread_count: unreadCount,
    };
  }) || [];
}

export default async function ChatListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect_to=/chat");
  }

  const conversations = await getConversations(user.id);

  return <ChatListClient conversations={conversations} currentUserId={user.id} />;
}