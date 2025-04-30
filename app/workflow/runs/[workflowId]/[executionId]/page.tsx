import { GetWorkflowExecutionWithPhases } from '@/actions/workflows/GetWorkflowExecutionWithPhases';
import Topbar from '@/app/workflow/_component/topbar/Topbar';
import { auth } from '@clerk/nextjs/server';
import { Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';
import ExecutionViewer from './_components/ExecutionViewer';

function page({
  params,
}: {
  params: {
    workflowId: string;
    executionId: string;
  };
}) {

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar
        workflowId={params.workflowId}
        title="Workflow run details"
        subTitle={`Run ID: ${params.executionId}`}
        hideButtons={true}
      />

      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="flex w-full items-center justify-center">
              <Loader2Icon className="h-10 w-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExcutionViewerWrapper executionId={params.executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExcutionViewerWrapper({ executionId }: { executionId: string }) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div>Workflow execution not found</div>;
  }

  return <ExecutionViewer initialData={workflowExecution} />;
}

export default page;
