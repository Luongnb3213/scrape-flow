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
import { TaskParamType, TaskType } from '@/types/task';
import { ExecutorRegistry } from './executor/registry';
import { Environment, ExecutionEnvironment } from '@/types/executor';
import { LaunchBrowserTask } from './task/LaunchBrowser';
import { Browser, Page } from 'puppeteer';
import { Edge } from '@xyflow/react';
import { LogCollector } from '@/types/log';
import { CreateLogCollector } from '../log';
import { auth } from '@clerk/nextjs/server';

export async function ExecuteWorkflow(executionId: string, nexRunAt?: Date) {
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
  //TODO: setup execution environment
  const environment: Environment = { phases: {} };

  //TODO: initialize workflow execution set status to RUNNING
  await initializeWorkflowExcution(executionId, execution.workflowId,nexRunAt);

  //TODO: initialize  phase set status to PENDING

  await initializePhaseStatues(execution);
  const edges = JSON.parse(execution.definition).edges as Edge[];
  let creditsConsumed = 0;
  let executionFailed = false;

  for (const phase of execution.phase) {
    //  TODO: consume credits
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges
    );

    creditsConsumed += phaseExecution.creditsConsumed;
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
  await cleanupEnvironment(environment);
  revalidatePath('/workflow/runs');
}

async function initializeWorkflowExcution(
  executionId: string,
  workflowId: string,
  nexRunAt?: Date
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
      ...(nexRunAt && { nextRunAt: nexRunAt }),
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
  environment: Environment,
  edges: Edge[]
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  const logCollector = CreateLogCollector();
  setupEnvironmentForPhase(node, environment, edges);
  //update phase status

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits!;
  console.log(
    `Executing phase ${phase.name} with ${creditsRequired} credits required`
  );

  // TODO: decrement user balance ( with requuired credits )
  let success = await decrementCredits(creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;
  if (success) {
    success = await executePhase(phase, node, environment, logCollector);
  }
  const outputs = environment.phases[node.id].outputs;

  await finalizePhase(
    phase.id,
    success,
    outputs,
    logCollector,
    creditsConsumed
  );
  return { success, creditsConsumed };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  const logsData = logCollector.getAll().map((log) => ({
    logLevel: log.level,
    message: log.message,
    timestamp: log.timestamp,
  }));

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsCost: creditsConsumed,
      logs: {
        createMany: {
          data: logsData,
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type as TaskType];
  if (!runFn) {
    logCollector.error(`Not found executor for ${node.data.type}`);
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);
  return await runFn(executionEnvironment);
}

async function setupEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = {
    inputs: {},
    outputs: {},
  };

  const inputs = TaskRegistry[node.data.type].inputs!;
  for (const input of inputs) {
    if (input.type == TaskParamType.BROWSER_INSTANCE) {
      continue;
    }

    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input value from outputs in the environment
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error('Missing edge for input', input.name, 'in node', node.id);
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source]?.outputs[
        connectedEdge.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput(name: string) {
      return environment.phases[node.id]?.inputs[name];
    },
    setOutput(name: string, value: string) {
      environment.phases[node.id].outputs[name] = value;
    },
    getBrowser: () => {
      return environment.browser;
    },
    setBrowser: (browser: Browser) => {
      environment.browser = browser;
    },
    setPage: (page: Page) => {
      environment.page = page;
    },
    getPage: () => {
      return environment.page;
    },
    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser.close().catch((e) => {
      console.error('Cannot close browser, reason', e);
    });
  }
}

async function decrementCredits(amount: number, LogCollector: LogCollector) {
  const { userId } = auth();
  if (!userId) {
    return true;
  }
  try {
    await prisma.userBalance.update({
      where: {
        userId,
        credits: {
          gte: amount,
        },
      },
      data: {
        credits: {
          decrement: amount,
        },
      },
    });
    return true;
  } catch (error) {
    LogCollector.error('insufficient balance');
    return false;
  }
}
