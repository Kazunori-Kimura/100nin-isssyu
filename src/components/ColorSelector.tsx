import React from 'react';
import { ColorGroup } from '../types/poem';

interface ColorSelectorProps {
  selectedColors: ColorGroup[];
  onColorsChange: (colors: ColorGroup[]) => void;
}

const COLOR_INFO: Record<ColorGroup, { name: string; bgClass: string; textClass: string }> = {
  blue: { name: 'あお', bgClass: 'bg-blue-100 hover:bg-blue-200', textClass: 'text-blue-800' },
  pink: { name: 'ピンク', bgClass: 'bg-pink-100 hover:bg-pink-200', textClass: 'text-pink-800' },
  yellow: { name: 'きいろ', bgClass: 'bg-yellow-100 hover:bg-yellow-200', textClass: 'text-yellow-800' },
  green: { name: 'みどり', bgClass: 'bg-green-100 hover:bg-green-200', textClass: 'text-green-800' },
  orange: { name: 'オレンジ', bgClass: 'bg-orange-100 hover:bg-orange-200', textClass: 'text-orange-800' },
};

const COLOR_RANGES: Record<ColorGroup, string> = {
  blue: '1-20番',
  pink: '21-40番',
  yellow: '41-60番',
  green: '61-80番',
  orange: '81-100番',
};

export default function ColorSelector({ selectedColors, onColorsChange }: ColorSelectorProps) {
  const handleColorToggle = (color: ColorGroup) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    onColorsChange(newColors);
  };

  const handleSelectAll = () => {
    const allColors: ColorGroup[] = ['blue', 'pink', 'yellow', 'green', 'orange'];
    onColorsChange(allColors);
  };

  const handleDeselectAll = () => {
    onColorsChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">五色百人一首</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="px-3 py-1 text-sm text-black bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            すべて選択
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            className="px-3 py-1 text-sm text-black bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            すべて解除
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(COLOR_INFO).map(([color, info]) => {
          const colorKey = color as ColorGroup;
          const isSelected = selectedColors.includes(colorKey);
          
          return (
            <button
              key={color}
              type="button"
              onClick={() => handleColorToggle(colorKey)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? `${info.bgClass} border-current ring-2 ring-opacity-50` 
                  : `bg-white border-gray-200 hover:${info.bgClass.split(' ')[1]}`
                }
                ${info.textClass}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-semibold text-lg">{info.name}</div>
                  <div className="text-sm opacity-80">{COLOR_RANGES[colorKey]}</div>
                  <div className="text-xs opacity-70 mt-1">20首</div>
                </div>
                {isSelected && (
                  <div className="ml-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedColors.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            選択中: {selectedColors.map(color => COLOR_INFO[color].name).join('・')} 
            ({selectedColors.length * 20}首)
          </div>
        </div>
      )}
    </div>
  );
}