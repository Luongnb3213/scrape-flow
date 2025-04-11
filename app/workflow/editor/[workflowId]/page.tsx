import { waitFor } from '@/lib/helper/waitFor';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react';
import Editor from '../../_component/Editor';

const page = async ({ params }: { params: { workflowId: string } }) => {
  const { workflowId } = params;

  const { userId } = auth();

  if (!userId) {
    return <div className="div">unauthenticated</div>;
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });


  if(!workflow) {
    return <div className="div">workflow not found</div>;
  }

  return (
     <Editor workflow={workflow} />
  )
};

export default page;
