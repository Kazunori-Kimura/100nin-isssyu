import { useState, useEffect } from 'react';
import PoemInfo from '../types/poem';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';

interface PoemListSelectorProps {
  poems: PoemInfo[];
  selectedIds: number[];
  onSelectionChange: (selectedIds: number[]) => void;
  className?: string;
}

export default function PoemListSelector({ 
  poems, 
  selectedIds, 
  onSelectionChange, 
  className = '' 
}: PoemListSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPoems, setFilteredPoems] = useState<PoemInfo[]>(poems);

  useEffect(() => {
    const updateFiltered = () => {
      if (!searchTerm) {
        setFilteredPoems(poems);
      } else {
        const filtered = poems.filter(poem => 
          poem.poem.includes(searchTerm) || 
          poem.poet.includes(searchTerm) ||
          poem.poet_kana.includes(searchTerm) ||
          poem.above.includes(searchTerm) ||
          poem.below.includes(searchTerm) ||
          poem.id.toString().includes(searchTerm)
        );
        setFilteredPoems(filtered);
      }
    };
    
    updateFiltered();
  }, [searchTerm, poems]);

  const handleToggle = (poemId: number) => {
    if (selectedIds.includes(poemId)) {
      onSelectionChange(selectedIds.filter(id => id !== poemId));
    } else {
      onSelectionChange([...selectedIds, poemId]);
    }
  };

  const handleSelectAll = () => {
    const allIds = filteredPoems.map(poem => poem.id);
    const newSelection = [...new Set([...selectedIds, ...allIds])];
    onSelectionChange(newSelection);
  };

  const handleDeselectAll = () => {
    const filteredIds = filteredPoems.map(poem => poem.id);
    const newSelection = selectedIds.filter(id => !filteredIds.includes(id));
    onSelectionChange(newSelection);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const isSelected = (poemId: number) => selectedIds.includes(poemId);
  const selectedCount = selectedIds.length;
  const filteredSelectedCount = filteredPoems.filter(poem => selectedIds.includes(poem.id)).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 検索とコントロール */}
      <Card padding="sm">
        <div className="space-y-4">
          {/* 検索フィールド */}
          <Input
            placeholder="歌番号、歌詞、歌人名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* 統計表示 */}
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>
              選択済み: {selectedCount}首 / 全{poems.length}首
              {searchTerm && ` （表示中: ${filteredPoems.length}首）`}
            </span>
            <span className={selectedCount >= 4 ? 'text-emerald-600' : 'text-amber-600'}>
              {selectedCount >= 4 ? '✓ クイズ実行可能' : '⚠ 最低4首必要'}
            </span>
          </div>

          {/* 一括操作ボタン */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleSelectAll}
              disabled={filteredSelectedCount === filteredPoems.length}
            >
              {searchTerm ? '表示中を全選択' : '全選択'}
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleDeselectAll}
              disabled={filteredSelectedCount === 0}
            >
              {searchTerm ? '表示中を全解除' : '全解除'}
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleClearAll}
              disabled={selectedCount === 0}
            >
              すべてクリア
            </Button>
          </div>
        </div>
      </Card>

      {/* 歌一覧 */}
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
        {filteredPoems.map((poem) => (
          <div
            key={poem.id}
            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
              isSelected(poem.id)
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
            onClick={() => handleToggle(poem.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800 text-sm">
                    {poem.id}番
                  </span>
                  <span className="text-slate-600 text-sm">
                    {poem.poet}
                  </span>
                  {isSelected(poem.id) && (
                    <span className="text-indigo-600 text-xs">✓</span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {poem.above}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {poem.below}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 検索結果なし */}
      {filteredPoems.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>検索条件に一致する歌が見つかりません。</p>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => setSearchTerm('')}
            className="mt-2"
          >
            検索をクリア
          </Button>
        </div>
      )}
    </div>
  );
}