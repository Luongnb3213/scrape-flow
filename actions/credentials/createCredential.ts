'use server';

import { symmetricEncrypt } from '@/lib/encryption';
import { prisma } from '@/lib/prisma';
import {
  createCredentialShema,
  createCredentialShemaType,
} from '@/schema/credential';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createCredential(form: createCredentialShemaType) {
  const { success, data } = createCredentialShema.safeParse(form);
  if (!success) {
    throw new Error('Invalid form data');
  }
  const {userId} = auth()

  if (!userId) {
    throw new Error('User not authenticated');
  }


  const encryptedValue = symmetricEncrypt(data.value)

  const result = await prisma.credential.create({
       data:{
         userId,
         name: data.name,
         value: encryptedValue,
       }
  })


  if(!result) {
    throw new Error('Failed to create credential');
  }

  revalidatePath("/credentials")

}
