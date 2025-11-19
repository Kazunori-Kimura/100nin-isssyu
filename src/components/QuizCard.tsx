import { useState } from 'react';
import { QuizQuestion } from '../types/quiz';
import Button from './ui/Button';
import Card from './ui/Card';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (selectedAnswer: string) => void;
  disabled?: boolean;
}

export default function QuizCard({ question, onAnswer, disabled = false }: QuizCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const handleChoiceSelect = (choice: string) => {
    if (disabled || selectedChoice) return;
    
    setSelectedChoice(choice);
    setShowResult(true);
    
    // 2秒後に次の問題へ
    setTimeout(() => {
      onAnswer(choice);
      setSelectedChoice(null);
      setShowResult(false);
    }, 2000);
  };
  
  const getChoiceVariant = (choice: string) => {
    if (!showResult) return 'secondary';
    if (choice === question.correctAnswer) return 'success';
    if (choice === selectedChoice && choice !== question.correctAnswer) return 'error';
    return 'secondary';
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* 上の句表示 */}
        <div className="text-center">
          <h2 className="text-xl font-medium text-slate-800 leading-relaxed">
            {question.above}
          </h2>
          <p className="text-sm text-slate-500 mt-2">{question.poet}</p>
        </div>
        
        {/* 選択肢 */}
        <div className="grid grid-cols-1 gap-3">
          {question.choices.map((choice, index) => (
            <Button
              key={choice}
              variant={getChoiceVariant(choice)}
              className="h-auto py-4 px-6 text-left justify-start hover:scale-[1.02] transition-transform"
              onClick={() => handleChoiceSelect(choice)}
              disabled={disabled || !!selectedChoice}
            >
              <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
              <span className="leading-relaxed">{choice}</span>
            </Button>
          ))}
        </div>
        
        {/* 正答時のアニメーション */}
        {showResult && selectedChoice === question.correctAnswer && (
          <div className="text-center animate-bounce">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full">
              <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}