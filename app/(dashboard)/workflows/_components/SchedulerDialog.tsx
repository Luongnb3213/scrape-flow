'use client';

import { updateWorkflowCron } from '@/actions/workflows/updateWorkflowCron';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import cronstrue from 'cronstrue';
import { removeWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule';
const SchedulerDialog = (props: {
  workflowId: string;
  cron: string | null;
}) => {
  const [cron, setCron] = React.useState<string>(props.cron || '');
  const [validCron, setValidCron] = React.useState<boolean>(false);
  const [readableCron, setReadableCron] = React.useState<string>('');
  const mutation = useMutation({
    mutationFn: updateWorkflowCron,
    onSuccess: () => {
      toast.success('Workflow schedule updated successfully', {
        id: 'workflow-schedule',
      });
    },
    onError: (error) => {
      toast.error('Some thing went wrong', {
        id: 'workflow-schedule',
      });
    },
  });
  const removeWorkflow = useMutation({
    mutationFn: removeWorkflowSchedule,
    onSuccess: () => {
      toast.success('Workflow schedule updated successfully', {
        id: 'workflow-schedule',
      });
    },
    onError: (error) => {
      toast.error('Some thing went wrong', {
        id: 'workflow-schedule',
      });
    },
  });

  useEffect(() => {
    try {
      const humanCronStr = cronstrue.toString(cron);
      setValidCron(true);
      setReadableCron(humanCronStr);
    } catch (error) {
      setValidCron(false);
    }
  }, [cron]);

  const workflowHasValidCron = props.cron && props.cron.length > 0;
  const readableSavedCron =
    workflowHasValidCron && cronstrue.toString(props.cron!);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'link'}
          size={'sm'}
          className={cn(
            'text-sm p-0 h-auto text-orange-500',
            workflowHasValidCron && 'text-primary'
          )}
        >
          {workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <ClockIcon />
              {readableSavedCron}
            </div>
          )}
          {!workflowHasValidCron && (
            <div className="flex items-center gap-2">
              <TriangleAlertIcon className="h-3 w-3" />
              {'Set Schedule'}
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          title="Schedule workflow execution"
          icon={CalendarIcon}
        />
        <div className="p-6 space-y-4">
          <p className="text-muted-foreground text-sm">
            Specify acron expression to schedule periodic workflow execution.
            All times are in UTC
          </p>
          <Input
            value={cron}
            onChange={(e) => {
              setCron(e.target.value);
            }}
            placeholder="E.g. * * * * *"
          />
          <div
            className={cn(
              'bg-accent rounded-md p-4 border text-sm ',
              validCron
                ? 'border-primary text-primary'
                : 'border-destructive text-destructive'
            )}
          >
            {validCron ? readableCron : 'Not a valid cron expression'}
          </div>

          {workflowHasValidCron && (
            <DialogClose asChild>
              <div className="py-8">
                <Button
                  className="w-full text-destructive border-destructive hover:text-destructive"
                  variant={'outline'}
                  disabled={mutation.isPending || removeWorkflow.isPending}
                  onClick={() => {
                      toast.loading('Removing schedule', {id: "cron"})
                      removeWorkflow.mutate(props.workflowId);
                      toast.dismiss("cron")
                  }}
                >
                  Remove current schedule
                </Button>
              </div>
            </DialogClose>
          )}
        </div>
        <DialogFooter className="px-6 gap-2">
          <DialogClose asChild>
            <Button className="w-full" variant={'secondary'}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={mutation.isPending || !validCron}
              onClick={() => {
                mutation.mutate({ id: props.workflowId, cron });
              }}
              className="w-full"
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SchedulerDialog;
