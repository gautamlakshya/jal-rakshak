import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Cpu, BarChart, Map, Radio } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="w-64 bg-surface h-screen border-r border-slate-700 flex flex-col pt-16">
      <nav className="flex-1 space-y-2 p-4">
        <SidebarLink to="/" icon={<Activity />} label="Dashboard" />
        <SidebarLink to="/prediction" icon={<Cpu />} label="Prediction Engine" />
        <SidebarLink to="/simulator" icon={<Map />} label="Simulation" />
        <SidebarLink to="/alerts" icon={<ShieldAlert />} label="Alerts" />
        <SidebarLink to="/field" icon={<Radio />} label="Field Officer" />
        <SidebarLink to="/analytics" icon={<BarChart />} label="Analytics" />
        <SidebarLink to="/status" icon={<Activity />} label="System Status" />
      </nav>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: any, label: string }) => (
  <Link to={to} className="flex items-center space-x-3 text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-lg transition-colors">
    {icon}
    <span>{label}</span>
  </Link>
);
