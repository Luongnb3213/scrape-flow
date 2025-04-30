'use client';

import { deleteCredential } from '@/actions/credentials/deleteCredential';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface Props {
  name: string;
}
const DeleteCredentialDialog = ({ name }: Props) => {
  const [confirmText, setConfirmText] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const deleteMuation = useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      toast.success('Credential deleted successfully', { id: name });
      setConfirmText('');
    },
    onError: () => {
      toast.success('Something went wrong', { id: name });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'destructive'} size={'icon'}>
          <XIcon size={18} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            If you delete this credential, you will not be able to recover it.
            <div className="flex flex-col py-4 gap-2">
              <p>
                If you are sure, enter <b>{name}</b> to confirm:
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
          <AlertDialogCancel onClick={() => setConfirmText('')}>
            {' '}
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={
              confirmText != name || deleteMuation.isPending
            }
            onClick={(e) => {
              e.stopPropagation();
              toast.loading('Deleting credential...', { id: name });
              deleteMuation.mutate(name);
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCredentialDialog;
