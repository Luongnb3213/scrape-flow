import { WorkflowExecution } from './../../node_modules/.prisma/client/index.d';

'use server'

import { prisma } from '@/lib/prisma';
import { ExecuteWorkflow } from '@/lib/workflow/ExecuteWorkflow';
import { FLowToExecutionPlan } from '@/lib/workflow/task/FLowToExecutionPlan';
import { TaskRegistry } from '@/lib/workflow/task/regsitry';
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkFlowExecutionTrigger,
} from '@/types/worklflow';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error('Workflow ID is required');
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId,
    },
  });

  if (!workflow) {
    throw new Error('Workflow not found');
  }
  let executionPlan: WorkflowExecutionPlan;
  if (!flowDefinition) {
    throw new Error('Workflow definition is not defined');
  }

  const flow = JSON.parse(flowDefinition);
  const result = FLowToExecutionPlan(flow.nodes, flow.edges);

  if (!result.executionPlan) {
    throw new Error('no excution plan generated');
  }

  executionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkFlowExecutionTrigger.MANUAL,
      phase: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          });
        }),
      },
    },
    select: {
      id: true,
      phase: true,
    },
  });

  if (!execution) {
    throw new Error('workflow execution not created');
  }

  ExecuteWorkflow(execution.id); // run this on background

  redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
