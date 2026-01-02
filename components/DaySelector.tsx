
import React from 'react';

interface DaySelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onChange }) => {
  const days = [
    { label: '日', value: 0 },
    { label: '一', value: 1 },
    { label: '二', value: 2 },
    { label: '三', value: 3 },
    { label: '四', value: 4 },
    { label: '五', value: 5 },
    { label: '六', value: 6 },
  ];

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day].sort());
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {days.map((day) => (
        <button
          key={day.value}
          type="button"
          onClick={() => toggleDay(day.value)}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all border ${
            selectedDays.includes(day.value)
              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20 scale-110'
              : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
          }`}
        >
          {day.label}
        </button>
      ))}
    </div>
  );
};

export default DaySelector;

export const formatDays = (days: number[]) => {
  if (days.length === 7) return '每天';
  if (days.length === 5 && !days.includes(0) && !days.includes(6)) return '工作日';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return '周末';
  
  const labels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days.map(d => labels[d]).join(', ');
};
