import { useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export const Analytics = () => {
  // Mock Data for Hydrograph (Singtam)
  const hydroData = [
    { time: '00:00', inflow: 2.5, outflow: 2.5 },
    { time: '00:15', inflow: 3.8, outflow: 3.1 },
    { time: '00:30', inflow: 5.6, outflow: 4.2 },
    { time: '00:45', inflow: 7.9, outflow: 5.8 },
    { time: '01:00', inflow: 9.8, outflow: 7.2 }, // Over Bankfull (8.5)
    { time: '01:15', inflow: 11.5, outflow: 8.9 }, // Over Bankfull
    { time: '01:30', inflow: 10.2, outflow: 9.5 }, // Over Bankfull
    { time: '01:45', inflow: 8.4, outflow: 9.1 }, // Outflow lags
    { time: '02:00', inflow: 6.5, outflow: 7.8 },
  ];

  // Mock Data for PINN Loss
  const lossData = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
    epoch: i * 10,
    dataLoss: Math.exp(-i * 0.1) + Math.random() * 0.05,
    physicsLoss: Math.exp(-i * 0.05) + Math.random() * 0.1,
  })), []);

  return (
    <div className="p-6 max-h-screen overflow-y-auto pb-24 space-y-6">
      <h2 className="text-2xl font-bold mb-6">Hydrological Analytics & Model Convergence</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Hydrograph */}
        <div className="bg-surface border border-slate-700 rounded-lg p-6 shadow-lg h-[400px] flex flex-col">
          <h3 className="font-semibold text-lg mb-4 text-slate-300">Singtam Node Hydrograph</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hydroData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'Stage (m)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Legend verticalAlign="top" height={36} />
                <ReferenceLine y={8.5} label="Bankfull (8.5m)" stroke="red" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="inflow" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInflow)" name="Inflow (Q_in)" />
                <Line type="monotone" dataKey="outflow" stroke="#eab308" strokeWidth={2} dot={false} name="Outflow (Q_out)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PINN Loss Convergence */}
        <div className="bg-surface border border-slate-700 rounded-lg p-6 shadow-lg h-[400px] flex flex-col">
          <h3 className="font-semibold text-lg mb-4 text-slate-300">PINN Training Loss Convergence</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lossData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="epoch" stroke="#94a3b8" label={{ value: 'Epochs', position: 'insideBottomRight', offset: -5 }} />
                <YAxis stroke="#94a3b8" scale="log" domain={['auto', 'auto']} label={{ value: 'Log Loss', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="dataLoss" stroke="#10b981" dot={false} strokeWidth={2} name="Data Loss (MSE)" />
                <Line type="monotone" dataKey="physicsLoss" stroke="#8b5cf6" dot={false} strokeWidth={2} name="Physics Residual (Saint-Venant)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
