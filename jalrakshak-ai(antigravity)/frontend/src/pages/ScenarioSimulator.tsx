import { useState } from 'react';
import { Play, Pause, CloudRain, CloudLightning, Waves } from 'lucide-react';

export const ScenarioSimulator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0); // 0 to 120
  const [activeScenario, setActiveScenario] = useState('Normal Monsoon');

  const scenarios = [
    { name: 'Normal Monsoon', icon: <CloudRain className="mr-2" />, color: 'text-blue-400' },
    { name: 'Cloudburst Event', icon: <CloudLightning className="mr-2" />, color: 'text-yellow-400' },
    { name: 'Upstream Dam Failure', icon: <Waves className="mr-2" />, color: 'text-red-400' },
  ];

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(Number(e.target.value));
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Scenario Simulator</h2>
      
      <div className="bg-surface border border-slate-700 rounded-lg p-6 max-w-4xl space-y-8 shadow-lg">
        {/* Scenarios */}
        <div>
          <h3 className="font-semibold text-lg text-slate-300 mb-4">Event Controller</h3>
          <div className="grid grid-cols-3 gap-4">
            {scenarios.map(s => (
              <button 
                key={s.name}
                onClick={() => setActiveScenario(s.name)}
                className={`p-4 rounded border flex items-center justify-center font-bold transition-all ${
                  activeScenario === s.name 
                    ? 'bg-slate-700 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span className={s.color}>{s.icon}</span>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Scrub */}
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg text-slate-300">Timeline</h3>
            <div className="text-xl font-mono font-bold text-emerald-400">T+{time} min</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={togglePlay}
              className="w-14 h-14 bg-emerald-600 rounded-full flex justify-center items-center hover:bg-emerald-500 transition-colors"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            
            <div className="flex-1">
              <input 
                type="range" 
                min="0" 
                max="120" 
                step="15" 
                value={time} 
                onChange={handleScrub}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                <span>0m</span>
                <span>15m</span>
                <span>30m</span>
                <span>45m</span>
                <span>60m</span>
                <span>75m</span>
                <span>90m</span>
                <span>105m</span>
                <span>120m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
