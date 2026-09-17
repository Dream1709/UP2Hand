import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatListClient from "./ChatListClient";

async function getConversations(userId: string) {
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

  return (data as unknown as any[])?.map((conv) => {
    const item = Array.isArray(conv.item) ? conv.item[0] : conv.item;
    const member = Array.isArray(conv.member) ? conv.member[0] : conv.member;
    const sortedMessages = (conv.messages || []).sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const lastMessage = sortedMessages[0] || null;
    const unreadCount = sortedMessages.filter(
      (m: any) => m.sender_id !== userId
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