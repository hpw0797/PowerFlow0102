
import React, { useState } from 'react';
import { ScheduledTask } from '../types';
import DaySelector, { formatDays } from './DaySelector';

interface StartupSettingsProps {
  tasks: ScheduledTask[];
  setTasks: React.Dispatch<React.SetStateAction<ScheduledTask[]>>;
}

const StartupSettings: React.FC<StartupSettingsProps> = ({ tasks, setTasks }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTime, setNewTime] = useState('08:30');
  const [apps, setApps] = useState<string[]>(['微信', '钉钉', 'Chrome浏览器']);
  const [newAppName, setNewAppName] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const addTask = () => {
    if (selectedDays.length === 0) {
      alert('请至少选择一天');
      return;
    }
    const newTask: ScheduledTask = {
      id: Date.now().toString(),
      type: 'POWER_ON',
      time: newTime,
      days: selectedDays,
      enabled: true,
      appsToLaunch: apps
    };
    setTasks(prev => [...prev, newTask]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">开机唤醒与办公助手</h2>
          <p className="text-slate-500 text-sm mt-1">设置自动开机或唤醒，并预载常用办公软件。</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-emerald-900/40"
        >
          <i className="fas fa-plus"></i>
          <span>添加开机任务</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                   <i className="fas fa-clock mr-2 text-emerald-500"></i>
                   唤醒时间
                </h3>
                <input 
                  type="time" 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white text-xl font-mono"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                   <i className="fas fa-calendar-check mr-2 text-emerald-500"></i>
                   周期设置
                </h3>
                <DaySelector selectedDays={selectedDays} onChange={setSelectedDays} />
                <p className="mt-3 text-xs text-slate-500 italic">当前选择：{formatDays(selectedDays)}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                 <i className="fas fa-rocket mr-2 text-emerald-500"></i>
                 办公必备软件
              </h3>
              <div className="flex space-x-2 mb-4">
                <input 
                  type="text" 
                  placeholder="输入名称或执行路径..."
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                />
                <button 
                  onClick={() => {if(newAppName){setApps([...apps, newAppName]);setNewAppName('');}}} 
                  className="bg-slate-700 hover:bg-slate-600 px-4 rounded-xl transition-colors"
                >
                  添加
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2">
                {apps.map(app => (
                  <div key={app} className="flex items-center space-x-2 bg-slate-700 px-3 py-1.5 rounded-lg text-sm group">
                    <span className="text-slate-200">{app}</span>
                    <button onClick={() => setApps(apps.filter(a => a !== app))} className="text-slate-500 hover:text-red-400">
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">* 任务执行时，后台将依次拉起这些应用</p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-700 flex space-x-4">
            <button onClick={addTask} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3 rounded-xl transition-all font-bold shadow-lg shadow-emerald-900/20">保存配置</button>
            <button onClick={() => setShowForm(false)} className="bg-slate-700 hover:bg-slate-600 text-white px-10 py-3 rounded-xl transition-all font-medium">取消</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500/50 transition-all group hover:bg-slate-800/60">
            <div className="flex items-center space-x-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-colors ${task.enabled ? 'bg-emerald-500/10 text-emerald-500 shadow-inner' : 'bg-slate-700/50 text-slate-500'}`}>
                <i className="fas fa-rocket"></i>
              </div>
              <div>
                <div className="text-3xl font-mono font-bold tracking-tight text-white">{task.time}</div>
                <div className="text-slate-500 text-xs mt-1 uppercase font-bold tracking-widest flex items-center">
                  <i className="fas fa-calendar-day mr-2 text-emerald-500"></i>
                  {formatDays(task.days)}
                </div>
              </div>
            </div>

            <div className="flex-1 px-0 md:px-12 border-l border-slate-700/50">
              <div className="text-[10px] text-slate-500 font-bold uppercase mb-3 tracking-[0.2em] flex items-center">
                <i className="fas fa-list-ul mr-2 text-emerald-500"></i>
                自启动序列
              </div>
              <div className="flex flex-wrap gap-2">
                {task.appsToLaunch?.map(app => (
                  <span key={app} className="bg-slate-900/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-400 shadow-sm">
                    {app}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
               <button 
                onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, enabled: !t.enabled } : t))}
                className={`w-12 h-6 rounded-full relative transition-all ${task.enabled ? 'bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${task.enabled ? 'left-7' : 'left-1'}`}></div>
              </button>
              <button onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} className="text-slate-500 hover:text-red-500 w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100">
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && !showForm && (
          <div className="text-center py-16 bg-slate-800/20 border border-dashed border-slate-700 rounded-[2.5rem]">
            <i className="fas fa-sun text-slate-700 text-5xl mb-4"></i>
            <p className="text-slate-500">未设置开机任务。即使关机状态，RTC唤醒也能助您开启高效办公。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupSettings;
