export const PredictionEngine = () => {
  return <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">SCS-CN Runoff Sandbox</h2>
    <div className="bg-surface p-6 rounded border border-slate-700 max-w-2xl">
      <p className="text-slate-400 mb-4">Adjust parameters to see slope-adjusted runoff predictions.</p>
      {/* Sandbox placeholder */}
      <div className="space-y-4">
        <div><label>Rainfall (mm)</label><input type="range" className="w-full" /></div>
        <div><label>Curve Number</label><input type="range" className="w-full" /></div>
        <div><label>Slope (degrees)</label><input type="range" className="w-full" /></div>
        <div><label>Moisture (%)</label><input type="range" className="w-full" /></div>
      </div>
    </div>
  </div>
};

export const ScenarioSimulator = () => <div className="p-6"><h2 className="text-2xl font-bold">Scenario Simulator</h2><div className="mt-4 flex space-x-4"><button className="bg-slate-700 p-3 rounded">Normal Monsoon</button><button className="bg-slate-700 p-3 rounded">Flash Flood</button></div></div>;

export const AlertCenter = () => <div className="p-6"><h2 className="text-2xl font-bold">CAP v1.2 Alerts</h2><div className="mt-4 flex space-x-2"><button className="bg-slate-700 px-3 py-1 rounded">English</button><button className="bg-slate-700 px-3 py-1 rounded">हिन्दी</button><button className="bg-slate-700 px-3 py-1 rounded">অসমীয়া</button></div></div>;

export const FieldOfficer = () => <div className="p-6"><h2 className="text-2xl font-bold">Field Officer UI</h2><div className="mt-4"><button className="bg-blue-600 w-full p-4 rounded font-bold">LIVE MESH MODE</button><button className="bg-red-600 w-full p-4 rounded font-bold mt-4 animate-pulse">MARK EVACUATION STARTED</button></div></div>;

export const Analytics = () => <div className="p-6"><h2 className="text-2xl font-bold">Analytics & Graphs</h2><div className="bg-surface h-64 mt-4 border border-slate-700 rounded flex items-center justify-center text-slate-500">Recharts Area (Rainfall vs Runoff)</div></div>;

export const SystemStatus = () => <div className="p-6"><h2 className="text-2xl font-bold">Resilience Telemetry</h2><div className="bg-surface p-4 mt-4 border border-slate-700 rounded space-y-2"><div className="flex justify-between"><span>IMD API</span><span className="text-emerald-400">Real</span></div><div className="flex justify-between"><span>INSAT-3DR</span><span className="text-emerald-400">Real</span></div><div className="flex justify-between"><span>IoT Mesh</span><span className="text-blue-400">Simulated</span></div></div></div>;
