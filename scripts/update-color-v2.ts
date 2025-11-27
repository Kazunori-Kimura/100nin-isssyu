import * as fs from 'fs';
import * as path from 'path';

interface GroupData {
  id: number;
  poem: string;
  group: '青' | '桃' | '黄' | '緑' | '橙';
}

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

// 文字列を正規化（空白・改行・記号を除去）
function normalize(text: string): string {
  return text
    .replace(/\n/g, ' ')  // 改行をスペースに置き換え
    .replace(/\s+/g, '')  // すべての空白を除去
    .replace(/[、。]/g, '')
    .toLowerCase()
    .trim();
}

// group.json を読み込む
const groupPath = path.join(__dirname, 'group.json');
const groupData: GroupData[] = JSON.parse(fs.readFileSync(groupPath, 'utf-8'));

// poem.json を読み込む
const poemPath = path.join(__dirname, '../src/data/poem.json');
const poemData: PoemData[] = JSON.parse(fs.readFileSync(poemPath, 'utf-8'));

console.log('Building group map from group.json...');
// groupDataから、正規化された漢字かな混じりテキスト → グループへのマッピングを作成
const groupPoemMap = new Map<string, '青' | '桃' | '黄' | '緑' | '橙'>();
groupData.forEach(item => {
  const normalizedPoem = normalize(item.poem);
  groupPoemMap.set(normalizedPoem, item.group);
  // デバッグ: 最初の3件を表示
  if (item.id <= 3) {
    console.log(`  Group ID ${item.id}: ${item.group} - ${normalizedPoem.substring(0, 20)}...`);
  }
});

console.log(`\nProcessing ${poemData.length} poems...`);
let updatedCount = 0;
let unchangedCount = 0;
let notFoundCount = 0;
const notFound: number[] = [];

poemData.forEach(poem => {
  // poem.jsonの漢字かな混じりテキストを正規化
  const normalizedPoemText = normalize(poem.poem);
  const group = groupPoemMap.get(normalizedPoemText);
  
  if (group) {
    const newColor = groupToColor[group];
    if (poem.color !== newColor) {
      console.log(`  ID ${poem.id}: ${poem.color} → ${newColor} (${group})`);
      poem.color = newColor;
      updatedCount++;
    } else {
      unchangedCount++;
    }
  } else {
    console.error(`  ⚠️  ID ${poem.id}: No match found`);
    console.error(`      Poem: ${normalizedPoemText.substring(0, 40)}...`);
    notFound.push(poem.id);
    notFoundCount++;
  }
});

// 更新されたデータをpoem.jsonに書き込む
fs.writeFileSync(poemPath, JSON.stringify(poemData, null, 2) + '\n', 'utf-8');

console.log('\n' + '='.repeat(70));
console.log(`✅ Updated: ${updatedCount} poems`);
console.log(`   Unchanged: ${unchangedCount} poems`);
if (notFoundCount > 0) {
  console.log(`⚠️  Not found: ${notFoundCount} poems - IDs: ${notFound.join(', ')}`);
} else {
  console.log(`✅ All ${poemData.length} poems matched successfully`);
}
console.log('='.repeat(70));
