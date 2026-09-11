import { useEffect, useState } from 'react';
import type { DashboardState } from '../types';
import { fetchDashboardState, triggerTick } from '../services/api';
import { RiskMap } from '../components/RiskMap';
import { StGnnVisualizer } from '../components/StGnnVisualizer';
import { Play, AlertTriangle, Activity, Droplets, Waves, RadioTower } from 'lucide-react';

export const Dashboard = () => {
  const [state, setState] = useState<DashboardState | null>(null);
  const [demoStage, setDemoStage] = useState(0); // 0: Normal, 1: Heavy, 2: Extreme, 3: Flash Flood

  const loadData = async () => {
    const data = await fetchDashboardState();
    setState(data);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const runDemo = async () => {
    const factors = [1.0, 2.5, 5.0, 8.0];
    const nextStage = (demoStage + 1) % 4;
    setDemoStage(nextStage);
    await triggerTick(factors[nextStage]);
    loadData();
  };

  if (!state) return <div className="p-8">Loading Dashboard...</div>;

  const maxRisk = Math.max(...state.villages.map(v => v.risk));

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto pb-24">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Operational Dashboard</h2>
        <button 
          onClick={runDemo}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition-all shadow-lg shadow-emerald-900/50"
        >
          <Play size={20} />
          <span>TRIGGER ACCELERATED SIMULATION (T=0 to T=120m) {demoStage > 0 && `(Stage ${demoStage}/3)`}</span>
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <KpiCard icon={<AlertTriangle />} title="Max Flood Risk" value={`${maxRisk.toFixed(1)}%`} alert={maxRisk > 75} />
        <KpiCard icon={<Activity />} title="Landslide Risk" value={`${(maxRisk * 0.8).toFixed(1)}%`} />
        <KpiCard icon={<Droplets />} title="Avg Rainfall" value="45 mm/hr" />
        <KpiCard icon={<Waves />} title="Max River Stage" value={`${Math.max(...state.villages.map(v => v.river_stage)).toFixed(2)}m`} />
        <KpiCard icon={<Droplets />} title="Soil Moisture" value="85%" />
        <KpiCard icon={<RadioTower />} title="Online Sensors" value="5 / 5" />
      </div>

      <div className="grid grid-cols-3 gap-6 h-[400px]">
        <div className="col-span-2">
          <RiskMap state={state} />
        </div>
        <div className="space-y-6">
          <StGnnVisualizer state={state} />
          
          <div className="bg-surface border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Physics-Informed Status</h3>
            <div className={`px-3 py-2 rounded flex items-center space-x-2 font-medium ${state.physics_status.status === 'PASS' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
              <div className={`w-3 h-3 rounded-full ${state.physics_status.status === 'PASS' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
              <span>{state.physics_status.status}: {state.physics_status.details}</span>
            </div>
          </div>
          
          <div className="bg-surface border border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Inference Telemetry</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>ST-GNN Routing:</span>
                <span className="text-emerald-400 font-mono">14ms</span>
              </div>
              <div className="flex justify-between">
                <span>PINN ONNX Runtime:</span>
                <span className="text-emerald-400 font-mono">28ms</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700 font-bold">
                <span>Total Latency:</span>
                <span className="text-emerald-500 font-mono">42ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ icon, title, value, alert = false }: { icon: any, title: string, value: string, alert?: boolean }) => (
  <div className={`bg-surface p-4 rounded-lg border flex flex-col justify-between ${alert ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-700'}`}>
    <div className="flex items-center space-x-2 text-slate-400 text-sm">
      {icon}
      <span>{title}</span>
    </div>
    <div className={`text-2xl font-bold mt-2 ${alert ? 'text-red-400' : 'text-slate-100'}`}>{value}</div>
  </div>
);
