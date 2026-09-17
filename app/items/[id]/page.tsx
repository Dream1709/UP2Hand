import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ItemWithSeller } from "@/types/database";
import ItemDetailClient from "./ItemDetailClient";

async function getItem(id: number): Promise<ItemWithSeller | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .select(`
      *,
      item_images(*),
      member:member_id (
        member_id,
        name,
        email,
        avatar_url,
        role,
        created_at
      )
    `)
    .eq("item_id", id)
    .single();

  if (error || !data) {
    return null;
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewee_id", data.member.member_id);

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    ...data,
    member: {
      ...data.member,
      avg_rating: avgRating,
      review_count: reviews?.length || 0,
    },
  } as ItemWithSeller;
}

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    notFound();
  }

  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return <ItemDetailClient item={item} />;
}