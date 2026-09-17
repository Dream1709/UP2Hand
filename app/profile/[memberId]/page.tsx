import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

interface ProfileMember {
  member_id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  is_banned: boolean;
  created_at: string;
}

interface ReviewWithReviewer {
  review_id: number;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    member_id: string;
    name: string;
    avatar_url: string | null;
  };
}

async function getProfile(memberId: string) {
  const supabase = await createClient();

  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("*")
    .eq("member_id", memberId)
    .single();

  if (memberError || !member) {
    return null;
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id (member_id, name, avatar_url)
    `)
    .eq("reviewee_id", memberId)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    console.error("Reviews fetch error:", reviewsError);
  }

  const { data: items } = await supabase
    .from("items")
    .select("item_id, title, price, status, created_at, item_images(image_url)")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(10);

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return {
    member: member as ProfileMember,
    reviews: (reviews as ReviewWithReviewer[]) || [],
    items: items || [],
    avgRating,
    reviewCount: reviews?.length || 0,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const resolvedParams = await params;
  const profile = await getProfile(resolvedParams.memberId);

  if (!profile) {
    notFound();
  }

  return <ProfileClient profile={profile} />;
}