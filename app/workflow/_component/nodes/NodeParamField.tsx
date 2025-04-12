'use client';
import { Input } from '@/components/ui/input';
import { TaskParam, TaskParamType } from '@/types/task';
import React, { useCallback } from 'react';
import StringParam from './param/StringParam';
import { useReactFlow } from '@xyflow/react';
import { AppNode } from '@/types/appNode';

const NodeParamField = ({
  param,
  nodeId,
}: {
  param: TaskParam;
  nodeId: string;
}) => {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data.inputs?.[param.name];
  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [node?.data.inputs, param.name, updateNodeData, nodeId]
  );

  switch (param.type) {
    case TaskParamType.STRING:
      return <StringParam value={value} updateNodeParamValue={updateNodeParamValue} param={param} />;
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground"> Not implemented</p>
        </div>
      );
  }
};

export default NodeParamField;
