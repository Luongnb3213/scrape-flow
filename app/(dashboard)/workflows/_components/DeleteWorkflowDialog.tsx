'use client';

import { deleteWorkFlow } from '@/actions/workflows/deleteWorkFlow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  workflowName?: string;

  workflowId: string;
}
const DeleteWorkflowDialog = (props: Props) => {
  const [confirmText, setConfirmText] = React.useState('');

  const deleteMuation = useMutation({
    mutationFn: deleteWorkFlow,
    onSuccess: () => {
      toast.success('Workflow deleted successfully', { id: props.workflowId });
      setConfirmText('');
    },
    onError: () => {
      toast.success('Something went wrong', { id: props.workflowId });
    },
  });
  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this workflow, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>{props.workflowName}</b> to confirm:
              </p>
              <Input
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                }}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmText("")}> Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={
              confirmText != props.workflowName || deleteMuation.isPending
            }
            onClick={(e) => {
              e.stopPropagation();
              toast.loading('Deleting workflow...', { id: props.workflowId });
              deleteMuation.mutate(props.workflowId);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteWorkflowDialog;
