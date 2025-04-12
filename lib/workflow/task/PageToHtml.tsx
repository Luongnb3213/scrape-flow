import { TaskParamType, TaskType } from '@/types/task';
import { CodeIcon, GlobeIcon, LucideProps } from 'lucide-react';

export const PageToHtmkTask = {
  type: TaskType.LAUNCH_BROWSER,
  label: 'Get HTML from page',
  icon: (props: LucideProps) => {
    return <CodeIcon className="stroke-rose-400-400" {...props} />;
  },
  isEntryPoint: false,
  inputs: [
    {
      name: 'Web page',
      type: TaskParamType.BROWSER_INSTANCE,
      required: true,
      hideHandle: false,
      helperText: '',
    },
  ],
  outputs: [{ name: 'Html', type: TaskParamType.STRING }, {
     
     
  }],
};
