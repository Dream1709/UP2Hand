"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AdminItem {
  item_id: number;
  title: string;
  price: number;
  status: string;
  created_at: string;
  member: { name: string; email: string } | null;
}

interface AdminMember {
  member_id: string;
  name: string;
  email: string;
  role: string;
  is_banned: boolean;
  created_at: string;
}

interface AdminDashboardClientProps {
  items: AdminItem[];
  members: AdminMember[];
}

export default function AdminDashboardClient({ items: initialItems, members: initialMembers }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"items" | "members">("items");
  const [items, setItems] = useState(initialItems);
  const [members, setMembers] = useState(initialMembers);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const supabase = createClient();

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("ต้องการลบสินค้านี้ใช่หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้")) return;

    setIsLoading(`delete-item-${itemId}`);
    const { error } = await supabase.from("items").delete().eq("item_id", itemId);
    if (error) {
      console.error("Delete item error:", error);
      alert("ลบสินค้าไม่สำเร็จ");
    } else {
      setItems((prev) => prev.filter((item) => item.item_id !== itemId));
    }
    setIsLoading(null);
  };

  const handleToggleBan = async (memberId: string, currentStatus: boolean) => {
    const action = currentStatus ? "ปลดบังคับ" : "ระงับ";
    if (!confirm(`ต้องการ${action}บัญชีผู้ใช้นี้ใช่หรือไม่?`)) return;

    setIsLoading(`ban-${memberId}`);
    const { error } = await supabase
      .from("members")
      .update({ is_banned: !currentStatus })
      .eq("member_id", memberId);

    if (error) {
      console.error("Toggle ban error:", error);
      alert(`${action}บัญชีไม่สำเร็จ`);
    } else {
      setMembers((prev) =>
        prev.map((m) => (m.member_id === memberId ? { ...m, is_banned: !currentStatus } : m))
      );
    }
    setIsLoading(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const priceText = (price: number) => (price === 0 ? "แจกฟรี" : `฿${price.toLocaleString()}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-up-purple">แอดมินแดชบอร์ด</h1>
          <p className="mt-1 text-gray-600">จัดการสินค้าและสมาชิกในระบบ</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-8" aria-label="Admin tabs">
            <button
              onClick={() => setActiveTab("items")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "items"
                  ? "border-up-purple text-up-purple"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              จัดการสินค้า ({items.length})
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "members"
                  ? "border-up-purple text-up-purple"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              จัดการสมาชิก ({members.length})
            </button>
          </nav>
        </div>

        {activeTab === "items" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้ขาย</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่โพสต์</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        ไม่มีสินค้าในระบบ
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.item_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 truncate max-w-xs">{item.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{item.member?.name || "ไม่ทราบ"}</div>
                          <div className="text-sm text-gray-500">{item.member?.email || "-"}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium">{item.price === 0 ? "แจกฟรี" : `฿${item.price.toLocaleString()}`}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.status === "available" ? "ว่าง" : "ขายแล้ว"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString("th-TH")}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteItem(item.item_id)}
                            disabled={isLoading === `delete-item-${item.item_id}`}
                            className="text-red-600 hover:text-red-900 font-medium text-sm disabled:opacity-50"
                          >
                            {isLoading === `delete-item-${item.item_id}` ? "กำลังลบ..." : "ลบ"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สมาชิก</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อีเมล</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บทบาท</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สมัครเมื่อ</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        ไม่มีสมาชิกในระบบ
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr key={member.member_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{member.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {member.role === "admin" ? "แอดมิน" : "สมาชิก"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.is_banned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}>
                            {member.is_banned ? "ถูกระงับ" : "ปกติ"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(member.created_at).toLocaleDateString("th-TH")}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleToggleBan(member.member_id, member.is_banned)}
                            disabled={isLoading === `ban-${member.member_id}`}
                            className={`text-sm font-medium ${member.is_banned ? "text-green-600 hover:text-green-900" : "text-red-600 hover:text-red-900"} disabled:opacity-50`}
                          >
                            {isLoading === `ban-${member.member_id}` ? "กำลังดำเนินการ..." : (member.is_banned ? "ปลดบังคับ" : "ระงับ")}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}