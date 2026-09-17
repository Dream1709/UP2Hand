import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  if (code) {
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

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Code exchange error:", exchangeError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง")}`, request.url)
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Get user error:", userError);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง")}`, request.url)
      );
    }

    const email = user.email?.toLowerCase() || "";
    const isUpDomain = email.endsWith("@up.ac.th");

    if (!isUpDomain) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("อนุญาตเฉพาะบุคลากรและนิสิต ม.พะเยา (@up.ac.th) เท่านั้น")}`, request.url)
      );
    }

    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("is_banned, role")
      .eq("member_id", user.id)
      .single();

    if (memberError && memberError.code !== "PGRST116") {
      console.error("Member fetch error:", memberError);
    }

    if (member?.is_banned) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ")}`, request.url)
      );
    }

    if (!member) {
      const { error: insertError } = await supabase.from("members").insert({
        member_id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || email.split("@")[0],
        email: email,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        role: "member",
        is_banned: false,
      });

      if (insertError) {
        console.error("Member insert error:", insertError);
      }
    }

    const redirectTo = requestUrl.searchParams.get("redirect_to") || "/";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.redirect(new URL("/login?error=invalid_request", request.url));
}