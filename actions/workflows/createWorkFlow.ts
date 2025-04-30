'use server';
import { prisma } from '@/lib/prisma';
import { CreateFlowNode } from '@/lib/workflow/task/createFlowNode';
import {
  createWrokFlowShema,
  createWrokFlowShemaType,
} from '@/schema/workflow';
import { AppNode } from '@/types/appNode';
import { TaskType } from '@/types/task';
import { WorkflowStatus } from '@/types/worklflow';
import { auth } from '@clerk/nextjs/server';
import { Edge } from '@xyflow/react';
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

  const inittialFlow: { nodes: AppNode[]; edges: Edge[] } = {
    nodes: [],
    edges: [],
  };

  inittialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

  
  const result = await prisma.workflow.create({
    data: {
      userId,
      definition: JSON.stringify(inittialFlow),
      ...data,
      status: WorkflowStatus.DRAFT,
    },
  });

  if (!result) {
    throw new Error('Failed to create workflow');
  }

  redirect(`/workflow/editor/${result.id}`);
}
