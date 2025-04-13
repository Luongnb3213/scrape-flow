import { FLowToExecutionPlan } from '@/lib/workflow/task/FLowToExecutionPlan';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();

    const result = FLowToExecutionPlan(nodes, edges);


  }, [toObject]);

  return generateExecutionPlan;
};

export default useExecutionPlan;
