export const Navbar = () => {
  return (
    <nav className="h-16 bg-surface border-b border-slate-700 flex items-center px-6 fixed w-full z-10">
      <div className="flex items-center space-x-4">
        <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="font-bold text-white">JR</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          JalRakshak AI
        </h1>
        <span className="px-2 py-1 bg-slate-700 text-xs rounded-full border border-slate-600">Prototype v1.2</span>
      </div>
    </nav>
  );
};
