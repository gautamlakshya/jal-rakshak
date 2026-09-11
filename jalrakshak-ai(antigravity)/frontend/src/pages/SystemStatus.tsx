

export const SystemStatus = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Resilience Telemetry</h2>
      <div className="bg-surface p-6 border border-slate-700 rounded-lg space-y-4 max-w-2xl shadow-lg">
        <h3 className="font-semibold text-slate-300 border-b border-slate-700 pb-2">Component Status</h3>
        
        <div className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700">
          <span className="font-medium">IMD API (Rainfall Data)</span>
          <span className="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Real-Time
          </span>
        </div>
        
        <div className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700">
          <span className="font-medium">INSAT-3DR (Cloudburst Overlays)</span>
          <span className="bg-emerald-900/50 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Real-Time
          </span>
        </div>
        
        <div className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700">
          <span className="font-medium">IoT Mesh Network (LoRa/BLE)</span>
          <span className="bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
            Simulated
          </span>
        </div>

        <div className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700">
          <span className="font-medium">JalRakshak Physics Engine</span>
          <span className="bg-purple-900/50 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">
            ONNX Runtime
          </span>
        </div>
      </div>
    </div>
  );
};
