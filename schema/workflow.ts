import { z } from 'zod';

export const createWrokFlowShema = z.object({
  name: z.string().max(50),
  description: z.string().max(80).optional(),
});

export type createWrokFlowShemaType = z.infer<typeof createWrokFlowShema>;
