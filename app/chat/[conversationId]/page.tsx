import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ChatRoomClient from "./ChatRoomClient";

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
  sender: ConversationMember | null;
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

async function getConversation(conversationId: number, userId: string) {
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
        created_at,
        sender:sender_id (
          member_id,
          name,
          avatar_url
        )
      )
    `)
    .eq("conversation_id", conversationId)
    .single();

  if (error || !data) {
    return null;
  }

  const conversation = data as unknown as ConversationData;
  const item = Array.isArray(conversation.item) ? conversation.item[0] : conversation.item;
  const member = Array.isArray(conversation.member) ? conversation.member[0] : conversation.member;

  const isParticipant = member?.member_id === userId || item?.member_id === userId;
  if (!isParticipant) {
    return null;
  }

  const sortedMessages = (conversation.messages || []).sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const messages = sortedMessages.map((msg) => ({
    message_id: msg.message_id,
    conversation_id: conversation.conversation_id,
    sender_id: msg.sender_id,
    message_text: msg.message_text,
    created_at: msg.created_at,
    sender: msg.sender || { member_id: msg.sender_id, name: "ไม่ทราบ", avatar_url: null },
  }));

  return {
    conversation_id: conversation.conversation_id,
    item_id: conversation.item_id,
    member_id: conversation.member_id,
    created_at: conversation.created_at,
    item,
    member,
    messages,
  };
}

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const resolvedParams = await params;
  const conversationId = Number(resolvedParams.conversationId);

  if (isNaN(conversationId)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect_to=/chat/${conversationId}`);
  }

  const conversation = await getConversation(conversationId, user.id);

  if (!conversation) {
    notFound();
  }

  return <ChatRoomClient conversation={conversation} currentUserId={user.id} />;
}