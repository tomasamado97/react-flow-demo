import { useCallback, useRef, useState } from "react";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type EdgeChange,
  type Connection,
  type NodeChange,
} from "@xyflow/react";

import type { GraphNode, GraphEdge } from "../types";

const defaultNodes: GraphNode[] = [
  {
    id: "n1",
    type: "basic",
    position: { x: -42, y: -154 },
    data: {
      label: "N1",
      isActive: false,
      isInitial: true,
      isAccepting: false,
    },
  },

  {
    id: "n13",
    type: "basic",
    position: { x: -116, y: 92 },
    data: {
      label: "N13",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n15",
    type: "basic",
    position: { x: 32, y: 90 },
    data: {
      label: "N15",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n7",
    type: "basic",
    position: { x: -274, y: 93 },
    data: {
      label: "N7",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n20",
    type: "basic",
    position: { x: 184, y: 91 },
    data: {
      label: "N20",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n12",
    type: "basic",
    position: { x: -118, y: 323 },
    data: {
      label: "N12",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n14",
    type: "basic",
    position: { x: 10, y: 323 },
    data: {
      label: "N14",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n16",
    type: "basic",
    position: { x: -391, y: 331 },
    data: {
      label: "N16",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n18",
    type: "basic",
    position: { x: 329, y: 312 },
    data: {
      label: "N18",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n19",
    type: "basic",
    position: { x: 189, y: 311 },
    data: {
      label: "N19",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },

  {
    id: "n22",
    type: "basic",
    position: { x: -279, y: 319 },
    data: {
      label: "N22",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n6",
    type: "basic",
    position: { x: -495, y: 331 },
    data: {
      label: "N6",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },

  {
    id: "n21",
    type: "basic",
    position: { x: -395, y: 516 },
    data: {
      label: "N21",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },

  {
    id: "n11",
    type: "basic",
    position: { x: -6, y: 525 },
    data: {
      label: "N11",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },

  {
    id: "n4",
    type: "basic",
    position: { x: 105, y: 526 },
    data: {
      label: "N4",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },

  {
    id: "n10",
    type: "basic",
    position: { x: 345, y: 513 },
    data: {
      label: "N10",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n8",
    type: "basic",
    position: { x: 486, y: 515 },
    data: {
      label: "N8",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n2",
    type: "basic",
    position: { x: -121, y: 523 },
    data: {
      label: "N2",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },

  {
    id: "n5",
    type: "basic",
    position: { x: 519, y: 673 },
    data: {
      label: "N5",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },

  {
    id: "n9",
    type: "basic",
    position: { x: 355, y: 685 },
    data: {
      label: "N9",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },

  {
    id: "n3",
    type: "basic",
    position: { x: 674, y: 673 },
    data: {
      label: "N3",
      isActive: false,
      isInitial: false,
      isAccepting: false,
    },
  },

  {
    id: "n17",
    type: "basic",
    position: { x: 672, y: 814 },
    data: {
      label: "N17",
      isActive: false,
      isInitial: false,
      isAccepting: true,
    },
  },
];

const defaultEdges: GraphEdge[] = [
  {
    id: "xy-edge__n14-n11",
    source: "n14",
    type: "fsmEdge",
    target: "n11",
    data: { symbol: "0" },
  },
  {
    id: "xy-edge__n14-n4",
    source: "n14",
    target: "n4",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n15-n14",
    source: "n15",
    target: "n14",
    type: "fsmEdge",
    data: { symbol: "0" },
  },
  {
    id: "xy-edge__n13-n12",
    source: "n13",
    target: "n12",
    type: "fsmEdge",
    data: { symbol: "0" },
  },
  {
    id: "xy-edge__n12-n2",
    source: "n12",
    target: "n2",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n1-n13",
    source: "n1",
    target: "n13",
    type: "fsmEdge",
    data: { symbol: "0" },
  },
  {
    id: "xy-edge__n1-n15",
    source: "n1",
    target: "n15",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n1-n7",
    source: "n1",
    target: "n7",
    type: "fsmEdge",
    data: { symbol: "2" },
  },
  {
    id: "xy-edge__n7-n16",
    source: "n7",
    target: "n16",
    type: "fsmEdge",
    data: { symbol: "0" },
  },
  {
    id: "xy-edge__n7-n6",
    source: "n7",
    target: "n6",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n7-n22",
    source: "n7",
    target: "n22",
    type: "fsmEdge",
    data: { symbol: "2" },
  },
  {
    id: "xy-edge__n16-n21",
    source: "n16",
    target: "n21",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n1-n20",
    source: "n1",
    target: "n20",
    type: "fsmEdge",
    data: { symbol: "3" },
  },
  {
    id: "xy-edge__n20-n19",
    source: "n20",
    target: "n19",
    type: "fsmEdge",
    data: { symbol: "0" },
  },
  {
    id: "xy-edge__n20-n18",
    source: "n20",
    target: "n18",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n18-n10",
    source: "n18",
    target: "n10",
    type: "fsmEdge",
    data: { symbol: "0" },
  },
  {
    id: "xy-edge__n10-n9",
    source: "n10",
    target: "n9",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n18-n8",
    source: "n18",
    target: "n8",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n8-n5",
    source: "n8",
    target: "n5",
    type: "fsmEdge",
    data: { symbol: "0" },
  },
  {
    id: "xy-edge__n8-n3",
    source: "n8",
    target: "n3",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
  {
    id: "xy-edge__n3-n17",
    source: "n3",
    target: "n17",
    type: "fsmEdge",
    data: { symbol: "1" },
  },
];

export function useGraphState() {
  const [input, setInput] = useState("");
  const [nodes, setNodes] = useState<GraphNode[]>(defaultNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(defaultEdges);

  const idRef = useRef(22);

  const generateId = () => {
    idRef.current += 1;
    return `n${idRef.current}`;
  };

  const addNode = useCallback(() => {
    const id = generateId();

    const newNode: GraphNode = {
      id,
      type: "basic",
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: `Node ${idRef.current}`,
        isActive: false,
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodes) => applyNodeChanges(changes, nodes)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edges) => applyEdgeChanges(changes, edges)),
    [],
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((edges) => addEdge(connection, edges)),
    [],
  );

  return {
    input,
    setInput,
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  };
}
