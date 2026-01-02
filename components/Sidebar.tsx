
import React from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'shutdown' | 'startup';
  setActiveTab: (tab: 'dashboard' | 'shutdown' | 'startup') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-th-large', label: '运行控制台' },
    { id: 'shutdown', icon: 'fas fa-power-off', label: '定时关机' },
    { id: 'startup', icon: 'fas fa-rocket', label: '开机助手' },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-8 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
          <i className="fas fa-bolt text-white text-xl"></i>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">PowerFlow</span>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner' 
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <i className={`${item.icon} text-lg w-6 transition-transform group-hover:scale-110`}></i>
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <i className="fas fa-shield-alt text-emerald-500 text-xs"></i>
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">系统状态</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            后台守护进程运行中，持续监听定时计划。
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono text-emerald-500">已就绪</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
