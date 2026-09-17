import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect_to=/admin");
  }

  const { data: member } = await supabase
    .from("members")
    .select("role, is_banned")
    .eq("member_id", user.id)
    .single();

  if (!member || member.role !== "admin" || member.is_banned) {
    redirect("/");
  }

  return user.id;
}

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

async function getAdminData() {
  const supabase = await createClient();

  const [{ data: items }, { data: members }] = await Promise.all([
    supabase
      .from("items")
      .select(`
        item_id,
        title,
        price,
        status,
        created_at,
        member:member_id (name, email)
      `)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("members")
      .select("member_id, name, email, role, is_banned, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const formattedItems: AdminItem[] = (items || []).map((item: any) => ({
    item_id: item.item_id,
    title: item.title,
    price: item.price,
    status: item.status,
    created_at: item.created_at,
    member: Array.isArray(item.member) ? item.member[0] : item.member,
  }));

  return { items: formattedItems, members: members || [] };
}

export default async function AdminPage() {
  await checkAdmin();
  const { items, members } = await getAdminData();

  return <AdminDashboardClient items={items} members={members} />;
}