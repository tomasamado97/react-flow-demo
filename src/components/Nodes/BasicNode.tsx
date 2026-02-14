import { memo } from "react";
import { Handle, Position, useReactFlow, type NodeProps } from "@xyflow/react";
import type { GraphNode } from "../../types";

function BasicNode({ id, data }: NodeProps<GraphNode>) {
  const { setNodes } = useReactFlow();
  return (
    <>
      {id !== "n1" && <Handle type="target" position={Position.Top} />}

      <div
        onDoubleClick={() =>
          setNodes((nodes) =>
            nodes.map((n) => ({
              ...n,
              data: {
                ...n.data,
                isInitial: n.id === id,
              },
            })),
          )
        }
        className={`
          node
          ${data.isActive ? "highlighted" : ""}
          ${!data.isActive && data.isInitial ? "initial" : ""}
          ${!data.isActive && data.isFinal ? "final" : ""}
          ${!data.isActive && data.isAccepting ? "accepting" : ""}
        `}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(BasicNode);
