import { useLocalStorage } from './useLocalStorage';
import { AppSettings } from '../types/quiz';
import { ColorGroup } from '../types/poem';
import { DEFAULT_START_RANGE, DEFAULT_END_RANGE, STORAGE_KEYS } from '../utils/constants';

const defaultSettings: AppSettings = {
  mode: 'range',
  startRange: DEFAULT_START_RANGE,
  endRange: DEFAULT_END_RANGE,
  selectedIds: [],
  selectedColors: [],
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const resetToDefault = () => {
    setSettings(defaultSettings);
  };
  
  // 色グループから歌のIDを取得する関数
  const getIdsFromColors = (colors: ColorGroup[]): number[] => {
    const colorToIdMap: Record<ColorGroup, number[]> = {
      blue: Array.from({ length: 20 }, (_, i) => i + 1),      // 1-20
      pink: Array.from({ length: 20 }, (_, i) => i + 21),     // 21-40
      yellow: Array.from({ length: 20 }, (_, i) => i + 41),   // 41-60
      green: Array.from({ length: 20 }, (_, i) => i + 61),    // 61-80
      orange: Array.from({ length: 20 }, (_, i) => i + 81),   // 81-100
    };
    
    return colors.flatMap(color => colorToIdMap[color]).sort((a, b) => a - b);
  };

  const getRangeInfo = () => {
    if (settings.mode === 'range') {
      const count = settings.endRange - settings.startRange + 1;
      return {
        mode: 'range' as const,
        count,
        description: `${settings.startRange}-${settings.endRange}番 (${count}首)`,
      };
    } else if (settings.mode === 'color') {
      const count = getIdsFromColors(settings.selectedColors).length;
      const colorNames: Record<ColorGroup, string> = {
        blue: 'あお',
        pink: 'ピンク', 
        yellow: 'きいろ',
        green: 'みどり',
        orange: 'オレンジ',
      };
      const selectedColorNames = settings.selectedColors.map(color => colorNames[color]);
      return {
        mode: 'color' as const,
        count,
        description: count > 0 ? `${selectedColorNames.join('・')}グループ (${count}首)` : '色が選択されていません',
      };
    } else {
      const count = settings.selectedIds.length;
      return {
        mode: 'individual' as const,
        count,
        description: count > 0 ? `選択された${count}首` : '歌が選択されていません',
      };
    }
  };

  const getSelectedPoemIds = (): number[] => {
    if (settings.mode === 'range') {
      const ids = [];
      for (let i = settings.startRange; i <= settings.endRange; i++) {
        ids.push(i);
      }
      return ids;
    } else if (settings.mode === 'color') {
      return getIdsFromColors(settings.selectedColors);
    } else {
      return settings.selectedIds;
    }
  };
  
  return {
    settings,
    updateSettings,
    resetToDefault,
    getRangeInfo,
    getSelectedPoemIds,
  };
}