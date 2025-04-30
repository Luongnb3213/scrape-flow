import { Browser, Page } from 'puppeteer';
import { WorkflowTask } from './worklflow';
import { LogCollector } from './log';

export type Environment = {
  browser?: Browser;
  // phases with nodeId/taskID as key
  page?: Page;
  phases: {
    [key: string]: {
      // key.: nodeId/taskID
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
};

export type ExecutionEnvironment<T extends WorkflowTask> = {
  getInput(name: T['inputs'][number]['name']): string;
  setOutput(name: T["outputs"][number]['name'], value: string): void;
  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void;

  getPage() : Page | undefined;
  setPage(page: Page): void;


  log: LogCollector;
};
