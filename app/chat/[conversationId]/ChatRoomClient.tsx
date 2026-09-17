"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface ChatMessage {
  message_id: number | string;
  conversation_id?: number;
  sender_id: string;
  message_text: string;
  created_at: string;
  sender: {
    member_id: string;
    name: string;
    avatar_url: string | null;
  };
}

interface ChatRoomClientProps {
  conversation: {
    conversation_id: number;
    item_id: number;
    member_id: string;
    created_at: string;
    item: {
      item_id: number;
      title: string;
      price: number;
      status: string;
      member_id: string;
      item_images: { image_url: string }[];
    } | null;
    member: {
      member_id: string;
      name: string;
      avatar_url: string | null;
    } | null;
    messages: ChatMessage[];
  };
  currentUserId: string;
}

export default function ChatRoomClient({ conversation, currentUserId }: ChatRoomClientProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${conversation.conversation_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.conversation_id}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.message_id === newMsg.message_id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversation.conversation_id, supabase]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const tempId = `temp-${Date.now()}`;
    const tempMessage: ChatMessage = {
      message_id: tempId,
      conversation_id: conversation.conversation_id,
      sender_id: currentUserId,
      message_text: newMessage.trim(),
      created_at: new Date().toISOString(),
      sender: { member_id: currentUserId, name: "คุณ", avatar_url: null },
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    const { error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.conversation_id,
        sender_id: currentUserId,
        message_text: newMessage.trim(),
      });

    if (error) {
      console.error("Send message error:", error);
      setMessages((prev) => prev.filter((m) => m.message_id !== tempId));
      alert("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่");
    }

    setIsSending(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("th-TH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getItemImage = () => {
    return conversation.item?.item_images?.[0]?.image_url;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex h-16 items-center gap-4">
            <Link href="/chat" className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
              {getItemImage() ? (
                <img src={getItemImage()} alt={conversation.item?.title || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-up-purple/10">
                  <svg className="h-5 w-5 text-up-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{conversation.item?.title || "สินค้าถูกลบ"}</p>
              <p className="text-sm text-gray-500 truncate">
                {conversation.member?.member_id === currentUserId ? conversation.item?.member_id : conversation.member?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-xs text-gray-500">{isConnected ? "ออนไลน์" : "กำลังเชื่อมต่อ..."}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg) => {
            const isOwn = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.message_id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[70%] gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  {!isOwn && (
                    <div className="relative h-8 w-8 rounded-full bg-gray-100 flex-shrink-0">
                      {msg.sender?.avatar_url ? (
                        <img src={msg.sender.avatar_url} alt={msg.sender.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-up-purple/10">
                          <span className="text-sm font-bold text-up-purple">
                            {msg.sender.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                    {!isOwn && (
                      <span className="text-xs text-gray-500 mb-1 px-1">{msg.sender.name}</span>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-up-purple text-white rounded-tr-none"
                          : "bg-white text-gray-900 rounded-tl-none shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.message_text}</p>
                    </div>
                    <span className={`text-xs mt-1 px-1 ${isOwn ? "text-blue-500" : "text-gray-400"}`}>
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                  {isOwn && (
                    <div className="relative h-8 w-8 rounded-full bg-up-purple/10 flex-shrink-0">
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-sm font-bold text-up-purple">คุณ</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <form onSubmit={handleSend} className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="mx-auto max-w-3xl flex items-end gap-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            rows={1}
            maxLength={1000}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-up-purple focus:outline-none focus:ring-2 focus:ring-up-purple/20 resize-none"
            disabled={isSending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="flex-shrink-0 rounded-xl bg-up-purple px-6 py-3 text-white font-medium hover:bg-up-purple-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ส่ง
          </button>
        </div>
      </form>
    </div>
  );
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("th-TH", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const getItemImage = (conversation: ChatRoomClientProps["conversation"]) => {
  return conversation.item?.item_images?.[0]?.image_url;
};