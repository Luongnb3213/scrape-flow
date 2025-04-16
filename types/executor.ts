import { Browser } from 'puppeteer';
import { WorkflowTask } from './worklflow';

export type Environment = {
  browser?: Browser;
  // phases with nodeId/taskID as key
  phases: {
    [key: string]: { // key.: nodeId/taskID
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
};


export type ExecutionEnvironment<T extends WorkflowTask> ={
     getInput(name: T["inputs"][number]["name"]): string 
}