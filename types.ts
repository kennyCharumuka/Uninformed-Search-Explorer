
export enum AlgorithmType {
  BFS = 'BFS',
  DFS = 'DFS',
  UCS = 'UCS',
  DIJKSTRA = 'Dijkstra'
}

export enum ScenarioType {
  STANDARD = 'Standard',
  DEEP_NARROW = 'Deep & Narrow',
  WIDE_SHALLOW = 'Wide & Shallow',
  UNIFORM_COST = 'Uniform Cost',
  VARIABLE_COST = 'Variable Cost'
}

export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface GraphScenario {
  id: ScenarioType;
  nodes: Node[];
  edges: Edge[];
  description: string;
}

export interface SearchState {
  current: string | null;
  frontier: string[];
  explored: string[];
  path: string[];
  totalCost: number;
  steps: number;
}

export interface AlgorithmDetails {
  id: AlgorithmType;
  name: string;
  description: string;
  completeness: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimality: string;
  mechanics: string;
  useCases: string[];
  strengths: string[];
  limitations: string[];
}
