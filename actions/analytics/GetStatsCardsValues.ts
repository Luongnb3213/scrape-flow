'use server';

import { PeriodToDateRange } from '@/lib/helper/dates';
import { prisma } from '@/lib/prisma';
import { Period } from '@/types/analytics';
import { WorkflowExecutionStatus } from '@/types/worklflow';
import { auth } from '@clerk/nextjs/server';

export async function GetStatsCardsValues(period: Period) {
  const { userId } = auth();
  if (!userId) {
    throw new Error('User not authenticated');
  }
  const dateRange = PeriodToDateRange(period);
  const { COMPLETED, FAILED } = WorkflowExecutionStatus;
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phase: {
        where: {
          creditsCost: {
            not: null,
          },
        },
        select: {
          creditsCost: true,
        },
      },
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: 0,
    phaseExecutions: 0,
  };

  stats.creditsConsumed = executions.reduce((sum, execution) => {
    return sum + execution.creditsConsumed;
  }, 0);


  stats.phaseExecutions = executions.reduce((sum, execution) => {
    return sum + execution.phase.length;
  }, 0);





  return stats;
}
