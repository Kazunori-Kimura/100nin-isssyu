'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../../hooks/useSettings';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import PoemListSelector from '../../components/PoemListSelector';
import { DEFAULT_START_RANGE, DEFAULT_END_RANGE, MIN_RANGE_SIZE } from '../../utils/constants';
import { SelectionMode } from '../../types/quiz';
import poemData from '../../data/poem.json';
import PoemInfo from '../../types/poem';

const poems: PoemInfo[] = poemData as PoemInfo[];

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, resetToDefault, getRangeInfo } = useSettings();
  
  const [mode, setMode] = useState<SelectionMode>(settings.mode);
  const [startRange, setStartRange] = useState(settings.startRange.toString());
  const [endRange, setEndRange] = useState(settings.endRange.toString());
  const [selectedIds, setSelectedIds] = useState<number[]>(settings.selectedIds);
  const [errors, setErrors] = useState({ start: '', end: '', selection: '' });

  useEffect(() => {
    setMode(settings.mode);
    setStartRange(settings.startRange.toString());
    setEndRange(settings.endRange.toString());
    setSelectedIds(settings.selectedIds);
  }, [settings]);

  const validateRange = (start: number, end: number) => {
    const newErrors = { start: '', end: '', selection: '' };

    if (start < 1 || start > 100) {
      newErrors.start = '開始番号は1-100の間で入力してください';
    }
    if (end < 1 || end > 100) {
      newErrors.end = '終了番号は1-100の間で入力してください';
    }
    if (start > end) {
      newErrors.start = '開始番号は終了番号以下にしてください';
    }
    if (end - start + 1 < MIN_RANGE_SIZE) {
      newErrors.end = `最低${MIN_RANGE_SIZE}首必要です（4択問題作成のため）`;
    }

    setErrors(newErrors);
    return !newErrors.start && !newErrors.end;
  };

  const validateSelection = () => {
    const newErrors = { start: '', end: '', selection: '' };
    
    if (selectedIds.length < MIN_RANGE_SIZE) {
      newErrors.selection = `最低${MIN_RANGE_SIZE}首選択してください（4択問題作成のため）`;
    }

    setErrors(newErrors);
    return selectedIds.length >= MIN_RANGE_SIZE;
  };

  const handleSave = () => {
    if (mode === 'range') {
      const start = parseInt(startRange);
      const end = parseInt(endRange);

      if (isNaN(start) || isNaN(end)) {
        setErrors({
          start: isNaN(start) ? '有効な数値を入力してください' : '',
          end: isNaN(end) ? '有効な数値を入力してください' : '',
          selection: '',
        });
        return;
      }

      if (validateRange(start, end)) {
        updateSettings({ 
          mode: 'range', 
          startRange: start, 
          endRange: end,
          selectedIds: [] 
        });
        router.push('/');
      }
    } else {
      if (validateSelection()) {
        updateSettings({ 
          mode: 'individual',
          startRange: DEFAULT_START_RANGE,
          endRange: DEFAULT_END_RANGE,
          selectedIds: selectedIds 
        });
        router.push('/');
      }
    }
  };

  const handleModeChange = (newMode: SelectionMode) => {
    setMode(newMode);
    setErrors({ start: '', end: '', selection: '' });
  };

  const handleReset = () => {
    if (confirm('設定をデフォルトに戻しますか？')) {
      resetToDefault();
      setMode('range');
      setStartRange(DEFAULT_START_RANGE.toString());
      setEndRange(DEFAULT_END_RANGE.toString());
      setSelectedIds([]);
      setErrors({ start: '', end: '', selection: '' });
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const previewRange = () => {
    const start = parseInt(startRange);
    const end = parseInt(endRange);
    if (!isNaN(start) && !isNaN(end) && start <= end && start >= 1 && end <= 100) {
      const count = end - start + 1;
      return `${start}-${end}番 (${count}首)`;
    }
    return '---';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-800">
            出題範囲設定
          </h1>
          <p className="text-lg text-slate-600">
            クイズに出題する歌の範囲を設定してください
          </p>
        </div>

        {/* モード選択 */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">出題方法を選択</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleModeChange('range')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  mode === 'range'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    mode === 'range' ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                  }`}>
                    {mode === 'range' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <span className="font-medium text-slate-800">範囲選択</span>
                </div>
                <p className="text-sm text-slate-600">
                  連続する番号の範囲を指定します（例: 1-50番）
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('individual')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  mode === 'individual'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    mode === 'individual' ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                  }`}>
                    {mode === 'individual' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                  </div>
                  <span className="font-medium text-slate-800">個別選択</span>
                </div>
                <p className="text-sm text-slate-600">
                  学習したい歌を個別に選択します
                </p>
              </button>
            </div>
          </div>
        </Card>

        {/* 設定フォーム */}
        {mode === 'range' ? (
          <Card>
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-800">範囲を指定</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="開始番号"
                  type="number"
                  min="1"
                  max="100"
                  value={startRange}
                  onChange={(e) => setStartRange(e.target.value)}
                  error={errors.start}
                  placeholder="1"
                />
                <Input
                  label="終了番号"
                  type="number"
                  min="1"
                  max="100"
                  value={endRange}
                  onChange={(e) => setEndRange(e.target.value)}
                  error={errors.end}
                  placeholder="100"
                />
              </div>

              {/* プレビュー */}
              <div className="bg-slate-50 p-4 rounded-md">
                <h3 className="font-medium text-slate-700 mb-2">選択された範囲</h3>
                <p className="text-lg font-semibold text-slate-800">
                  {previewRange()}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-800">歌を選択</h2>
                {errors.selection && (
                  <p className="text-sm text-red-600">{errors.selection}</p>
                )}
              </div>
              
              <PoemListSelector
                poems={poems}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </div>
          </Card>
        )}

        {/* 注意事項 */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
          <h4 className="font-medium text-amber-800 mb-2">注意事項</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• 4択問題作成のため、最低4首は必要です</li>
            {mode === 'range' && (
              <>
                <li>• 1番から100番までの範囲で設定してください</li>
                <li>• 開始番号は終了番号以下にしてください</li>
              </>
            )}
            {mode === 'individual' && (
              <>
                <li>• 歌をクリックして選択・選択解除できます</li>
                <li>• 検索機能を使って効率的に歌を見つけられます</li>
              </>
            )}
          </ul>
        </div>

        {/* ボタン */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleSave}
            className="flex-1"
            disabled={
              mode === 'range' 
                ? (!!errors.start || !!errors.end)
                : (selectedIds.length < MIN_RANGE_SIZE)
            }
          >
            設定を保存
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleReset}
            className="flex-1"
          >
            デフォルトに戻す
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Button 
            variant="secondary" 
            onClick={handleBack}
            className="w-full"
          >
            戻る
          </Button>
        </div>

        {/* 現在の設定表示 */}
        <Card padding="sm" className="bg-slate-50">
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-1">現在の設定</p>
            <p className="font-medium text-slate-800">
              {getRangeInfo().description}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}