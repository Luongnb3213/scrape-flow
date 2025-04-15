import { AppNode, AppNodeMissingInputs } from '@/types/appNode';
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from '@/types/worklflow';
import { Edge } from '@xyflow/react';
import { TaskRegistry } from './regsitry';

export enum FlowToExcutionPlanValidationError {
  'NO_ENTRY_POINT',
  'INVALID_INPUTS',
}

type flowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: {
    type: FlowToExcutionPlanValidationError;
    invalidElements?: AppNodeMissingInputs[];
  };
};

export function FLowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): flowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    return {
      error: {
        type: FlowToExcutionPlanValidationError.NO_ENTRY_POINT,
      },
    };
  }
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  const inputsWithErrors: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();
  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs?.length! > 0) {
    inputsWithErrors.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) continue;

      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      // console.log(invalidInputs, phase,currentNode.id)
      if (invalidInputs?.length! > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        // console.log('incomers', incomers, currentNode);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          //If all incoming incomers/edges are planned and there are still invalid inputs
          // this means that this particular node has an invalid input
          // which means that the workflow is invalid
          inputsWithErrors.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
    }

    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }

    executionPlan.push(nextPhase);
  }

  if(inputsWithErrors.length > 0) {
       return{
         error:{ 
          type: FlowToExcutionPlanValidationError.INVALID_INPUTS,
          invalidElements: inputsWithErrors
         }
       }
  }

  return { executionPlan };
}

function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
  const invalidInputs = [];
  const inputs = TaskRegistry[node.data.type].inputs;
  console.log('inputs', inputs, node.id);
  for (const input of inputs!) {
    const inputValue = node.data.inputs[input.name];
    const inputValueProvided = inputValue?.length > 0;
    if (inputValueProvided) {
      // this input is fine, so we can move on
      continue;
    }
    // if a value is not provided, we need to check
    // if there is an output linked to the current input
    const incomingEdges = edges.filter((edge) => {
      return edge.target === node.id;
    });

    const inputLinkedToOutput = incomingEdges.find((edge) => {
      return edge.targetHandle === input.name;
    });

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    console.log(requiredInputProvidedByVisitedOutput, node.id);
    if (requiredInputProvidedByVisitedOutput) {
      // this input is required and WE have a valid value for it
      // provided by a task that is already planned
      continue;
    } else if (!input.required) {
      // this input is not required but there is an output linked to it
      // then we need to be sure that the output is already planned
      if (!inputLinkedToOutput) {
        continue;
      }
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        // The output is providing a value to the input: the input is fine
        continue;
      }
    }

    invalidInputs.push(input.name);
  }

  return invalidInputs;
}


function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
  if(!node.id) {
     return []
  } 
   const incomersIds = new Set();
   edges.forEach((edge) => {
     if (edge.target === node.id) {
       incomersIds.add(edge.source);
     }
   })


   return nodes.filter((node) => incomersIds.has(node.id!));
}