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

export function useDFS({ nodes, edges, setNodes }: Params) {
  const [isRunning, setIsRunning] = useState(false);

  const stackRef = useRef<string[]>([]);
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
    if (stackRef.current.length === 0) {
      stop();
      return;
    }

    const current = stackRef.current.pop()!;

    highlightNode(current);

    const neighbors = adjacencyRef.current.get(current) ?? [];

    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];

      if (!visitedRef.current.has(neighbor)) {
        visitedRef.current.add(neighbor);
        stackRef.current.push(neighbor);
      }
    }
  }, [stop, highlightNode]);

  const start = useCallback(() => {
    if (isRunning || nodes.length === 0) return;

    setIsRunning(true);

    adjacencyRef.current = buildAdjacencyList(nodes, edges);

    const root = findRootNode(nodes);

    stackRef.current = [root.id];
    visitedRef.current = new Set([root.id]);

    intervalRef.current = globalThis.setInterval(step, TRAVERSAL_SPEED);
  }, [nodes, edges, step, isRunning]);

  return { start, stop, isRunning };
}
