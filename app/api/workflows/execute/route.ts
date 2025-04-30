import { prisma } from '@/lib/prisma';
import { ExecuteWorkflow } from '@/lib/workflow/ExecuteWorkflow';
import { TaskRegistry } from '@/lib/workflow/task/regsitry';
import {
  ExecutionPhaseStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkFlowExecutionTrigger,
} from '@/types/worklflow';
import { error } from 'console';
import CronExpressionParser from 'cron-parser';
import { timingSafeEqual } from 'crypto';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = authHeader.split(' ')[1];
  if (!isValidSecret(secret)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get('workflowId') as string;
  if (!workflowId) {
    return Response.json({ error: 'Bad Request' }, { status: 400 });
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });

  if (!workflow) {
    return Response.json({ error: 'Bad Request' }, { status: 400 });
  }

  const executionPlan = JSON.parse(
    workflow.executionPlan!
  ) as WorkflowExecutionPlan;

  if (!executionPlan) {
    return Response.json({ error: 'Bad Request' }, { status: 400 });
  }

  try {
    const cron = CronExpressionParser.parse(workflow.cron!);
    const nextRun = cron.next().toDate();
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: WorkflowExecutionStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkFlowExecutionTrigger.CRON,
        phase: {
          create: executionPlan.flatMap((phase) => {
            return phase.nodes.flatMap((node) => {
              return {
                userId: workflow.userId,
                status: ExecutionPhaseStatus.CREATED,
                number: phase.phase,
                node: JSON.stringify(node),
                name: TaskRegistry[node.data.type].label,
              };
            });
          }),
        },
      },
    });

    await ExecuteWorkflow(execution.id, nextRun);

    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function isValidSecret(secret: string) {
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) return false;
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}
