
import React, { useEffect } from 'react';

interface ForceShutdownModalProps {
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  onConfirm: () => void;
  onCancel: () => void;
}

const ForceShutdownModal: React.FC<ForceShutdownModalProps> = ({ countdown, setCountdown, onConfirm, onCancel }) => {
  useEffect(() => {
    if (countdown <= 0) {
      onConfirm();
      return;
    }
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, onConfirm, setCountdown]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/60 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-red-500/30 w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl shadow-red-500/10 text-center animate-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20 relative">
          <i className="fas fa-exclamation-triangle text-4xl"></i>
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="48" cy="48" r="45" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * (10 - countdown)) / 10}
              className="text-red-500 transition-all duration-1000 ease-linear"
            />
          </svg>
        </div>
        
        <h2 className="text-3xl font-black text-white mb-4">计划关机提醒</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          系统即将执行定时关机。请立即保存您的工作。所有未响应的后台程序将被强制终止。
        </p>
        
        <div className="text-6xl font-black text-red-500 mb-10 font-mono tracking-tighter">
          00:0{countdown}
        </div>
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={onCancel}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95"
          >
            取消关机 (手动处理)
          </button>
          <button 
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
          >
            立即强行关机
          </button>
        </div>
        
        <p className="mt-6 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
          系统级执行指令：强制关机协议已激活
        </p>
      </div>
    </div>
  );
};

export default ForceShutdownModal;
