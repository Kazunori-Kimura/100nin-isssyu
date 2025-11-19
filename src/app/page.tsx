'use client';

import { useSettings } from '../hooks/useSettings';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Link from 'next/link';

export default function Home() {
  const { getRangeInfo } = useSettings();
  const rangeInfo = getRangeInfo();
  const canStartQuiz = rangeInfo.count >= 4;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-800">
            百人一首クイズ
          </h1>
          <p className="text-lg text-slate-600">
            古典の美しさを学ぼう
          </p>
        </div>

        {/* メインカード */}
        <Card className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              4択クイズで百人一首を学習
            </h2>
            <p className="text-slate-600">
              上の句から正しい下の句を選んでください。<br />
              {canStartQuiz 
                ? '10問のクイズであなたの知識を試してみましょう。'
                : '出題範囲を設定してからクイズを始めてください。'
              }
            </p>
          </div>

          <div className="space-y-4">
            {canStartQuiz ? (
              <Link href="/quiz">
                <Button size="lg" className="w-full">
                  クイズを始める
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="w-full" disabled>
                クイズを始める（要設定）
              </Button>
            )}
            
            <Link href="/settings">
              <Button variant="secondary" className="w-full">
                出題範囲を設定
              </Button>
            </Link>
          </div>

          {/* 現在の設定表示 */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              {rangeInfo.mode === 'range' ? '範囲選択' : '個別選択'}: {rangeInfo.description}
            </p>
            {rangeInfo.count < 4 && (
              <p className="text-sm text-amber-600 mt-1">
                ⚠ クイズには最低4首必要です
              </p>
            )}
          </div>
        </Card>

        {/* フッター */}
        <div className="text-center text-sm text-slate-400">
          <p>百人一首の世界を楽しんでください。</p>
        </div>
      </div>
    </div>
  );
}
