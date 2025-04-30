import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/worklflow';
import { CodeIcon, Edit3Icon, GlobeIcon, LucideProps } from 'lucide-react';

export const FillInputTask = {
  type: TaskType.FILL_INPUT,
  label: 'Fill input',
  icon: () => {
    return <Edit3Icon className="stroke-orange-400" />;
  },
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true, // this is required a input from annother node ( output of another node)
    },
    {
      name: 'Selector',
      type: TaskParamType.STRING,
      required: true, // this is required a input from annother node ( output of another node)
    },
    {
      name: 'Value',
      type: TaskParamType.STRING,
      required: true, // this is required a input from annother node ( output of another node)
    },
  ] as const,
  outputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
