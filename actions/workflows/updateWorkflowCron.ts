'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { CronExpressionParser } from 'cron-parser';
import { revalidatePath } from 'next/cache';
export async function updateWorkflowCron({
  id,
  cron,
}: {
  id: string;
  cron: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }
  try {
    const interval = CronExpressionParser.parse(cron);
    revalidatePath(`/workflows`)
    return await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });

  } catch (error: any) {
    console.error('Error updating workflow cron:', error.message);
    throw new Error('Invalid cron expression');
  }
}
