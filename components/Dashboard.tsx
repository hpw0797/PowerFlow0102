
import React from 'react';
import { ScheduledTask } from '../types';

interface DashboardProps {
  tasks: ScheduledTask[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const activeTasks = tasks.filter(t => t.enabled);
  const nextTask = activeTasks[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2">下个待执行计划</h2>
          {nextTask ? (
            <div className="mt-4">
              <div className="text-5xl font-black text-white flex items-baseline space-x-2">
                <span>{nextTask.time}</span>
                <span className="text-xl font-medium opacity-70">今日</span>
              </div>
              <p className="mt-4 inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium text-white backdrop-blur-sm">
                <i className={`fas ${nextTask.type === 'POWER_OFF' ? 'fa-power-off' : 'fa-rocket'} mr-2`}></i>
                {nextTask.type === 'POWER_OFF' ? '定时关机任务' : '开机助手：启动办公软件'}
              </p>
            </div>
          ) : (
            <p className="text-white/80 mt-4">今日暂无已开启的定时任务。</p>
          )}
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <i className="fas fa-calendar-check text-9xl text-white"></i>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
        <h3 className="text-lg font-semibold mb-6">运行摘要</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">计划总数</span>
            <span className="text-xl font-bold">{tasks.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">活动任务</span>
            <span className="text-xl font-bold text-blue-400">{activeTasks.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">启动加速</span>
            <span className="text-xl font-bold text-emerald-400">
              {tasks.some(t => t.type === 'POWER_ON' && t.enabled) ? '已启用' : '未开启'}
            </span>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-3 bg-slate-800 border border-slate-700 rounded-3xl p-6">
        <h3 className="text-lg font-semibold mb-6">执行日志</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="pb-4 font-medium text-slate-500 uppercase text-xs tracking-wider">事件描述</th>
                <th className="pb-4 font-medium text-slate-500 uppercase text-xs tracking-wider">执行时间</th>
                <th className="pb-4 font-medium text-slate-500 uppercase text-xs tracking-wider">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr>
                <td className="py-4 flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>自动关机 (计划执行)</span>
                </td>
                <td className="py-4 text-slate-400">昨天 23:30</td>
                <td className="py-4"><span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs">成功</span></td>
              </tr>
              <tr>
                <td className="py-4 flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>办公套件自启动</span>
                </td>
                <td className="py-4 text-slate-400">今天 08:30</td>
                <td className="py-4"><span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded text-xs">成功</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
