
import React, { useState } from 'react';
import { AlgorithmType, ScenarioType } from './types';
import { ALGORITHMS, SCENARIOS } from './constants';
import AlgorithmVisualizer from './components/AlgorithmVisualizer';
import ComparisonTable from './components/ComparisonTable';
import { getAlgorithmDeepDive } from './services/geminiService';
import { Info, BookOpen, Layers, Lightbulb, AlertCircle, Sparkles, MessageSquare, Check, X, ChevronRight, LayoutGrid, Award, Brain } from 'lucide-react';

const App: React.FC = () => {
  const [activeAlg, setActiveAlg] = useState<AlgorithmType>(AlgorithmType.BFS);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>(ScenarioType.STANDARD);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAskingAi, setIsAskingAi] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");

  const currentDetails = ALGORITHMS[activeAlg];
  const currentScenario = SCENARIOS[activeScenario];

  const askAi = async (topic: string) => {
    setIsAskingAi(true);
    setAiResponse(null);
    const context = `Scenario context: ${activeScenario} (${currentScenario.description}). Current Algorithm: ${activeAlg}.`;
    const result = await getAlgorithmDeepDive(activeAlg, `${context} ${topic}`);
    setAiResponse(result || "Error communicating with AI.");
    setIsAskingAi(false);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Search Algorithm Lab</h1>
              <p className="text-xs text-slate-500 font-medium">Comparative Performance Analysis</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {Object.values(AlgorithmType).map((type) => (
              <button
                key={type}
                onClick={() => setActiveAlg(type)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  activeAlg === type 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type === AlgorithmType.DIJKSTRA && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                {type}
                {type === AlgorithmType.DIJKSTRA && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded uppercase">Bonus</span>}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* Scenario Selection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 px-3 border-r border-slate-200 pr-6">
            <LayoutGrid className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-700">Scenarios</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(ScenarioType).map((type) => (
              <button
                key={type}
                onClick={() => setActiveScenario(type)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  activeScenario === type
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visualizer Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                <Brain className="w-64 h-64" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                 <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-6 text-[10px] font-bold uppercase tracking-widest text-blue-300">
                      <Award className="w-3 h-3" />
                      Active Algorithm Analysis
                    </div>
                    <h2 className="text-4xl font-black mb-4 tracking-tight">{currentDetails.name}</h2>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-8">
                      {currentDetails.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-bold uppercase opacity-50 block mb-1">Time (Worst)</span>
                        <p className="font-mono font-bold text-blue-400">{currentDetails.timeComplexity}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-bold uppercase opacity-50 block mb-1">Memory (Peak)</span>
                        <p className="font-mono font-bold text-amber-400">{currentDetails.spaceComplexity}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-bold uppercase opacity-50 block mb-1">Optimality</span>
                        <p className="font-bold text-emerald-400">{currentDetails.optimality.split(' - ')[0]}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-bold uppercase opacity-50 block mb-1">Completeness</span>
                        <p className="font-bold text-purple-400">{currentDetails.completeness.split(' (')[0]}</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            <AlgorithmVisualizer algorithm={activeAlg} scenario={currentScenario} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-slate-900 font-bold">
                  <div className="p-2 bg-blue-50 rounded-lg"><Layers className="w-5 h-5 text-blue-500" /></div>
                  <h4 className="text-xl">Search Mechanics</h4>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {currentDetails.mechanics}
                </p>
              </section>

              <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-slate-900 font-bold">
                  <div className="p-2 bg-amber-50 rounded-lg"><Lightbulb className="w-5 h-5 text-amber-500" /></div>
                  <h4 className="text-xl">Common Use Cases</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentDetails.useCases.map((uc, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                      {uc}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-indigo-900 rounded-[2rem] p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-xl"><Sparkles className="w-5 h-5 text-amber-400" /></div>
                <h3 className="text-xl font-bold">AI Scholar Deep-Dive</h3>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => askAi(`Explain why ${activeAlg} behaves the way it does in the '${activeScenario}' scenario.`)}
                  disabled={isAskingAi}
                  className="w-full text-left text-xs bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition flex justify-between items-center group"
                >
                  Analyze current scenario
                  <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition" />
                </button>
                <button 
                  onClick={() => askAi("Compare UCS (Uniform-Cost Search) to Dijkstra's Algorithm. Are they the same?")}
                  disabled={isAskingAi}
                  className="w-full text-left text-xs bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 transition flex justify-between items-center group"
                >
                  UCS vs Dijkstra Comparison
                  <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition" />
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="relative">
                  <input 
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Ask about this scenario..."
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition"
                  />
                  <button 
                    onClick={() => askAi(customQuestion)}
                    disabled={!customQuestion || isAskingAi}
                    className="absolute right-2 top-2 p-2 bg-amber-400 text-indigo-950 rounded-lg hover:bg-amber-300 disabled:opacity-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {(isAskingAi || aiResponse) && (
              <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholar's Analysis</span>
                </div>
                {isAskingAi ? (
                  <div className="space-y-3">
                    <div className="h-2.5 bg-slate-100 rounded-full animate-pulse w-full"></div>
                    <div className="h-2.5 bg-slate-100 rounded-full animate-pulse w-[90%]"></div>
                    <div className="h-2.5 bg-slate-100 rounded-full animate-pulse w-[75%]"></div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-600 leading-relaxed prose prose-slate max-w-none font-medium">
                    {aiResponse?.split('\n').map((line, i) => (
                      <p key={i} className="mb-3">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
               <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-lg shadow-sm"><Info className="w-4 h-4 text-blue-500" /></div>
                Lab Insight
               </h4>
               <p className="text-xs text-slate-500 leading-relaxed">
                Notice how <strong>{activeScenario}</strong> highlights specific weaknesses. In the Variable Cost scenario, BFS fails to find the optimal path (cost vs edges). Dijkstra is the foundation for almost all modern navigation systems.
               </p>
            </div>
          </div>
        </div>

        {/* Global Comparison */}
        <section className="pt-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-1 bg-blue-600 rounded-full"></div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Theoretical Benchmark Matrix</h2>
          </div>
          <ComparisonTable />
        </section>
      </main>

      <footer className="mt-24 border-t border-slate-200 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-slate-400" />
             </div>
            
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
