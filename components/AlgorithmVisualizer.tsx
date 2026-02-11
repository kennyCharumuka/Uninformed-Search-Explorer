
import React, { useState, useEffect } from 'react';
import { AlgorithmType, Node, Edge, SearchState, GraphScenario } from '../types';
import { Play, RotateCcw, ChevronRight, Activity, Database, Navigation } from 'lucide-react';

interface Props {
  algorithm: AlgorithmType;
  scenario: GraphScenario;
}

const AlgorithmVisualizer: React.FC<Props> = ({ algorithm, scenario }) => {
  const [state, setState] = useState<SearchState>({
    current: null,
    frontier: ['S'],
    explored: [],
    path: [],
    totalCost: 0,
    steps: 0
  });
  const [isRunning, setIsRunning] = useState(false);
  const [maxFrontierSize, setMaxFrontierSize] = useState(1);
  const [parents, setParents] = useState<Record<string, { parent: string, cost: number }>>({ 'S': { parent: '', cost: 0 } });

  const reset = () => {
    setState({
      current: null,
      frontier: ['S'],
      explored: [],
      path: [],
      totalCost: 0,
      steps: 0
    });
    setParents({ 'S': { parent: '', cost: 0 } });
    setIsRunning(false);
    setMaxFrontierSize(1);
  };

  useEffect(() => {
    reset();
  }, [algorithm, scenario]);

  const step = () => {
    if (state.frontier.length === 0 || state.current === 'G') {
      setIsRunning(false);
      return;
    }

    let nextFrontier = [...state.frontier];
    let currentNode: string;

    // Selection strategy
    if (algorithm === AlgorithmType.BFS) {
      currentNode = nextFrontier.shift()!;
    } else if (algorithm === AlgorithmType.DFS) {
      currentNode = nextFrontier.pop()!;
    } else { // UCS & Dijkstra (Search variant)
      let minIndex = 0;
      for (let i = 1; i < nextFrontier.length; i++) {
        if (parents[nextFrontier[i]].cost < parents[nextFrontier[minIndex]].cost) {
          minIndex = i;
        }
      }
      currentNode = nextFrontier.splice(minIndex, 1)[0];
    }

    if (currentNode === 'G') {
      const finalPath = [];
      let curr = 'G';
      while (curr !== '') {
        finalPath.unshift(curr);
        curr = parents[curr]?.parent || '';
      }
      setState(prev => ({
        ...prev,
        current: 'G',
        path: finalPath,
        totalCost: parents['G'].cost,
        steps: prev.steps + 1
      }));
      setIsRunning(false);
      return;
    }

    const nextExplored = [...state.explored, currentNode];
    const neighbors = scenario.edges.filter(e => e.from === currentNode);

    for (const edge of neighbors) {
      const neighborId = edge.to;
      const newCost = (parents[currentNode]?.cost || 0) + edge.weight;

      if (!nextExplored.includes(neighborId)) {
        if (nextFrontier.includes(neighborId)) {
          // Update cost if better path found (Standard Dijkstra/UCS relaxation)
          if ((algorithm === AlgorithmType.UCS || algorithm === AlgorithmType.DIJKSTRA) && newCost < parents[neighborId].cost) {
            setParents(prev => ({ ...prev, [neighborId]: { parent: currentNode, cost: newCost } }));
          }
        } else {
          nextFrontier.push(neighborId);
          setParents(prev => ({ ...prev, [neighborId]: { parent: currentNode, cost: newCost } }));
        }
      }
    }

    setMaxFrontierSize(prev => Math.max(prev, nextFrontier.length));
    setState(prev => ({
      ...prev,
      current: currentNode,
      frontier: nextFrontier,
      explored: nextExplored,
      steps: prev.steps + 1
    }));
  };

  useEffect(() => {
    let timer: any;
    if (isRunning) {
      timer = setTimeout(step, 800);
    }
    return () => clearTimeout(timer);
  }, [isRunning, state]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Visualizing {algorithm}</h3>
          <p className="text-sm text-slate-500">{scenario.id}: {scenario.description}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition shadow-sm ${isRunning ? 'bg-amber-100 text-amber-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {isRunning ? 'Pause' : <><Play className="w-4 h-4" /> Start</>}
          </button>
          <button 
            onClick={step}
            disabled={isRunning || state.current === 'G' || state.frontier.length === 0}
            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button 
            onClick={reset}
            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative border border-slate-100 rounded-xl bg-slate-50 overflow-hidden" style={{ height: '350px' }}>
        <svg width="100%" height="100%" viewBox="0 0 600 250">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="24" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>

          {scenario.edges.map((edge, i) => {
            const fromNode = scenario.nodes.find(n => n.id === edge.from)!;
            const toNode = scenario.nodes.find(n => n.id === edge.to)!;
            const isPath = state.path.includes(edge.from) && state.path.includes(edge.to) && state.path.indexOf(edge.to) === state.path.indexOf(edge.from) + 1;
            
            return (
              <g key={`edge-${i}`}>
                <line 
                  x1={fromNode.x} y1={fromNode.y} 
                  x2={toNode.x} y2={toNode.y} 
                  stroke={isPath ? '#22c55e' : '#cbd5e1'} 
                  strokeWidth={isPath ? 3 : 1.5}
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-500"
                />
                <text 
                  x={(fromNode.x + toNode.x) / 2} 
                  y={(fromNode.y + toNode.y) / 2 - 5} 
                  fontSize="10" 
                  className="fill-slate-400 font-bold"
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {scenario.nodes.map(node => {
            const isExplored = state.explored.includes(node.id);
            const isFrontier = state.frontier.includes(node.id);
            const isCurrent = state.current === node.id;
            const isPath = state.path.includes(node.id);

            let fillColor = "white";
            let strokeColor = "#cbd5e1";
            let textColor = "#475569";

            if (isCurrent) {
              fillColor = "#3b82f6";
              strokeColor = "#2563eb";
              textColor = "white";
            } else if (isPath) {
              fillColor = "#22c55e";
              strokeColor = "#16a34a";
              textColor = "white";
            } else if (isExplored) {
              fillColor = "#f1f5f9";
              strokeColor = "#94a3b8";
              textColor = "#64748b";
            } else if (isFrontier) {
              fillColor = "#fef3c7";
              strokeColor = "#f59e0b";
              textColor = "#92400e";
            }

            return (
              <g key={node.id} transform={`translate(${node.x},${node.y})`}>
                <circle r="20" fill={fillColor} stroke={strokeColor} strokeWidth="2" className="transition-all duration-300" />
                <text textAnchor="middle" dy=".3em" fontSize="11" fontWeight="700" fill={textColor}>
                  {node.id}
                </text>
                {(algorithm === AlgorithmType.UCS || algorithm === AlgorithmType.DIJKSTRA) && parents[node.id] && (
                  <text y="30" textAnchor="middle" fontSize="9" className="fill-slate-500 italic">
                    g={parents[node.id].cost}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Current</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-200 border border-amber-400 rounded-full"></span> Frontier</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-slate-100 border border-slate-300 rounded-full"></span> Explored</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span> Path</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-500 uppercase">Exploration</h4>
          </div>
          <div className="text-xl font-bold text-slate-800">{state.explored.length}</div>
          <div className="text-[10px] text-slate-400">Nodes visited</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-500 uppercase">Space Peak</h4>
          </div>
          <div className="text-xl font-bold text-slate-800">{maxFrontierSize}</div>
          <div className="text-[10px] text-slate-400">Max Frontier Size</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-green-500" />
            <h4 className="text-xs font-bold text-slate-500 uppercase">Solution</h4>
          </div>
          <div className="text-xl font-bold text-slate-800">{state.current === 'G' ? state.totalCost : '-'}</div>
          <div className="text-[10px] text-slate-400">Total Path Cost</div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
