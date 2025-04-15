'use client';
import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const ExecuteBtn = ({ workflowId }: { workflowId: string }) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  console.log(toObject());
  const mtation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (data) => {
      toast.success('Workflow executed successfully', { id: 'flow-execution' });
    },
    onError: (error) => {
      toast.error('Workflow execution failed', { id: 'flow-execution' });
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
        mtation.mutate({
          workflowId: workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
      className="flex items-center gap-2"
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
};

export default ExecuteBtn;
