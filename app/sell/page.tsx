import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SellFormClient from "./SellFormClient";

export default async function SellPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect_to=/sell`);
  }

  const { data: member } = await supabase
    .from("members")
    .select("is_banned")
    .eq("member_id", user.id)
    .single();

  if (member?.is_banned) {
    redirect("/login?error=บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ");
  }

  return <SellFormClient userId={user.id} />;
}