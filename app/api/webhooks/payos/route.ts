// app/api/payos/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import PayOS from "@payos/node";

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID!,
  process.env.PAYOS_API_KEY!,
  process.env.PAYOS_CHECKSUM_KEY!
);

export async function POST(req: NextRequest) {
  const payload = await req.json();

  try {
    const data = payos.verifyPaymentWebhookData(payload); 
    console.log(data)
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
}
