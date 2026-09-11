import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle2, Send, BatteryMedium, Signal } from 'lucide-react';

export const FieldOfficer = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [syncQueue, setSyncQueue] = useState<number>(0);
  const [syncedMsg, setSyncedMsg] = useState('');
  
  const [tasks, setTasks] = useState([
    { id: 1, text: "Evacuate Singtam Ward 4", done: false },
    { id: 2, text: "Secure Teesta Bridge Checkpost", done: false },
    { id: 3, text: "Deploy Portable Siren", done: false }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
    handleAction();
  };

  const handleAction = () => {
    if (isOffline) {
      setSyncQueue(prev => prev + 1);
    } else {
      // simulate immediate sync
      setSyncedMsg('Synced to Command Center');
      setTimeout(() => setSyncedMsg(''), 2000);
    }
  };

  useEffect(() => {
    if (!isOffline && syncQueue > 0) {
      // Simulate sync process
      const timer = setTimeout(() => {
        setSyncQueue(0);
        setSyncedMsg(`Synced ${syncQueue} items to Command Center`);
        setTimeout(() => setSyncedMsg(''), 3000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOffline, syncQueue]);

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <div className="mb-6 flex items-center space-x-4">
        <h2 className="text-2xl font-bold">Field Officer App Simulator</h2>
        <button 
          onClick={() => setIsOffline(!isOffline)}
          className={`px-4 py-2 rounded font-bold flex items-center space-x-2 transition-colors ${isOffline ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}
        >
          {isOffline ? <WifiOff size={18} /> : <Wifi size={18} />}
          <span>{isOffline ? 'Cellular Outage Active' : 'Toggle Cellular Outage'}</span>
        </button>
      </div>

      {/* Phone Frame */}
      <div className="relative border-[8px] border-slate-800 rounded-[2.5rem] overflow-hidden bg-slate-950 shadow-2xl" style={{ width: '375px', height: '667px' }}>
        
        {/* Status Bar */}
        <div className="h-6 w-full bg-black flex justify-between items-center px-4 text-xs font-bold text-slate-300">
          <span>09:41</span>
          <div className="flex space-x-1 items-center">
            {isOffline ? <WifiOff size={12} className="text-red-500" /> : <Signal size={12} />}
            <BatteryMedium size={14} />
          </div>
        </div>

        {/* App Header */}
        <div className="bg-blue-900 p-4 pb-6 rounded-b-2xl shadow-lg">
          <h3 className="font-bold text-xl text-white">JalRakshak Mesh</h3>
          <p className="text-blue-200 text-sm">Singtam Sector - Team Alpha</p>
        </div>

        {/* App Body */}
        <div className="p-4 space-y-6">
          
          {/* Sync Status Banner */}
          <div className={`p-3 rounded text-sm font-semibold flex items-center justify-center transition-colors ${
            isOffline ? 'bg-yellow-900/50 text-yellow-500 border border-yellow-700' : 
            syncedMsg ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 
            'bg-slate-800 text-slate-400'
          }`}>
            {isOffline ? `Offline Mode - ${syncQueue} items in queue` : 
             syncedMsg ? syncedMsg : 'Online & Synced'}
          </div>

          {/* Tasks List */}
          <div>
            <h4 className="font-bold text-slate-300 mb-3 border-b border-slate-800 pb-1">Evacuation Tasks</h4>
            <div className="space-y-2">
              {tasks.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => toggleTask(t.id)}
                  className={`p-3 rounded-lg border flex items-center space-x-3 cursor-pointer transition-colors ${t.done ? 'bg-emerald-900/20 border-emerald-800/50 text-slate-400 line-through' : 'bg-slate-800 border-slate-700 text-slate-200'}`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${t.done ? 'bg-emerald-600 border-emerald-500' : 'border-slate-500'}`}>
                    {t.done && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className="flex-1 text-sm">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Report */}
          <div>
            <h4 className="font-bold text-slate-300 mb-3 border-b border-slate-800 pb-1">Quick Report</h4>
            <div className="flex space-x-2">
              <button onClick={handleAction} className="flex-1 bg-red-900/30 text-red-400 border border-red-800 p-2 rounded text-sm font-bold hover:bg-red-900/50">Road Blocked</button>
              <button onClick={handleAction} className="flex-1 bg-blue-900/30 text-blue-400 border border-blue-800 p-2 rounded text-sm font-bold hover:bg-blue-900/50">Need Medic</button>
            </div>
            <button onClick={handleAction} className="w-full mt-2 bg-slate-700 text-slate-300 p-3 rounded flex justify-center items-center space-x-2 font-bold hover:bg-slate-600">
              <Send size={16} /> <span>Submit Custom Report</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
