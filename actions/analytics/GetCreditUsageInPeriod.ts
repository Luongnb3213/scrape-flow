'use server';

import { PeriodToDateRange } from '@/lib/helper/dates';
import { prisma } from '@/lib/prisma';
import { Period } from '@/types/analytics';
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/worklflow';
import { auth } from '@clerk/nextjs/server';
import { eachDayOfInterval, format } from 'date-fns';

export async function GetCreditUsageInPeriod(period: Period) {
  const { userId } = auth();

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const dateRange = PeriodToDateRange(period);
  const executionPhase = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dateRange.startDate,
        lte: dateRange.endDate,
      },
      status: {
        in: [
          WorkflowExecutionStatus.COMPLETED,
          WorkflowExecutionStatus.FAILED,
        ],
      }
    },
  });

  const stats: Record<
    string,
    {
      success: number;
      failed: number;
    }
  > = eachDayOfInterval({
    start: dateRange.startDate,
    end: dateRange.endDate,
  })
    .map((date) => format(date, 'yyyy-MM-dd'))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };
      return acc
    }, {} as any);

    const dateFormat = 'yyyy-MM-dd';

    executionPhase.forEach((phase) => {
    const date = format(phase.startedAt!, dateFormat);
    if (phase.status === ExecutionPhaseStatus.COMPLETED) {
      stats[date].success += phase.creditsConsumed || 0;
    }
    if (phase.status === ExecutionPhaseStatus.FAILED) {
        stats[date].failed += phase.creditsConsumed || 0;;
      }
  });
  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos
  }));
  
  return result;
}
