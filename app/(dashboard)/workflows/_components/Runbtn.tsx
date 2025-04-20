import { RunWorkflow } from '@/actions/workflows/runWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { PlayIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const Runbtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (data) => {
      toast.success('Workflow run successfully', { id: workflowId });
    },
    onError: (error) => {
      toast.error('Workflow run failed', { id: workflowId });
    },
  });

  return (
    <Button
      variant={'outline'}
      size={'sm'}
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading('Running workflow.....', { id: workflowId });
        mutation.mutate({
             workflowId
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
    </Button>
  );
};

export default Runbtn;
