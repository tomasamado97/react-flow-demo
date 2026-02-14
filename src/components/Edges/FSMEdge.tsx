import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { memo, useCallback } from "react";
import type { GraphEdge } from "../../types";

function FSMEdge({ id, data, ...rest }: EdgeProps<GraphEdge>) {
  const [path, labelX, labelY] = getBezierPath(rest);
  const { setEdges } = useReactFlow();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const symbol = e.target.value;

      setEdges((edges) =>
        edges.map((edge) =>
          edge.id === id
            ? {
                ...edge,
                data: {
                  ...edge.data,
                  symbol,
                },
              }
            : edge,
        ),
      );
    },
    [id, setEdges],
  );

  return (
    <>
      <BaseEdge {...rest} path={path} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <input
            value={data?.symbol ?? ""}
            onChange={onChange}
            placeholder="ε"
            style={{
              width: 40,
              textAlign: "center",
              fontSize: 12,
              padding: "2px 4px",
              borderRadius: 4,
              border: "1px solid #555",
              background: "#222",
              color: "#fff",
            }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(FSMEdge);
