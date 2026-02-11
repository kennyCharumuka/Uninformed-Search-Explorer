
import React from 'react';
import { ALGORITHMS } from '../constants';
import { Check, X, Minus } from 'lucide-react';

const ComparisonTable: React.FC = () => {
  const algs = Object.values(ALGORITHMS);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="font-bold text-slate-800">Criteria Comparison Matrix</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
              <th className="px-6 py-4">Algorithm</th>
              <th className="px-6 py-4">Completeness</th>
              <th className="px-6 py-4">Time Complexity</th>
              <th className="px-6 py-4">Space Complexity</th>
              <th className="px-6 py-4">Optimality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {algs.map((alg) => (
              <tr key={alg.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-bold text-slate-800">{alg.id}</td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    {alg.completeness.includes('Complete') && !alg.completeness.includes('Not') ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                    {alg.completeness}
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-600 bg-slate-50/50">{alg.timeComplexity}</td>
                <td className="px-6 py-4 font-mono text-slate-600">{alg.spaceComplexity}</td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    {alg.optimality.includes('Optimal') && !alg.optimality.includes('Not') ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                    {alg.optimality}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
