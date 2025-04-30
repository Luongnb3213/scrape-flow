'use client';

import { Workflow } from '@prisma/client';
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  getOutgoers,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import React, { useCallback, useEffect } from 'react';
import '@xyflow/react/dist/style.css';
import { TaskType } from '@/types/task';
import { CreateFlowNode } from '@/lib/workflow/task/createFlowNode';
import NodeComponent from './nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
import DeletableEdge from './edges/DeletableEdge';
import { TaskRegistry } from '@/lib/workflow/task/regsitry';

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 1,
};
const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
  useEffect(() => {
    const flow = JSON.parse(workflow.definition);
    if (!flow) return;
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    if (!flow.viewport) return;
    const { x = 0, y = 0, zoom = 1 } = flow.viewport;
    setViewport({ x, y, zoom }, { duration: 0 });
  }, [workflow.definition, setEdges, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const taskType = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );
      if (typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = CreateFlowNode(taskType as TaskType, position);
      setNodes((nds) => {
        return nds.concat(newNode);
      });
    },
    [screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      // remove input value if is present on connection

      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;

      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: '',
        },
      });
    },
    [setEdges, updateNodeData, nodes]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // no self-connections allowed
      if (connection.source === connection.target) return false;

      // Same taskParam type
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);
      if (!sourceNode || !targetNode) return false;
      const sourceTask = TaskRegistry[sourceNode.data.type];
      const targetTask = TaskRegistry[targetNode.data.type];

      const output = sourceTask?.outputs?.find(
        (output) => output.name === connection.sourceHandle
      );
      const input = targetTask?.inputs?.find(
        (input) => input.name === connection.targetHandle
      );

      if (input?.type !== output?.type) {
        return false;
      }

      const hasCycle = (node: AppNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      const detectedCycle = hasCycle(targetNode);

      return !detectedCycle;
    },

    [nodes]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView
        onDrop={onDrop}
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
};

export default FlowEditor;
