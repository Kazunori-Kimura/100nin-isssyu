import { useLocalStorage } from './useLocalStorage';
import { AppSettings } from '../types/quiz';
import { DEFAULT_START_RANGE, DEFAULT_END_RANGE, STORAGE_KEYS } from '../utils/constants';

const defaultSettings: AppSettings = {
  mode: 'range',
  startRange: DEFAULT_START_RANGE,
  endRange: DEFAULT_END_RANGE,
  selectedIds: [],
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.SETTINGS, defaultSettings);
  
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const resetToDefault = () => {
    setSettings(defaultSettings);
  };
  
  const getRangeInfo = () => {
    if (settings.mode === 'range') {
      const count = settings.endRange - settings.startRange + 1;
      return {
        mode: 'range' as const,
        count,
        description: `${settings.startRange}-${settings.endRange}番 (${count}首)`,
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