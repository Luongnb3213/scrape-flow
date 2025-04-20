'use server';

import { prisma } from '@/lib/prisma';
import { CalculateWorkflowCost } from '@/lib/workflow/helper';
import { FLowToExecutionPlan } from '@/lib/workflow/task/FLowToExecutionPlan';
import { WorkflowStatus } from '@/types/worklflow';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function PublishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
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
      'Workflow not found or you do not have permission to access it'
    );
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error('Workflow is not in draft status');
  }

  const flow = JSON.parse(flowDefinition);
  const result = FLowToExecutionPlan(flow.nodes, flow.edges);

    if(result.error){
        throw new Error("Flow definition is invalid");
    }

    if(!result.executionPlan){
        throw new Error("no execution plan generated");
    }


   const creditsCost = CalculateWorkflowCost(flow.nodes)
   await prisma.workflow.update({
    where: {
           id, userId
    },
    data: {
         definition: flowDefinition,
         executionPlan: JSON.stringify(result.executionPlan),
         creditsCost,
         status: WorkflowStatus.PUBLISHED,
    }
   })

   revalidatePath(`/workflow/editor/${id}`);


}
