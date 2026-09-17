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

  const { data: member } = await supabase
    .from("members")
    .select("is_banned")
    .eq("member_id", user.id)
    .single();

  if (member?.is_banned) {
    return NextResponse.json({ error: "บัญชีของคุณถูกระงับการใช้งาน" }, { status: 403 });
  }

  const formData = await request.formData();

  const title = formData.get("title") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const images = formData.getAll("images") as File[];

  if (!title?.trim()) {
    return NextResponse.json({ error: "กรุณากรอกชื่อสินค้า" }, { status: 400 });
  }
  if (!price) {
    return NextResponse.json({ error: "กรุณากรอกราคา" }, { status: 400 });
  }
  if (images.length === 0) {
    return NextResponse.json({ error: "กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป" }, { status: 400 });
  }
  if (images.length > 5) {
    return NextResponse.json({ error: "อัปโหลดได้สูงสุด 5 รูป" }, { status: 400 });
  }

  for (const image of images) {
    if (!image.type.startsWith("image/")) {
      return NextResponse.json({ error: "รองรับเฉพาะไฟล์รูปภาพเท่านั้น" }, { status: 400 });
    }
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "ขนาดไฟล์ต้องไม่เกิน 5MB" }, { status: 400 });
    }
  }

  const { data: item, error: itemError } = await supabase
    .from("items")
    .insert({
      member_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      price: Number(price),
      status: "available",
    })
    .select("item_id")
    .single();

  if (itemError || !item) {
    console.error("Item insert error:", itemError);
    return NextResponse.json({ error: "สร้างประกาศไม่สำเร็จ" }, { status: 500 });
  }

  const uploadedUrls: string[] = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const fileExt = image.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${item.item_id}/${Date.now()}-${i}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(fileName, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      await supabase.from("items").delete().eq("item_id", item.item_id);
      for (const url of uploadedUrls) {
        const path = url.split("/item-images/")[1];
        if (path) await supabase.storage.from("item-images").remove([path]);
      }
      return NextResponse.json({ error: "อัปโหลดรูปภาพไม่สำเร็จ" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from("item-images").getPublicUrl(fileName);
    uploadedUrls.push(publicUrl);
  }

  const imageRecords = uploadedUrls.map((url) => ({
    item_id: item.item_id,
    image_url: url,
  }));

  const { error: imagesError } = await supabase.from("item_images").insert(imageRecords);

  if (imagesError) {
    console.error("Item images insert error:", imagesError);
  }

  return NextResponse.json({ item_id: item.item_id, message: "สร้างประกาศสำเร็จ" });
}