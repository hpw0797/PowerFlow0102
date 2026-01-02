
import React, { useState, useEffect, useRef } from 'react';
import { ScheduledTask } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ShutdownSettings from './components/ShutdownSettings';
import StartupSettings from './components/StartupSettings';
import ForceShutdownModal from './components/ForceShutdownModal';

declare global {
  interface Window {
    electronAPI?: {
      shutdown: (force: boolean) => void;
      launchApp: (path: string) => void;
      isElectron: boolean;
    };
  }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'shutdown' | 'startup'>('dashboard');
  const [tasks, setTasks] = useState<ScheduledTask[]>(() => {
    const saved = localStorage.getItem('powerflow_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [showShutdownModal, setShowShutdownModal] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const lastCheckedMinute = useRef<string>('');

  // 持久化存储
  useEffect(() => {
    localStorage.setItem('powerflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 核心任务轮询逻辑：每 10 秒检查一次是否到达任务执行时间
  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 获取当前星期几 (0-6)
      const currentMinute = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // 避免在同一分钟内重复触发
      if (lastCheckedMinute.current === currentMinute) return;
      lastCheckedMinute.current = currentMinute;

      // 严格匹配：启用的任务、时间一致、且包含在勾选的星期内
      const matchingTasks = tasks.filter(t => 
        t.enabled && 
        t.time === currentMinute && 
        (t.days || []).includes(currentDay)
      );

      matchingTasks.forEach(task => {
        if (task.type === 'POWER_OFF') {
          // 触发倒计时关机弹窗
          setCountdown(10);
          setShowShutdownModal(true);
        } else if (task.type === 'POWER_ON') {
          // 触发应用序列自启动
          task.appsToLaunch?.forEach(appPath => {
            if (window.electronAPI) {
              window.electronAPI.launchApp(appPath);
            } else {
              console.log(`[开发预览] 启动应用: ${appPath}`);
            }
          });
        }
      });
    };

    const interval = setInterval(checkTasks, 10000); 
    return () => clearInterval(interval);
  }, [tasks]);

  const confirmShutdown = () => {
    if (window.electronAPI) {
      window.electronAPI.shutdown(true);
    } else {
      alert('系统正在强制关机... (开发环境预览)');
    }
    setShowShutdownModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* 侧边导航栏 */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* 主内容区 */}
      <main className="flex-1 overflow-y-auto p-12 relative">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex justify-between items-end border-b border-slate-800 pb-8">
            <div>
              <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                PowerFlow 系统就绪
              </p>
              <h1 className="text-4xl font-black text-white tracking-tight">
                {activeTab === 'dashboard' && '运行控制中心'}
                {activeTab === 'shutdown' && '自动化关机'}
                {activeTab === 'startup' && '开机办公套件'}
              </h1>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-3xl font-mono font-black text-white tracking-tighter">
                {new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-slate-500 text-xs mt-1 font-medium">
                {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </header>

          <div className="transition-all duration-500 ease-out">
            {activeTab === 'dashboard' && <Dashboard tasks={tasks} />}
            {activeTab === 'shutdown' && (
              <ShutdownSettings 
                tasks={tasks.filter(t => t.type === 'POWER_OFF')} 
                setTasks={setTasks} 
              />
            )}
            {activeTab === 'startup' && (
              <StartupSettings 
                tasks={tasks.filter(t => t.type === 'POWER_ON')} 
                setTasks={setTasks} 
              />
            )}
          </div>
        </div>
      </main>

      {/* 强制关机倒计时弹窗 */}
      {showShutdownModal && (
        <ForceShutdownModal 
          countdown={countdown} 
          setCountdown={setCountdown}
          onConfirm={confirmShutdown}
          onCancel={() => setShowShutdownModal(false)}
        />
      )}
    </div>
  );
};

export default App;
