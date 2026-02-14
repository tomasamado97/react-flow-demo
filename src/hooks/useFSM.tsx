import { useCallback, useRef, useState } from "react";
import type { GraphNode, GraphEdge } from "../types";

type Params = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  setNodes: React.Dispatch<React.SetStateAction<GraphNode[]>>;
};

export function useFSM({ nodes, edges, setNodes }: Params) {
  const [isRunning, setIsRunning] = useState(false);

  const inputRef = useRef("");
  const currentIndexRef = useRef(0);
  const currentStateRef = useRef<string | null>(null);

  const transitionMapRef = useRef<Map<string, Map<string, string>>>(new Map());

  const intervalRef = useRef<number | null>(null);

  const buildTransitionTable = useCallback(() => {
    const map = new Map<string, Map<string, string>>();

    for (const edge of edges) {
      const symbol = edge.data?.symbol;

      if (!symbol) continue;

      if (!map.has(edge.source)) {
        map.set(edge.source, new Map());
      }

      map.get(edge.source)!.set(symbol, edge.target);
    }

    transitionMapRef.current = map;
  }, [edges]);

  const highlightNode = useCallback(
    (nodeId: string | null) => {
      setNodes((nodes) =>
        nodes.map((node) => ({
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

  const findInitialState = useCallback(() => {
    const initial = nodes.find((n) => n.data.isInitial);

    return initial?.id ?? null;
  }, [nodes]);

  const stop = useCallback(() => {
    setIsRunning(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    highlightNode(null);
    intervalRef.current = null;
  }, [highlightNode]);

  const step = useCallback(() => {
    const input = inputRef.current;

    if (currentIndexRef.current >= input.length) {
      globalThis.alert("Final State is: " + currentStateRef.current);
      stop();
      return;
    }

    const symbol = input[currentIndexRef.current];

    const transitions = transitionMapRef.current.get(currentStateRef.current!);

    if (!transitions || !transitions.has(symbol)) {
      globalThis.alert(
        `Could not find a state for ${symbol}. Please check your input.`,
      );
      stop();
      return;
    }

    const nextState = transitions.get(symbol)!;

    currentStateRef.current = nextState;

    highlightNode(nextState);

    currentIndexRef.current++;
  }, [stop, highlightNode]);

  const start = useCallback(
    (input: string) => {
      if (isRunning) return;

      buildTransitionTable();

      const initialState = findInitialState();

      if (!initialState) {
        alert("No initial state defined");
        return;
      }

      inputRef.current = input;
      currentIndexRef.current = 0;
      currentStateRef.current = initialState;

      highlightNode(initialState);

      setIsRunning(true);

      intervalRef.current = globalThis.setInterval(step, 800);
    },
    [isRunning, highlightNode, buildTransitionTable, step, findInitialState],
  );

  return {
    start,
    stop,
    isRunning,
  };
}
