'use server';

import { prisma } from '@/lib/prisma';
import { WorkflowStatus } from '@/types/worklflow';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function updateWorkflow({
  id,
  definition,
}: {
  id: string;
  definition: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) {
    throw new Error(
      "Workflow not found or you don't have permission to update it"
    );
  }
  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('Workflow is not in draft status and cannot be updated');
  }

  await prisma.workflow.update({
    data: {
      definition,
    },
    where: {
      id,
      userId,
    },
  });

  revalidatePath(`/workflows`);
}
