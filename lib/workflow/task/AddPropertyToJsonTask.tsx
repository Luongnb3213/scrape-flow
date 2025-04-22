import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/worklflow';
import { CodeIcon, DatabaseIcon, FileJson2Icon, GlobeIcon, LucideProps, MousePointerClick, TextIcon } from 'lucide-react';

export const AddPropertyToJsonTask = {
  type: TaskType.ADD_PROPERTY_TO_JSON,
  label: 'Add property fron JSON',
  icon: (props: LucideProps) => {
    return <DatabaseIcon className="stroke-orange-400" {...props} />;
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
    {
      name: 'Property value',
      type: TaskParamType.STRING,
      required: true,
    },
  ] as const,
  outputs: [
    {
      name: 'Update JSON',
      type: TaskParamType.STRING,
    },
  ] as const,
  credits: 1,
} satisfies WorkflowTask;
