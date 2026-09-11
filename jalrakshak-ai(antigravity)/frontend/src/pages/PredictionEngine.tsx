import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const PredictionEngine = () => {
  const [rainfall, setRainfall] = useState(150);
  const [baseCn, setBaseCn] = useState(75);
  const [slope, setSlope] = useState(25);
  const [moisture, setMoisture] = useState(60);

  // Math logic
  // Slope adjusted CN formula
  const cn2alpha = baseCn * ((322.79 + 15.63 * slope) / (slope + 323.52));
  
  // Standard retention
  const sStandard = (25400 / baseCn) - 254;
  // Slope-adjusted retention
  const sAdjusted = (25400 / cn2alpha) - 254;

  // Runoff calculations (P = rainfall)
  const calculateRunoff = (p: number, s: number) => {
    if (p <= 0.2 * s) return 0;
    return Math.pow(p - 0.2 * s, 2) / (p + 0.8 * s);
  };

  const qAdjusted = calculateRunoff(rainfall, sAdjusted);

  // Generate chart data series from P=0 to P=300
  const chartData = [];
  for (let p = 0; p <= 300; p += 20) {
    chartData.push({
      rainfall: p,
      standardRunoff: calculateRunoff(p, sStandard).toFixed(2),
      adjustedRunoff: calculateRunoff(p, sAdjusted).toFixed(2),
    });
  }

  return (
    <div className="p-6 max-h-screen overflow-y-auto pb-24">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">Physics-Informed Prediction Engine</h2>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Sandbox Controls */}
        <div className="bg-surface p-6 rounded-lg border border-slate-700 space-y-6 shadow-lg">
          <h3 className="font-semibold text-lg border-b border-slate-700 pb-2">Environmental Sandbox</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-400">Rainfall (P)</label>
              <span className="font-mono">{rainfall} mm</span>
            </div>
            <input type="range" min="0" max="300" value={rainfall} onChange={e => setRainfall(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-400">Base Curve Number (CN₂)</label>
              <span className="font-mono">{baseCn}</span>
            </div>
            <input type="range" min="30" max="100" value={baseCn} onChange={e => setBaseCn(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-400">Slope (α)</label>
              <span className="font-mono">{slope}°</span>
            </div>
            <input type="range" min="0" max="60" value={slope} onChange={e => setSlope(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-400">Soil Moisture</label>
              <span className="font-mono">{moisture}%</span>
            </div>
            <input type="range" min="0" max="100" value={moisture} onChange={e => setMoisture(Number(e.target.value))} className="w-full accent-emerald-500" />
          </div>
        </div>

        {/* Live Math Calculation Cards */}
        <div className="space-y-4">
          <div className="bg-surface p-4 rounded-lg border border-slate-700 shadow-lg">
            <div className="text-sm text-slate-400 mb-1">Slope-Adjusted CN (CN₂ₐ)</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{cn2alpha.toFixed(2)}</div>
            <div className="text-xs text-slate-500 mt-2 font-mono">CN₂ × [(322.79 + 15.63 × α) / (α + 323.52)]</div>
          </div>
          
          <div className="bg-surface p-4 rounded-lg border border-slate-700 shadow-lg">
            <div className="text-sm text-slate-400 mb-1">Potential Retention (S)</div>
            <div className="text-2xl font-bold font-mono text-blue-400">{sAdjusted.toFixed(2)} mm</div>
            <div className="text-xs text-slate-500 mt-2 font-mono">(25400 / CN₂ₐ) - 254</div>
          </div>

          <div className="bg-surface p-4 rounded-lg border border-slate-700 shadow-lg">
            <div className="text-sm text-slate-400 mb-1">Runoff Depth (Q_surf)</div>
            <div className="text-2xl font-bold font-mono text-red-400">{qAdjusted.toFixed(2)} mm</div>
            <div className="text-xs text-slate-500 mt-2 font-mono">(P - 0.2S)² / (P + 0.8S)</div>
          </div>
        </div>

        {/* Recharts Graph */}
        <div className="bg-surface p-4 rounded-lg border border-slate-700 shadow-lg flex flex-col">
          <h3 className="font-semibold text-center mb-4">Runoff: Standard vs. Slope-Adjusted</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="rainfall" stroke="#94a3b8" label={{ value: 'Rainfall (mm)', position: 'insideBottomRight', offset: -10 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Legend verticalAlign="top" height={36}/>
                <Line type="monotone" dataKey="standardRunoff" name="Standard (Flat)" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="adjustedRunoff" name={`Adjusted (${slope}°)`} stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
