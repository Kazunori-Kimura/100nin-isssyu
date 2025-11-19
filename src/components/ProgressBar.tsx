interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
        <span>問題 {current} / {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}