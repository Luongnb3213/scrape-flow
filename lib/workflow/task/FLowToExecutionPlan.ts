import { AppNode } from '@/types/appNode';
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from '@/types/worklflow';
import { Edge, getIncomers } from '@xyflow/react';
import { TaskRegistry } from './regsitry';

type flowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
};

export function FLowToExecutionPlan(
  nodes: AppNode[],
  edges: Edge[]
): flowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    throw new Error('TODO: HANDLE THIS ERROR');
  }
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];
  const planned = new Set<string>();
  for (
    let phase = 2;
    phase <= nodes.length || planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) continue;
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);
      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          //If all incoming incomers/edges are planned and there are still invalid inputs
          // this means that this particular node has an invalid input
          // which means that the workflow is invalid
          console.log('Invalid workflow', currentNode, invalidInputs);
          throw new Error('TODO: HANDLE THIS ERROR 1');
        } else {
          continue;
        }
      }
      nextPhase.nodes.push(currentNode);
      planned.add(currentNode.id);
    }
  }

  return { executionPlan };
}


function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
      const invalidInputs = []
      const inputs = TaskRegistry[node.data.type].inputs
      for(const input of inputs!){
          const inputValue = node.data.inputs[input.name]
          const inputValueProvided = inputValue?.length > 0
          if(inputValueProvided) {
             continue;
          }
      }
}