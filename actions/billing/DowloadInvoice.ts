"use server"

import { auth } from "@clerk/nextjs/server";

export async function DowloadInvoice(id: string) {
      const { userId } = auth();
      
        if (!userId) {
          throw new Error('User not authenticated');
        }
        return null
}