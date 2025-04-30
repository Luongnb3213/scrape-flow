// app/actions/checkout.ts
'use server';

import { Creditspack, getCreditPack, PackId } from '@/types/billing';
import { auth } from '@clerk/nextjs/server';
import PayOS from '@payos/node';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

export async function PurchaseCredits(selectedpack: PackId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const pack: Creditspack = getCreditPack(selectedpack)!; // Get the selected pack

  const total = pack.price;
  const orderCode = Number(String(new Date().getTime()).slice(-6));

  const payos = new PayOS(
    process.env.PAYOS_CLIENT_ID!,
    process.env.PAYOS_API_KEY!,
    process.env.PAYOS_CHECKSUM_KEY!
  );
  const data = {
    orderCode,
    amount: total,
    description: `Order #${orderCode}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
    returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payos`,
  };
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY!;
  const signature = createSignature(data, checksumKey);
  try {
    const response = await payos.createPaymentLink({
      orderCode,
      amount: total,
      description: `${pack?.name} - ${pack?.credits} credits`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
      returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payos`,
      signature,
    });
    return response.checkoutUrl;
  } catch (error: any) {
    console.error('Error creating payment link:', error.message);
  }
}

function createSignature(data: any, checksumKey: string): string {
  const sortedKeys = Object.keys(data).sort();
  const sortedData = sortedKeys.map((key) => `${key}=${data[key]}`).join('&');
  const hmac = crypto.createHmac('sha256', checksumKey);
  hmac.update(sortedData);
  return hmac.digest('hex');
}
