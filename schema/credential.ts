import { z } from "zod";

export const createCredentialShema = z.object({
     name: z.string().max(30),
     value: z.string().max(500),
})


export type createCredentialShemaType = z.infer<typeof createCredentialShema>;