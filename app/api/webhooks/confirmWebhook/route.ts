import PayOS from "@payos/node"; // SDK của PayOS
import { error } from "console";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    const payos = new PayOS(
        process.env.PAYOS_CLIENT_ID!,
        process.env.PAYOS_API_KEY!,
        process.env.PAYOS_CHECKSUM_KEY!
      );
    
      const webhookUrl = `https://84dc-2001-ee0-40e1-5d55-d21-182a-56b7-a3e6.ngrok-free.app/api/webhooks/payos`;
    
      try {
        await payos.confirmWebhook(webhookUrl);  // Xác thực webhook
        console.log("✅ Webhook đã được xác thực thành công.");
        return Response.json({ success: '✅ Webhook đã được xác thực thành công.' }, { status: 200 });
      } catch (e) {
        console.error("❌ Lỗi khi xác thực webhook:", e);
        return Response.json({ error: e }, { status: 400 });
      }
}