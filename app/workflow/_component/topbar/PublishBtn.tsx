'use client';
import { PublishWorkflow } from '@/actions/workflows/PublishWorkflow';
import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon, UploadIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const PublishBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const mtation = useMutation({
    mutationFn: PublishWorkflow,
    onSuccess: (data) => {
      toast.success('Workflow published ', { id: workflowId });
    },
    onError: (error) => {
      toast.error('Workflow published failed', { id: workflowId });
    },
  });
  return (
    <Button
      variant={'outline'}
      disabled={mtation.isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          //client side validation error
          return;
        }
        toast.loading("Publishing workflow.....", { id: workflowId });
        mtation.mutate({
          id: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
      className="flex items-center gap-2"
    >
      <UploadIcon size={16} className="stroke-green-400" />
      Publish
    </Button>
  );
};

export default PublishBtn;
