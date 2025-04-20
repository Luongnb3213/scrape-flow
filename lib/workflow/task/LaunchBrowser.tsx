import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/worklflow';
import { GlobeIcon, LucideProps } from 'lucide-react';

export const LaunchBrowserTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: 'Launch Browser',
  icon: (props: LucideProps) => {
    return <GlobeIcon className="stroke-pink-400" {...props} />;
  },
  isEntryPoint: true,
  inputs: [
    {
      name: 'Website URL',
      type: TaskParamType.STRING,
      helperText: 'eg: https://google.com',
      required: true,
      hideHandle: true,
    },
  ] as const,
  outputs: [{ name: 'Webpage', type: TaskParamType.BROWSER_INSTANCE }] as const,
  credits: 1,
} satisfies WorkflowTask;
