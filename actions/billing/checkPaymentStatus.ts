import { prisma } from '@/lib/prisma';
import { getCreditPack, PackId } from '@/types/billing';
import { auth } from '@clerk/nextjs/server';
import PayOS from '@payos/node';
import { redirect } from 'next/navigation';

export async function checkPaymentStatus(orderCode: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const payos = new PayOS(
    process.env.PAYOS_CLIENT_ID!,
    process.env.PAYOS_API_KEY!,
    process.env.PAYOS_CHECKSUM_KEY!
  );

  try {
    const payment = await payos.getPaymentLinkInformation(orderCode);
    const purchasePack = getCreditPack(PackId.SMALL, payment.amount);

    await prisma.userBalance.upsert({
      where: { userId },
      create: {
        userId,
        credits: purchasePack?.credits,
      },
      update: {
        credits: {
          increment: purchasePack?.credits,
        },
      },
    });

    await prisma.userPurchase.create({
      data: {
        userId,
        stripeId: orderCode,
        description: `${purchasePack?.name} - ${purchasePack?.credits} credits`,
        amount: payment.amount,
        currency: 'VND',
      },
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    return;
  }
  redirect('/billing');
}
