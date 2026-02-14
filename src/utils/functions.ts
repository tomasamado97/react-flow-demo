import type { GraphNode, GraphEdge } from "../types";

export const TRAVERSAL_SPEED: number = 200;

export function buildNodeLookup(nodes: GraphNode[]) {
  const map = new Map<string, GraphNode>();

  for (const node of nodes) {
    map.set(node.id, node);
  }

  return map;
}

export function sortNodeIdsSpatially(
  nodeIds: string[],
  lookup: Map<string, GraphNode>,
) {
  return [...nodeIds].sort((a, b) => {
    const A = lookup.get(a)!;
    const B = lookup.get(b)!;

    return A.position.x - B.position.x;
  });
}

export function buildAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]) {
  const lookup = buildNodeLookup(nodes);

  const adjacency = new Map<string, string[]>();

  for (const edge of edges) {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, []);
    }

    adjacency.get(edge.source)!.push(edge.target);
  }

  for (const [source, neighbors] of adjacency.entries()) {
    adjacency.set(source, sortNodeIdsSpatially(neighbors, lookup));
  }

  return adjacency;
}

export function findRootNode(nodes: GraphNode[]) {
  return nodes.reduce((best, current) => {
    if (current.position.y < best.position.y) return current;

    if (
      current.position.y === best.position.y &&
      current.position.x < best.position.x
    ) {
      return current;
    }

    return best;
  });
}
