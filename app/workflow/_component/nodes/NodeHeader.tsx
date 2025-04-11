'use client';
import { TaskRegistry } from '@/lib/workflow/task/regsitry';
import { TaskType } from '@/types/task';
import React from 'react';

const NodeHeader = ({ taskType }: { taskType: TaskType }) => {
    const task =  TaskRegistry[taskType];
  return <div className="flex items-center gap-2 p-2">NodeHeader</div>;
};

export default NodeHeader;
