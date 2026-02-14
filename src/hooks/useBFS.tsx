import { useCallback, useRef, useState } from "react";
import type { GraphNode, GraphEdge } from "../types";
import {
  buildAdjacencyList,
  findRootNode,
  TRAVERSAL_SPEED,
} from "../utils/functions";

type Params = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
};

export function useBFS({ nodes, edges, setNodes }: Params) {
  const [isRunning, setIsRunning] = useState(false);

  const queueRef = useRef<string[]>([]);
  const visitedRef = useRef<Set<string>>(new Set());
  const adjacencyRef = useRef<Map<string, string[]>>(new Map());

  const intervalRef = useRef<number | null>(null);

  const highlightNode = useCallback(
    (nodeId: string | null) => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          data: {
            ...node.data,
            isActive: node.id === nodeId,
          },
        })),
      );
    },
    [setNodes],
  );

  const stop = useCallback(() => {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = null;

    highlightNode(null);
  }, [highlightNode]);

  const step = useCallback(() => {
    if (queueRef.current.length === 0) {
      stop();
      return;
    }

    const current = queueRef.current.shift()!;

    highlightNode(current);

    const neighbors = adjacencyRef.current.get(current) ?? [];

    for (const neighbor of neighbors) {
      if (!visitedRef.current.has(neighbor)) {
        visitedRef.current.add(neighbor);
        queueRef.current.push(neighbor);
      }
    }
  }, [stop, highlightNode]);

  const start = useCallback(() => {
    if (isRunning || nodes.length === 0) return;

    setIsRunning(true);

    adjacencyRef.current = buildAdjacencyList(nodes, edges);

    const root = findRootNode(nodes);

    queueRef.current = [root.id];
    visitedRef.current = new Set([root.id]);

    intervalRef.current = globalThis.setInterval(step, TRAVERSAL_SPEED);
  }, [nodes, edges, step, isRunning]);

  return { start, stop, isRunning };
}
