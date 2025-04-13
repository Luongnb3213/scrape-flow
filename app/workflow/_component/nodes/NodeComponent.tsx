import { NodeProps } from '@xyflow/react';
import { memo } from 'react';
import NodeCard from './NodeCard';
import NodeHeader from './NodeHeader';
import { AppNodeData } from '@/types/appNode';
import { TaskRegistry } from '@/lib/workflow/task/regsitry';
import NodeInputs from './NodeInputs';
import NodeInput from './NodeInput';
import NodeOutputs, { NodeOutput } from './NodeOutputs';

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const task = TaskRegistry[nodeData.type];
  return (
    <NodeCard nodeId={props.id} isSelected={props.selected}>
      <NodeHeader taskType={nodeData.type} nodeId={props.id}   />
      <NodeInputs>
        {task?.inputs?.map((input, index) => {
          return <NodeInput key={input?.name} nodeId={props.id} input={input} />;
        })}
      </NodeInputs>
      <NodeOutputs>
      {task?.outputs?.map((input, index) => {
          return <NodeOutput key={input?.name} nodeId={props.id} output={input} />;
        })}
      </NodeOutputs>
    </NodeCard>
  );
});

export default NodeComponent;

NodeComponent.displayName = 'NodeComponent';
