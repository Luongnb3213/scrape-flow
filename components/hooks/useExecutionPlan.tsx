import {
  FlowToExcutionPlanValidationError,
  FLowToExecutionPlan,
} from '@/lib/workflow/task/FLowToExecutionPlan';
import { AppNode } from '@/types/appNode';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import useFlowValidation from './useFlowValidation';
import { toast } from 'sonner';

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: any) => {
      switch (error.type) {
        case FlowToExcutionPlanValidationError.NO_ENTRY_POINT:
          toast.error(
            'No entry point found in the workflow. Please add an entry point node.'
          );

          break;
        case FlowToExcutionPlanValidationError.INVALID_INPUTS:
          toast.error('Not All inputs values are set');
          setInvalidInputs(error.invalidElements!);
          break;

        default:
          toast.error(' something went wrong');
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();

    const { executionPlan, error } = FLowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      handleError(error);
      return null;
    }
    clearErrors();
    return executionPlan;
  }, [toObject, handleError]);

  return generateExecutionPlan;
};

export default useExecutionPlan;
