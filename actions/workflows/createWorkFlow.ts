"use server";
import { prisma } from '@/lib/prisma';
import {
  createWrokFlowShema,
  createWrokFlowShemaType,
} from '@/schema/workflow';
import { WorkflowStatus } from '@/types/worklflow';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function createWorkFlow(form: createWrokFlowShemaType) {
  const { success, data } = createWrokFlowShema.safeParse(form);
  if (!success) {
    throw new Error('Invalid form data');
  }
  const { userId } = auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }
  const result = await prisma.workflow.create({
    data: {
      userId,
      definition: 'TODO',
      ...data,
      status: WorkflowStatus.DRAFT,
    },
  });

  if (!result) {
    throw new Error('Failed to create workflow');
  }

  redirect(`/workflow/editor/${result.id}`);
}
