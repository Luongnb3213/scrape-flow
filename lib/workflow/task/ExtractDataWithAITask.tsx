import { TaskParamType, TaskType } from '@/types/task';
import { WorkflowTask } from '@/types/worklflow';
import { BrainIcon, CodeIcon, GlobeIcon, LucideProps, MousePointerClick, TextIcon } from 'lucide-react';

export const ExtractDataWithAITask = {
  type: TaskType.EXTRACT_DATA_WITH_AI,
  label: 'Extract data with AI',
  icon: (props: LucideProps) => {
    return <BrainIcon className="stroke-rose-400" {...props} />;
  },
  isEntryPoint: false,
  inputs: [
    {
      name: 'Content',
      type: TaskParamType.STRING,
      required: true,
    },
    {
      name: 'Credentials',
      type: TaskParamType.CREDENTIAL,
      required: true,
    },
    {
      name: 'Prompt',
      type: TaskParamType.STRING,
      required: true,
      variant: 'textarea',
    },
  ] as const,
  outputs: [
    {
      name: 'Extracted data',
      type: TaskParamType.STRING,
    },
  ] as const,
  credits: 4,
} satisfies WorkflowTask;
