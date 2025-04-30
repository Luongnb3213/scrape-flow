'use client';

import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import { DialogTrigger, Dialog, DialogContent } from '@/components/ui/dialog';
import {
  createWrokFlowShema,
  createWrokFlowShemaType,
  duplicateWrokFlowShema,
  duplicateWrokFlowShemaType,
} from '@/schema/workflow';
import { CopyIcon, Layers2Icon, Loader2 } from 'lucide-react';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { createWorkFlow } from '@/actions/workflows/createWorkFlow';
import { toast } from 'sonner';
import { DuplicateWorkFlow } from '@/actions/workflows/duplicateWorkFlow';
import { cn } from '@/lib/utils';
const DuplicateWorkflowDialog = ({ workflowId }: { workflowId?: string }) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof duplicateWrokFlowShema>>({
    resolver: zodResolver(duplicateWrokFlowShema),
    defaultValues: {
      workflowId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: DuplicateWorkFlow,
    onSuccess: () => {
      toast.success('Workflow duplicate successfully', {
        id: 'duplicate-workflow',
      });
      setOpen(prev => !prev);
    },
    onError: (error) => {
      toast.error('Failed to duplicate workflow', {
        id: 'duplicate-workflow',
      });
    },
  });
  const onSubmit = useCallback(
    (values: duplicateWrokFlowShemaType) => {
      toast.loading('Duplicate workflow...', { id: 'duplicate-workflow' });
      mutate(values);
    },
    [mutate]
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        form.reset();
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          size={'icon'}
          className={cn(
            'ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100'
          )}
        >
          <CopyIcon className="w-4 h-4 text-muted-foreground cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={Layers2Icon}
          title="Duplicate workflow"
          subTitle="Start building your workflow"
        />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-8 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="flex gap-1 text-center">
                        Name
                        <p className="text-xs text-primary">(required)</p>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Choose a descriptive and unique name
                      </FormDescription>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="flex gap-1 text-center">
                        Name
                        <p className="text-xs text-muted-foreground">
                          (optional)
                        </p>
                      </FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a brief description of what your workflow does,{' '}
                        <br /> This is optional but can help you remember the
                        worlflow &apos;s purpose.
                      </FormDescription>
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {!isPending && 'Proceed'}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateWorkflowDialog;
