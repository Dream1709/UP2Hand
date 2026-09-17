import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อน" }, { status: 401 });
  }

  const body = await request.json();
  const { reviewee_id, rating, comment } = body;

  if (!reviewee_id) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
  }

  if (user.id === reviewee_id) {
    return NextResponse.json({ error: "ไม่สามารถรีวิวตัวเองได้" }, { status: 400 });
  }

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "คะแนนต้องอยู่ระหว่าง 1-5 ดาว" }, { status: 400 });
  }

  const { error } = await supabase.from("reviews").insert({
    reviewer_id: user.id,
    reviewee_id,
    rating,
    comment: comment?.trim() || null,
  });

  if (error) {
    console.error("Review insert error:", error);
    if (error.code === "23505") {
      return NextResponse.json({ error: "คุณได้ให้คะแนนรายการนี้ไปแล้ว" }, { status: 409 });
    }
    return NextResponse.json({ error: "ส่งรีวิวไม่สำเร็จ" }, { status: 500 });
  }

  return NextResponse.json({ message: "ส่งรีวิวสำเร็จ" });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const revieweeId = searchParams.get("reviewee_id");

  if (!revieweeId) {
    return NextResponse.json({ error: "ต้องระบุ reviewee_id" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id (
        member_id,
        name,
        avatar_url
      )
    `)
    .eq("reviewee_id", revieweeId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json({ error: "ดึงข้อมูลรีวิวไม่สำเร็จ" }, { status: 500 });
  }

  const { data: stats } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewee_id", revieweeId);

  const avgRating = stats && stats.length > 0
    ? stats.reduce((sum, r) => sum + r.rating, 0) / stats.length
    : 0;

  return NextResponse.json({
    reviews: data || [],
    stats: {
      average: Number(avgRating.toFixed(1)),
      count: stats?.length || 0,
    },
  });
}