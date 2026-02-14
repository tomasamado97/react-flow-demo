import { ReactFlow, Controls, Background, MiniMap, Panel } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./App.css";

import BasicNode from "./components/Nodes/BasicNode";
import { useBFS, useDFS, useFSM, useGraphState } from "./hooks";
import FSMEdge from "./components/Edges/FSMEdge";

const nodeTypes = {
  basic: BasicNode,
};

const edgeTypes = {
  fsmEdge: FSMEdge,
};

export default function GraphEditor() {
  const {
    input,
    nodes,
    edges,
    setInput,
    setNodes,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useGraphState();

  const bfsSimulation = useBFS({
    nodes,
    edges,
    setNodes,
  });

  const dfsSimulation = useDFS({
    nodes,
    edges,
    setNodes,
  });

  const fsmSimulation = useFSM({
    nodes,
    edges,
    setNodes,
  });

  const isSimulationRunning =
    bfsSimulation.isRunning ||
    dfsSimulation.isRunning ||
    fsmSimulation.isRunning;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodesConnectable={!isSimulationRunning}
        nodesDraggable={!isSimulationRunning}
        fitView
      >
        <Panel style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            disabled={isSimulationRunning}
            className="addNodeButton"
            onClick={addNode}
          >
            Add Node
          </button>

          <button
            className="addNodeButton"
            disabled={dfsSimulation.isRunning}
            onClick={
              bfsSimulation.isRunning ? bfsSimulation.stop : bfsSimulation.start
            }
          >
            {bfsSimulation.isRunning ? "Stop" : "Start BFS"}
          </button>

          <button
            className="addNodeButton"
            disabled={bfsSimulation.isRunning}
            onClick={
              dfsSimulation.isRunning ? dfsSimulation.stop : dfsSimulation.start
            }
          >
            {dfsSimulation.isRunning ? "Stop" : "Start DFS"}
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input string"
          />

          <button onClick={() => fsmSimulation.start(input)}>Run FSM</button>
        </Panel>

        <MiniMap position="bottom-left" />
        <Controls position="bottom-right" />
        <Background />
      </ReactFlow>
    </div>
  );
}
