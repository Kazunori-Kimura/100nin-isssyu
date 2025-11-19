interface ScoreDisplayProps {
  correctCount: number;
  totalCount: number;
  message: string;
  className?: string;
}

export default function ScoreDisplay({ 
  correctCount, 
  totalCount, 
  message, 
  className = '' 
}: ScoreDisplayProps) {
  const percentage = Math.round((correctCount / totalCount) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 90) return 'text-emerald-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-amber-600';
    return 'text-red-600';
  };
  
  return (
    <div className={`text-center space-y-4 ${className}`}>
      <div className="space-y-2">
        <div className={`text-4xl font-bold ${getScoreColor()}`}>
          {correctCount} / {totalCount}
        </div>
        <div className={`text-2xl font-semibold ${getScoreColor()}`}>
          {percentage}%
        </div>
      </div>
      <p className="text-lg text-slate-700 font-medium">
        {message}
      </p>
    </div>
  );
}