
import { AlgorithmType, AlgorithmDetails, Node, Edge, ScenarioType, GraphScenario } from './types';

export const ALGORITHMS: Record<AlgorithmType, AlgorithmDetails> = {
  [AlgorithmType.BFS]: {
    id: AlgorithmType.BFS,
    name: 'Breadth-First Search (BFS)',
    description: 'Explores the neighbor nodes first, before moving to the next level neighbors.',
    mechanics: 'Uses a FIFO (First-In, First-Out) queue to track the frontier. It expands the shallowest nodes first, ensuring that it explores all nodes at level d before moving to level d+1.',
    completeness: 'Complete (if branching factor b is finite).',
    timeComplexity: 'O(b^d)',
    spaceComplexity: 'O(b^d) - all nodes in memory.',
    optimality: 'Optimal only if all step costs are equal (uniform cost).',
    useCases: [
      'Finding the shortest path in unweighted graphs',
      'Social network "friend of a friend" search',
      'Web crawlers for level-by-level indexing',
      'GPS navigation systems (simple grids)'
    ],
    strengths: [
      'Guaranteed to find the shortest path (in terms of edges)',
      'Never gets stuck in infinite loops (if state tracking is used)'
    ],
    limitations: [
      'Extreme memory consumption for large branching factors',
      'Not optimal if paths have varying costs'
    ]
  },
  [AlgorithmType.DFS]: {
    id: AlgorithmType.DFS,
    name: 'Depth-First Search (DFS)',
    description: 'Explores as far as possible along each branch before backtracking.',
    mechanics: 'Uses a LIFO (Last-In, First-Out) stack to track the frontier. It proceeds to the deepest node in the current path until it reaches a goal or a leaf node, then backtracks.',
    completeness: 'Not complete in infinite-depth spaces or graphs with cycles (without cycle detection).',
    timeComplexity: 'O(b^m) where m is maximum depth.',
    spaceComplexity: 'O(bm) - linear memory relative to depth.',
    optimality: 'Not optimal - might find a much longer path than necessary.',
    useCases: [
      'Solving puzzles like Mazes or Sudoku',
      'Topology sorting in build systems',
      'Finding connected components in a graph',
      'Pathfinding where memory is extremely limited'
    ],
    strengths: [
      'Very memory-efficient compared to BFS',
      'Fast for finding *any* solution if the solution is deep'
    ],
    limitations: [
      'Can get stuck in infinite paths',
      'Path found is rarely the shortest'
    ]
  },
  [AlgorithmType.UCS]: {
    id: AlgorithmType.UCS,
    name: 'Uniform-Cost Search (UCS)',
    description: 'Expands the lowest cumulative cost node first.',
    mechanics: 'A variant of BFS using a Priority Queue ordered by path cost g(n). It always expands the node with the lowest total cost from the start, effectively implementing Dijkstra’s algorithm.',
    completeness: 'Complete if step costs are ≥ ε > 0.',
    timeComplexity: 'O(b^(C*/ε)) where C* is optimal cost.',
    spaceComplexity: 'O(b^(C*/ε))',
    optimality: 'Optimal for any non-negative step costs.',
    useCases: [
      'Google Maps / GPS navigation with traffic (weighted edges)',
      'Network routing protocols (OSPF)',
      'Resource allocation in manufacturing',
      'Speech recognition (Viterbi decoding)'
    ],
    strengths: [
      'Always finds the lowest-cost path',
      'More efficient than BFS when edge weights vary'
    ],
    limitations: [
      'Slow if there are many low-cost paths that do not lead to the goal',
      'Memory intensive like BFS'
    ]
  },
  [AlgorithmType.DIJKSTRA]: {
    id: AlgorithmType.DIJKSTRA,
    name: "Dijkstra's Algorithm",
    description: "Finds the shortest paths between nodes in a graph, which may represent road networks.",
    mechanics: "Maintains a set of 'visited' nodes and a set of 'unvisited' nodes. It repeatedly selects the unvisited node with the smallest distance from the start, updates its neighbors' distances, and marks it as visited.",
    completeness: "Complete on graphs with non-negative edge weights.",
    timeComplexity: "O(V²), or O(E + V log V) with a Fibonacci Heap.",
    spaceComplexity: "O(V) to store the distances to all vertices.",
    optimality: "Always optimal for non-negative edge weights.",
    useCases: [
      'Network Routing Protocols (OSPF)',
      'GPS and Digital Maps (Google Maps)',
      'IP Routing',
      'Finding the shortest path in social networking'
    ],
    strengths: [
      'Extremely efficient for single-source shortest path problems',
      'Mathematically robust and widely implemented'
    ],
    limitations: [
      'Cannot handle negative edge weights (unlike Bellman-Ford)',
      'Can be overkill for simple goal-oriented search (UCS is the search variant)'
    ]
  }
};

export const SCENARIOS: Record<ScenarioType, GraphScenario> = {
  [ScenarioType.STANDARD]: {
    id: ScenarioType.STANDARD,
    description: "A balanced graph to demonstrate basic algorithm behavior.",
    nodes: [
      { id: 'S', label: 'Start', x: 50, y: 100 },
      { id: 'A', label: 'A', x: 200, y: 50 },
      { id: 'B', label: 'B', x: 200, y: 150 },
      { id: 'C', label: 'C', x: 350, y: 50 },
      { id: 'D', label: 'D', x: 350, y: 150 },
      { id: 'G', label: 'Goal', x: 500, y: 100 },
    ],
    edges: [
      { from: 'S', to: 'A', weight: 2 },
      { from: 'S', to: 'B', weight: 5 },
      { from: 'A', to: 'C', weight: 3 },
      { from: 'A', to: 'D', weight: 8 },
      { from: 'B', to: 'D', weight: 4 },
      { from: 'C', to: 'G', weight: 6 },
      { from: 'D', to: 'G', weight: 2 },
    ]
  },
  [ScenarioType.DEEP_NARROW]: {
    id: ScenarioType.DEEP_NARROW,
    description: "Deep tree where DFS might find a deep solution fast, while BFS explores layers.",
    nodes: [
      { id: 'S', label: 'Start', x: 50, y: 100 },
      { id: 'A', label: 'A', x: 150, y: 50 },
      { id: 'A1', label: 'A1', x: 250, y: 30 },
      { id: 'A2', label: 'A2', x: 350, y: 20 },
      { id: 'B', label: 'B', x: 150, y: 150 },
      { id: 'B1', label: 'B1', x: 250, y: 170 },
      { id: 'B2', label: 'B2', x: 350, y: 180 },
      { id: 'B3', label: 'B3', x: 450, y: 190 },
      { id: 'G', label: 'Goal', x: 550, y: 200 },
    ],
    edges: [
      { from: 'S', to: 'A', weight: 1 },
      { from: 'A', to: 'A1', weight: 1 },
      { from: 'A1', to: 'A2', weight: 1 },
      { from: 'S', to: 'B', weight: 1 },
      { from: 'B', to: 'B1', weight: 1 },
      { from: 'B1', to: 'B2', weight: 1 },
      { from: 'B2', to: 'B3', weight: 1 },
      { from: 'B3', to: 'G', weight: 1 },
    ]
  },
  [ScenarioType.WIDE_SHALLOW]: {
    id: ScenarioType.WIDE_SHALLOW,
    description: "High branching factor at root. BFS must visit many nodes at layer 1.",
    nodes: [
      { id: 'S', label: 'Start', x: 50, y: 125 },
      { id: 'A', label: 'A', x: 250, y: 25 },
      { id: 'B', label: 'B', x: 250, y: 75 },
      { id: 'C', label: 'C', x: 250, y: 125 },
      { id: 'D', label: 'D', x: 250, y: 175 },
      { id: 'E', label: 'E', x: 250, y: 225 },
      { id: 'G', label: 'Goal', x: 450, y: 125 },
    ],
    edges: [
      { from: 'S', to: 'A', weight: 1 },
      { from: 'S', to: 'B', weight: 1 },
      { from: 'S', to: 'C', weight: 1 },
      { from: 'S', to: 'D', weight: 1 },
      { from: 'S', to: 'E', weight: 1 },
      { from: 'A', to: 'G', weight: 10 },
      { from: 'B', to: 'G', weight: 10 },
      { from: 'C', to: 'G', weight: 10 },
      { from: 'D', to: 'G', weight: 10 },
      { from: 'E', to: 'G', weight: 1 },
    ]
  },
  [ScenarioType.UNIFORM_COST]: {
    id: ScenarioType.UNIFORM_COST,
    description: "All weights are 1. BFS and UCS should produce identical results.",
    nodes: [
      { id: 'S', label: 'Start', x: 50, y: 100 },
      { id: 'A', label: 'A', x: 200, y: 50 },
      { id: 'B', label: 'B', x: 200, y: 150 },
      { id: 'C', label: 'C', x: 350, y: 50 },
      { id: 'D', label: 'D', x: 350, y: 150 },
      { id: 'G', label: 'Goal', x: 500, y: 100 },
    ],
    edges: [
      { from: 'S', to: 'A', weight: 1 },
      { from: 'S', to: 'B', weight: 1 },
      { from: 'A', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 1 },
      { from: 'C', to: 'G', weight: 1 },
      { from: 'D', to: 'G', weight: 1 },
    ]
  },
  [ScenarioType.VARIABLE_COST]: {
    id: ScenarioType.VARIABLE_COST,
    description: "BFS will choose the 'shorter' path (S-A-G), but UCS finds the 'cheaper' path (S-B-C-D-G).",
    nodes: [
      { id: 'S', label: 'Start', x: 50, y: 100 },
      { id: 'A', label: 'A', x: 250, y: 40 },
      { id: 'B', label: 'B', x: 150, y: 160 },
      { id: 'C', label: 'C', x: 300, y: 180 },
      { id: 'D', label: 'D', x: 450, y: 160 },
      { id: 'G', label: 'Goal', x: 500, y: 80 },
    ],
    edges: [
      { from: 'S', to: 'A', weight: 10 },
      { from: 'A', to: 'G', weight: 10 },
      { from: 'S', to: 'B', weight: 1 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'G', weight: 1 },
    ]
  }
};
