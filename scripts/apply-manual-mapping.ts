import * as fs from 'fs';
import * as path from 'path';

interface PoemData {
  id: number;
  poem: string;
  poet: string;
  poet_kana: string;
  above: string;
  below: string;
  color: 'blue' | 'pink' | 'yellow' | 'green' | 'orange';
}

// 日本語グループ名を英語カラー名に変換
const groupToColor: Record<string, 'blue' | 'pink' | 'yellow' | 'green' | 'orange'> = {
  '青': 'blue',
  '桃': 'pink',
  '黄': 'yellow',
  '緑': 'green',
  '橙': 'orange'
};

// 手動マッピング: poem.json の id → group
const manualMapping: Record<number, '青' | '桃' | '黄' | '緑' | '橙'> = {
  6: '青',   // Group ID 7: かささぎの → 鵲の
  14: '青',  // Group ID 13: みちのくの → 陸奥の
  19: '橙',  // Group ID 93: 難波潟
  21: '橙',  // Group ID 87: 今こむと → 今来むと
  40: '桃',  // Group ID 31: 忍れど → 忍ぶれど
  47: '黄',  // Group ID 50: 八重葎 → 八重むぐら
  50: '青',  // Group ID 8: 君がため惜しからざりし
  57: '青',  // Group ID 11: めぐりあひて → めぐり逢ひて
  70: '青',  // Group ID 6: さびしさに → 寂しさに
  74: '青',  // Group ID 9: うかりける → 憂かりける
  76: '青',  // Group ID 12: わたの原漕ぎ出でて見れば
  77: '橙',  // Group ID 89: 瀬を早み → 瀬をはやみ
  78: '黄',  // Group ID 53: 淡路島
  80: '桃',  // Group ID 26: 長からむ → ながからむ
  99: '橙',  // Group ID 95: 人も惜し → 人も愛し
  100: '青', // Group ID 18: ももしきや → 百敷や
};

// poem.json を読み込む
const poemPath = path.join(__dirname, '../src/data/poem.json');
const poemData: PoemData[] = JSON.parse(fs.readFileSync(poemPath, 'utf-8'));

console.log('Applying manual mapping...\n');

let updatedCount = 0;
let unchangedCount = 0;

poemData.forEach(poem => {
  const targetGroup = manualMapping[poem.id];
  
  if (targetGroup) {
    const newColor = groupToColor[targetGroup];
    if (poem.color !== newColor) {
      console.log(`  Update ID ${poem.id}: ${poem.color} → ${newColor} (${targetGroup})`);
      console.log(`    "${poem.poem.substring(0, 40)}..."`);
      poem.color = newColor;
      updatedCount++;
    } else {
      unchangedCount++;
    }
  }
});

// 更新されたデータをpoem.jsonに書き込む
fs.writeFileSync(poemPath, JSON.stringify(poemData, null, 2) + '\n', 'utf-8');

console.log(`\n${'='.repeat(70)}`);
console.log(`✅ Updated: ${updatedCount} poems`);
console.log(`   Unchanged: ${unchangedCount} poems (already correct)`);
console.log('='.repeat(70));

// 各色のカウントを確認
const colorCounts: Record<string, number> = {
  blue: 0,
  pink: 0,
  yellow: 0,
  green: 0,
  orange: 0
};

poemData.forEach(poem => {
  colorCounts[poem.color]++;
});

console.log('\nColor distribution:');
console.log('  青 (blue):   ', colorCounts.blue, '/', 20);
console.log('  桃 (pink):   ', colorCounts.pink, '/', 20);
console.log('  黄 (yellow): ', colorCounts.yellow, '/', 20);
console.log('  緑 (green):  ', colorCounts.green, '/', 20);
console.log('  橙 (orange): ', colorCounts.orange, '/', 20);
console.log('  Total:       ', Object.values(colorCounts).reduce((a, b) => a + b, 0));
console.log('='.repeat(70));
