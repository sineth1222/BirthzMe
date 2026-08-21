import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { generatePayHereHash } from "@/lib/payhere";

// Fixed price for removing the watermark — change to whatever you charge.
const WATERMARK_REMOVAL_PRICE = 300; // LKR
const CURRENCY = "LKR";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { surpriseId } = await req.json();
  if (!surpriseId) {
    return NextResponse.json({ error: "Missing surpriseId" }, { status: 400 });
  }

  // Confirm this surprise actually belongs to the signed-in user before
  // generating a payment for it.
  const { data: surprise, error } = await supabase
    .from("birthday_surprises")
    .select("id, slug")
    .eq("id", surpriseId)
    .eq("creator_id", user.id)
    .single();

  if (error || !surprise) {
    return NextResponse.json({ error: "Surprise not found" }, { status: 404 });
  }

  const orderId = `wm-${surprise.id}-${Date.now()}`;
  /*console.log("PayHere debug:", {
    merchantIdUsed: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
    secretLength: process.env.PAYHERE_MERCHANT_SECRET?.length,
    secretFirst3: process.env.PAYHERE_MERCHANT_SECRET?.slice(0, 3),
    secretLast3: process.env.PAYHERE_MERCHANT_SECRET?.slice(-3),
  });*/
  //console.log("secret set:", !!process.env.PAYHERE_MERCHANT_SECRET);
  const hash = generatePayHereHash({
    orderId,
    amount: WATERMARK_REMOVAL_PRICE,
    currency: CURRENCY,
  });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return NextResponse.json({
    merchantId: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID,
    orderId,
    amount: WATERMARK_REMOVAL_PRICE,
    currency: CURRENCY,
    hash,
    returnUrl: `${siteUrl}/create/success?slug=${surprise.slug}`,
    cancelUrl: `${siteUrl}/create/success?slug=${surprise.slug}`,
    notifyUrl: `${siteUrl}/api/payment/payhere/notify`,
  });
}
