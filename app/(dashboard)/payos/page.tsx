import { checkPaymentStatus } from '@/actions/billing/checkPaymentStatus';
import { waitFor } from '@/lib/helper/waitFor';

export default async function SetupPayOsPage({
  params,
  searchParams,
}: {
  params: Promise<{ params: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  const { orderCode } = await searchParams;
  await waitFor(2000);
  return  await checkPaymentStatus(orderCode as string);
}
