
import React, { useState } from 'react';
import { ScheduledTask } from '../types';
import DaySelector, { formatDays } from './DaySelector';

interface ShutdownSettingsProps {
  tasks: ScheduledTask[];
  setTasks: React.Dispatch<React.SetStateAction<ScheduledTask[]>>;
}

const ShutdownSettings: React.FC<ShutdownSettingsProps> = ({ tasks, setTasks }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTime, setNewTime] = useState('23:30');
  const [forceClose, setForceClose] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);

  const addTask = () => {
    if (selectedDays.length === 0) {
      alert('请至少选择一天');
      return;
    }
    const newTask: ScheduledTask = {
      id: Date.now().toString(),
      type: 'POWER_OFF',
      time: newTime,
      days: selectedDays,
      enabled: true,
      force: forceClose
    };
    setTasks(prev => [...prev, newTask]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">定时关机计划</h2>
          <p className="text-slate-500 text-sm mt-1">设置电脑自动关机时间，支持强制关闭未响应程序。</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-900/40"
        >
          <i className="fas fa-plus"></i>
          <span>添加新计划</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
             <i className="fas fa-calendar-plus mr-2 text-blue-500"></i>
             配置关机任务
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">执行时间 (24小时制)</label>
                <input 
                  type="time" 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-xl font-mono"
                />
              </div>
              <div>
                <label className="flex items-center space-x-3 cursor-pointer p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={forceClose}
                    onChange={(e) => setForceClose(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                  />
                  <div>
                    <span className="text-slate-200 font-medium block">强制关机模式</span>
                    <span className="text-xs text-slate-500">倒计时结束将自动结束所有未响应程序</span>
                  </div>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-3">重复周期 (点击选择日期)</label>
              <DaySelector selectedDays={selectedDays} onChange={setSelectedDays} />
              <p className="mt-4 text-xs text-slate-500">已选：{formatDays(selectedDays)}</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-700 flex space-x-4">
            <button 
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-blue-900/20"
            >
              保存并激活
            </button>
            <button 
              onClick={() => setShowForm(false)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-2.5 rounded-xl transition-all font-medium"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-slate-800/40 border border-slate-700 p-6 rounded-3xl flex items-center justify-between group hover:border-slate-500 transition-all hover:bg-slate-800/60">
            <div className="flex items-center space-x-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors ${task.enabled ? 'bg-blue-500/10 text-blue-500 shadow-inner' : 'bg-slate-700/50 text-slate-500'}`}>
                <i className="fas fa-power-off"></i>
              </div>
              <div>
                <div className="text-2xl font-mono font-bold tracking-tight text-white">{task.time}</div>
                <div className="text-slate-400 text-sm mt-1 flex items-center">
                  <i className="fas fa-redo mr-2 text-[10px] text-blue-500"></i>
                  {formatDays(task.days)}
                </div>
                {task.force && (
                  <span className="mt-2 inline-flex items-center text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    <i className="fas fa-bolt mr-1"></i> 强制模式
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, enabled: !t.enabled } : t))}
                className={`w-12 h-6 rounded-full relative transition-all ${task.enabled ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]' : 'bg-slate-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${task.enabled ? 'left-7' : 'left-1'}`}></div>
              </button>
              <button 
                onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))}
                className="text-slate-500 hover:text-red-500 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && !showForm && (
          <div className="text-center py-12 bg-slate-800/20 border border-dashed border-slate-700 rounded-3xl">
            <i className="fas fa-moon text-slate-700 text-4xl mb-4"></i>
            <p className="text-slate-500">暂无计划任务，点击上方按钮创建。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShutdownSettings;
