import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/worklflow';
import { CodeIcon, FileJson2Icon, GlobeIcon, LucideProps, MousePointerClick, TextIcon } from 'lucide-react';

export const ReadProperTyFromJsonTask = {
  type: TaskType.READ_PROPERTY_FROM_JSON,
  label: 'Read property fron JSON',
  icon: (props: LucideProps) => {
    return <FileJson2Icon className="stroke-orange-400" {...props} />;
  },
  isEntryPoint: false,
  inputs: [
    {
      name: 'JSON',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'Property name',
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: 'Property value',
      type: TaskParamType.STRING,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
