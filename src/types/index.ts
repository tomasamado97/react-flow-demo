import type { Node, Edge } from "@xyflow/react";

export type GraphNode = Node<{
  label: string;
  isActive?: boolean;
  isAccepting?: boolean;
  isInitial?: boolean;
  isFinal?: boolean;
}>;

export type GraphEdge = Edge<{
  symbol: string;
}>;
