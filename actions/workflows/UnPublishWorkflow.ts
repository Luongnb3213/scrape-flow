'use server';

import { prisma } from '@/lib/prisma';
import { WorkflowStatus } from '@/types/worklflow';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function UnPublishWorkflow(id: string) {
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
      'Workflow not found or you do not have permission to access it'
    );
  }

  if (workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error('Workflow is not in published status');
  }

  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
  });

  revalidatePath(`/workflow/editor/${id}`);
}
