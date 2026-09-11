import type { DashboardState } from '../types';

export const StGnnVisualizer = ({ state }: { state: DashboardState | null }) => {
  if (!state) return null;

  return (
    <div className="bg-surface border border-slate-700 rounded-lg p-4">
      <h3 className="font-semibold mb-4 flex items-center justify-between">
        <span>ST-GNN Prototype Visualization</span>
        <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-400 rounded">Live Topological Flow</span>
      </h3>
      <div className="flex flex-col space-y-2">
        {state.villages.map((v, i) => (
          <div key={v.id} className="flex items-center space-x-4">
            <div className={`w-12 text-right text-xs font-mono ${v.risk > 75 ? 'text-red-400' : 'text-slate-400'}`}>
              {v.risk.toFixed(0)}%
            </div>
            <div className="relative flex-1 h-8 bg-slate-800 rounded overflow-hidden flex items-center">
              <div 
                className={`absolute top-0 left-0 h-full transition-all duration-500 ${v.risk > 75 ? 'bg-red-500/50' : v.risk > 50 ? 'bg-orange-500/50' : 'bg-blue-500/50'}`}
                style={{ width: `${v.risk}%` }}
              />
              <span className="relative z-10 px-3 text-sm font-medium">{v.name}</span>
            </div>
            {i < state.villages.length - 1 && (
              <div className="w-8 flex justify-center animate-pulse text-blue-500">↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
