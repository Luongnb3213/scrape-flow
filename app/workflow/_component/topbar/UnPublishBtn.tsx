'use client';
import { UnPublishWorkflow } from '@/actions/workflows/UnPublishWorkflow';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { DownloadIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const UnPublishBtn = ({ workflowId }: { workflowId: string }) => {
  const mtation = useMutation({
    mutationFn: UnPublishWorkflow,
    onSuccess: (data) => {
      toast.success('Workflow Unpublished ', { id: workflowId });
    },
    onError: (error) => {
      toast.error('Workflow Unpublished failed', { id: workflowId });
    },
  });
  return (
    <Button
      variant={'outline'}
      disabled={mtation.isPending}
      onClick={() => {
        toast.loading("UnPublishing workflow.....", { id: workflowId });
        mtation.mutate(workflowId);
      }}
      className="flex items-center gap-2"
    >
      <DownloadIcon size={16} className="stroke-orange-400" />
      Unpublish
    </Button>
  );
};

export default UnPublishBtn;
