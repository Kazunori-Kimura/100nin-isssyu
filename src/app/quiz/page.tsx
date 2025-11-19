'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../../hooks/useSettings';
import { useQuiz } from '../../hooks/useQuiz';
import ProgressBar from '../../components/ProgressBar';
import QuizCard from '../../components/QuizCard';
import Button from '../../components/ui/Button';
import poemData from '../../data/poem.json';
import PoemInfo from '../../types/poem';

const poems: PoemInfo[] = poemData as PoemInfo[];

export default function QuizPage() {
  const router = useRouter();
  const { settings, getSelectedPoemIds } = useSettings();
  const { 
    session, 
    startQuiz, 
    answerQuestion, 
    getCurrentQuestion, 
    isActive, 
    currentQuestionNumber, 
    totalQuestions 
  } = useQuiz({
    poems,
    mode: settings.mode,
    startRange: settings.startRange,
    endRange: settings.endRange,
    selectedIds: getSelectedPoemIds(), // 全てのモードに対応した統一されたID取得
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // コンポーネントマウント時にクイズを開始
    startQuiz();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // ローディング状態を非同期で更新
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // クイズが完了したら結果画面に遷移
    if (session?.isCompleted) {
      // 結果をセッションストレージに保存
      sessionStorage.setItem('quiz-results', JSON.stringify(session));
      router.push('/results');
    }
  }, [session, router]);

  const handleAnswer = (selectedAnswer: string) => {
    answerQuestion(selectedAnswer);
  };

  const handleQuit = () => {
    if (confirm('クイズを中断しますか？進行状況は保存されません。')) {
      router.push('/');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <p className="text-lg text-slate-600">クイズを準備中...</p>
        </div>
      </div>
    );
  }

  if (!isActive || !session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">
            クイズの準備ができませんでした
          </h1>
          <p className="text-slate-600">
            設定を確認してからもう一度お試しください。
          </p>
          <Button onClick={() => router.push('/')}>
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            百人一首クイズ
          </h1>
          <Button variant="secondary" size="sm" onClick={handleQuit}>
            中断
          </Button>
        </div>

        {/* 進捗バー */}
        <ProgressBar 
          current={currentQuestionNumber} 
          total={totalQuestions} 
        />

        {/* クイズカード */}
        {currentQuestion && (
          <QuizCard
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        )}

        {/* フッター情報 */}
        <div className="text-center text-sm text-slate-500">
          <p>上の句から正しい下の句を選択してください</p>
        </div>
      </div>
    </div>
  );
}