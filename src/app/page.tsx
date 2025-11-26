'use client';

import { useRouter } from 'next/navigation';
import { useSettings } from '../hooks/useSettings';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Link from 'next/link';
import { ColorGroup } from '../types/poem';

export default function Home() {
  const router = useRouter();
  const { getRangeInfo, updateSettings } = useSettings();
  const rangeInfo = getRangeInfo();

  const handleColorSelect = (color: ColorGroup) => {
    updateSettings({
      mode: 'color',
      selectedColors: [color],
      selectedIds: [],
    });
    router.push('/quiz');
  };

  const handleRandomSelect = () => {
    updateSettings({
      mode: 'range',
      startRange: 1,
      endRange: 100,
      selectedIds: [],
      selectedColors: [],
    });
    router.push('/quiz');
  };

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
              色グループを選んで20問のクイズに挑戦しましょう。
            </p>
          </div>

          {/* 五色百人一首ボタン */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700">五色百人一首</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleColorSelect('blue')}
                className="p-4 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold transition-all border-2 border-blue-200 hover:border-blue-300"
              >
                <div className="text-lg">あお</div>
                <div className="text-xs opacity-70">1-20番</div>
              </button>
              
              <button
                onClick={() => handleColorSelect('pink')}
                className="p-4 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-800 font-semibold transition-all border-2 border-pink-200 hover:border-pink-300"
              >
                <div className="text-lg">ピンク</div>
                <div className="text-xs opacity-70">21-40番</div>
              </button>
              
              <button
                onClick={() => handleColorSelect('yellow')}
                className="p-4 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold transition-all border-2 border-yellow-200 hover:border-yellow-300"
              >
                <div className="text-lg">きいろ</div>
                <div className="text-xs opacity-70">41-60番</div>
              </button>
              
              <button
                onClick={() => handleColorSelect('green')}
                className="p-4 rounded-lg bg-green-100 hover:bg-green-200 text-green-800 font-semibold transition-all border-2 border-green-200 hover:border-green-300"
              >
                <div className="text-lg">みどり</div>
                <div className="text-xs opacity-70">61-80番</div>
              </button>
              
              <button
                onClick={() => handleColorSelect('orange')}
                className="p-4 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold transition-all border-2 border-orange-200 hover:border-orange-300"
              >
                <div className="text-lg">オレンジ</div>
                <div className="text-xs opacity-70">81-100番</div>
              </button>
              
              <button
                onClick={handleRandomSelect}
                className="p-4 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 text-purple-800 font-semibold transition-all border-2 border-purple-200 hover:border-purple-300"
              >
                <div className="text-lg">ランダム</div>
                <div className="text-xs opacity-70">全100首</div>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link href="/settings">
              <Button variant="secondary" className="w-full">
                詳細設定（範囲・個別選択）
              </Button>
            </Link>
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
