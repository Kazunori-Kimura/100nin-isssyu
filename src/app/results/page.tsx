'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizSession } from '../../types/quiz';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ScoreDisplay from '../../components/ScoreDisplay';
import { getScoreMessage } from '../../utils/quizGenerator';
export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // セッションストレージから結果を取得
    const loadResults = () => {
      const savedResults = sessionStorage.getItem('quiz-results');
      if (savedResults) {
        try {
          const parsedSession = JSON.parse(savedResults) as QuizSession;
          setSession(parsedSession);
        } catch (error) {
          console.error('結果の読み込みに失敗しました:', error);
        }
      }
      setLoading(false);
    };
    
    loadResults();
  }, []);

  const handleRetry = () => {
    // セッションストレージをクリア
    sessionStorage.removeItem('quiz-results');
    router.push('/quiz');
  };

  const handleChangeSettings = () => {
    // セッションストレージをクリア
    sessionStorage.removeItem('quiz-results');
    router.push('/settings');
  };

  const handleBackToHome = () => {
    // セッションストレージをクリア
    sessionStorage.removeItem('quiz-results');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center">
          <p className="text-lg text-slate-600">結果を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!session || !session.isCompleted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">
            結果が見つかりません
          </h1>
          <p className="text-slate-600">
            クイズを完了してから結果をご確認ください。
          </p>
          <Button onClick={() => router.push('/')}>
            ホームに戻る
          </Button>
        </div>
      </div>
    );
  }

  const scoreMessage = getScoreMessage(session.score, session.questions.length);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            クイズ結果
          </h1>
          <p className="text-slate-600">お疲れ様でした！</p>
        </div>

        {/* スコア表示 */}
        <Card className="text-center">
          <ScoreDisplay
            correctCount={session.score}
            totalCount={session.questions.length}
            message={scoreMessage}
          />
        </Card>

        {/* 詳細結果 */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            詳細結果
          </h2>
          <div className="space-y-4">
            {session.results.map((result, index) => (
              <div 
                key={result.questionId} 
                className={`p-4 rounded-lg border-2 ${ 
                  result.isCorrect 
                    ? 'border-emerald-200 bg-emerald-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">
                    問題 {index + 1}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    result.isCorrect 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.isCorrect ? '正解' : '不正解'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-slate-600">上の句: </span>
                    <span className="text-slate-800">{result.above}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-slate-600">歌人: </span>
                    <span className="text-slate-800">{result.poet}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-slate-600">正解: </span>
                    <span className="text-slate-800">{result.correctAnswer}</span>
                  </div>
                  
                  {!result.isCorrect && (
                    <div>
                      <span className="text-sm font-medium text-slate-600">あなたの回答: </span>
                      <span className="text-red-600">{result.userAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* アクションボタン */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleRetry} className="w-full">
              もう一度挑戦
            </Button>
            <Button variant="secondary" onClick={handleChangeSettings} className="w-full">
              設定を変更
            </Button>
          </div>
          
          <Button variant="secondary" onClick={handleBackToHome} className="w-full">
            スタートに戻る
          </Button>
        </div>

        {/* 励ましメッセージ */}
        <div className="text-center text-sm text-slate-500 space-y-2">
          <p>継続は力なり。</p>
          <p>百人一首の美しい世界をお楽しみください。</p>
        </div>
      </div>
    </div>
  );
}