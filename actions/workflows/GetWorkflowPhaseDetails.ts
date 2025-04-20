'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export default async function GetWorkflowPhaseDetails(phaseId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  return prisma.executionPhase.findUnique({
    where: {
      id: phaseId,
      excution: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: {
          timestamp: 'asc',
        },
      },
    },
  });
}
