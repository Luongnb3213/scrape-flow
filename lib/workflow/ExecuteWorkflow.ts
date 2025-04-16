import 'server-only';
import { prisma } from '../prisma';
import { revalidatePath } from 'next/cache';
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from '@/types/worklflow';
import { waitFor } from '../helper/waitFor';
import { ExecutionPhase } from '@prisma/client';
import { AppNode } from '@/types/appNode';
import { TaskRegistry } from './task/regsitry';
import { TaskType } from '@/types/task';
import { ExecutorRegistry } from './executor/registry';
import { Environment, ExecutionEnvironment } from '@/types/executor';

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
    },
    include: {
      workflow: true,
      phase: true,
    },
  });

  if (!execution) {
    throw new Error('Workflow execution not found');
  }

  const environment: Environment = { phases: {} };

  //TODO: setup execution environment
  await initializeWorkflowExcution(executionId, execution.workflowId);

  //TODO: initialize workflow execution
  await initializePhaseStatues(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phase) {
    //  TODO: consume credits
    const phaseExecution = await executeWorkflowPhase(phase, environment);
    if (!phaseExecution) {
      executionFailed = true;
      break;
    }
    //  TODO: execute phase
  }

  // TODO: finalize execution
  await finalWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  // TODO: clean up environment

  revalidatePath('/workflow/runs');
}

async function initializeWorkflowExcution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lasRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhaseStatues(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phase.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((e) => {
      //ignore
      // this means that we have triggered other runs for this workflow
      // while an execution was running
    });
}

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setupEnvironmentForPhase(node, environment);
  //update phase status

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log(
    `Executing phase ${phase.name} with ${creditsRequired} credits required`
  );

  // TODO: decrement user balance ( with requuired credits )

  const success = await executePhase(phase, node, environment);

  await finalizePhase(phase.id, success);
  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type as TaskType];
  if (!runFn) {
    return false;
  }


  const executionEnvironment: ExecutionEnvironment =   createExecutionEnvironment(node, environment)
  return await runFn(executionEnvironment);
}

async function setupEnvironmentForPhase(node: AppNode, environment: Environment){
  environment.phases[node.id] = {
      inputs: {

      }, 
      outputs: {

      }
  }

  const inputs = TaskRegistry[node.data.type].inputs!;
  for( const input of inputs){
     const inputValue =  node.data.inputs[input.name];
     if(inputValue){
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
     }


    // Get input value from outputs in the environment

  }
}

function createExecutionEnvironment(node: AppNode, environment: Environment): ExecutionEnvironment {
  return {
    getInput(name: string) {
      return environment.phases[node.id]?.inputs[name];
    },
  };
}