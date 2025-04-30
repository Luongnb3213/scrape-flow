import { ExecutionPhase } from '@prisma/client';

type Phase = Pick<ExecutionPhase, 'creditsCost'>;

export function GetPhaseTotalCose(phases: Phase[]) {
  return phases.reduceRight((acc, phase) => {
    return acc + (phase.creditsCost || 0);
  }, 0);
}
