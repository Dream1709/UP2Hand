"use client";

import Link from "next/link";

interface ConversationItem {
  item_id: number;
  title: string;
  price: number;
  status: string;
  item_images: { image_url: string }[];
  member_id: string;
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
  item_id: number;
  member_id: string;
  created_at: string;
  item: ConversationItem | null;
  member: ConversationMember | null;
  last_message: ConversationMessage | null;
  unread_count: number;
}

interface ChatListClientProps {
  conversations: ConversationData[];
  currentUserId: string;
}

export default function ChatListClient({ conversations, currentUserId }: ChatListClientProps) {
  const getLastMessageText = (conv: ConversationData) => {
    if (!conv.last_message) return "ยังไม่มีข้อความ";
    const isOwn = conv.last_message.sender_id === currentUserId;
    return `${isOwn ? "คุณ: " : ""}${conv.last_message.message_text}`;
  };

  const getLastMessageTime = (conv: ConversationData) => {
    if (!conv.last_message) return "";
    return new Date(conv.last_message.created_at).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getItemImage = (conv: ConversationData) => {
    return conv.item?.item_images?.[0]?.image_url;
  };

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">ยังไม่มีการสนทนา</h2>
          <p className="mt-2 text-gray-600">เริ่มแชทกับผู้ขายจากหน้าสินค้าที่คุณสนใจ</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 text-up-purple font-medium hover:underline">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-up-purple">กล่องข้อความ</h1>
          <p className="mt-1 text-gray-600">การสนทนาทั้งหมดของคุณ</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {conversations.map((conv) => {
            const itemImage = getItemImage(conv);
            const lastMessageText = getLastMessageText(conv);
            const lastMessageTime = getLastMessageTime(conv);
            const itemStatus = conv.item?.status === "sold" ? " (ขายแล้ว)" : "";

            return (
              <Link
                key={conv.conversation_id}
                href={`/chat/${conv.conversation_id}`}
                className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="relative h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {itemImage ? (
                    <img src={itemImage} alt={conv.item?.title || "Item"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-up-purple/10">
                      <svg className="h-7 w-7 text-up-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {conv.item?.status === "sold" && (
                    <span className="absolute bottom-0 right-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-tr-xl rounded-bl-md">
                      ขายแล้ว
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {conv.item?.title || "สินค้าถูกลบ"} {itemStatus}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        กับ {conv.member?.name || "ไม่ทราบผู้ขาย"}
                      </p>
                    </div>
                    <time className="text-xs text-gray-400 whitespace-nowrap" dateTime={conv.last_message?.created_at || conv.created_at}>
                      {lastMessageTime}
                    </time>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{lastMessageText}</p>
                    {conv.unread_count > 0 && (
                      <span className="flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-up-purple text-white text-xs font-medium">
                        {conv.unread_count > 9 ? "9+" : conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const getLastMessageText = (conv: ConversationData, currentUserId: string) => {
  if (!conv.last_message) return "ยังไม่มีข้อความ";
  const isOwn = conv.last_message.sender_id === currentUserId;
  return `${isOwn ? "คุณ: " : ""}${conv.last_message.message_text}`;
};

const getLastMessageTime = (conv: ConversationData) => {
  if (!conv.last_message) return "";
  return new Date(conv.last_message.created_at).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getItemImage = (conv: ConversationData) => {
  return conv.item?.item_images?.[0]?.image_url;
};