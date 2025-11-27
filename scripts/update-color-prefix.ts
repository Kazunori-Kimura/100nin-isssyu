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

// 文字列を正規化（空白・改行を除去）
function normalize(text: string): string {
  return text
    .replace(/\n/g, '')
    .replace(/\s+/g, '')
    .toLowerCase()
    .trim();
}

// 歌の最初の部分を取得（最初の4文字）
function getPrefix(text: string, length: number = 4): string {
  const normalized = normalize(text);
  return normalized.substring(0, length);
}

// group.json を読み込む
const groupPath = path.join(__dirname, 'group.json');
const groupData: GroupData[] = JSON.parse(fs.readFileSync(groupPath, 'utf-8'));

// poem.json を読み込む
const poemPath = path.join(__dirname, '../src/data/poem.json');
const poemData: PoemData[] = JSON.parse(fs.readFileSync(poemPath, 'utf-8'));

console.log('Matching poems by prefix...\n');

// poem.jsonから、歌の最初の部分 → poem を作成
const poemPrefixMap = new Map<string, PoemData>();
poemData.forEach(poem => {
  const prefix = getPrefix(poem.poem);
  poemPrefixMap.set(prefix, poem);
});

const groupIdToGroup = new Map<number, '青' | '桃' | '黄' | '緑' | '橙'>();
let matchCount = 0;
let notMatchCount = 0;

groupData.forEach(groupItem => {
  const prefix = getPrefix(groupItem.poem);
  const matchedPoem = poemPrefixMap.get(prefix);
  
  if (matchedPoem) {
    groupIdToGroup.set(matchedPoem.id, groupItem.group);
    console.log(`✓ Group ID ${groupItem.id} → Poem ID ${matchedPoem.id} (${groupItem.group}): ${prefix}...`);
    matchCount++;
  } else {
    console.log(`✗ Group ID ${groupItem.id}: No match for "${prefix}..."`);
    notMatchCount++;
  }
});

console.log(`\n${'='.repeat(70)}`);
console.log(`Matched: ${matchCount} / ${groupData.length}`);
console.log(`Not matched: ${notMatchCount}\n`);

console.log('Updating poem.json colors...\n');
let updatedCount = 0;
let unchangedCount = 0;
let notFoundCount = 0;
const notFound: number[] = [];

poemData.forEach(poem => {
  const group = groupIdToGroup.get(poem.id);
  
  if (group) {
    const newColor = groupToColor[group];
    if (poem.color !== newColor) {
      console.log(`  Update ID ${poem.id}: ${poem.color} → ${newColor} (${group})`);
      poem.color = newColor;
      updatedCount++;
    } else {
      unchangedCount++;
    }
  } else {
    notFound.push(poem.id);
    notFoundCount++;
  }
});

// 更新されたデータをpoem.jsonに書き込む
fs.writeFileSync(poemPath, JSON.stringify(poemData, null, 2) + '\n', 'utf-8');

console.log(`\n${'='.repeat(70)}`);
console.log(`✅ Updated: ${updatedCount} poems`);
console.log(`   Unchanged: ${unchangedCount} poems`);
if (notFoundCount > 0) {
  console.log(`⚠️  Not found: ${notFoundCount} poems`);
  console.log(`   IDs: ${notFound.join(', ')}`);
} else {
  console.log(`✅ All ${poemData.length} poems matched successfully!`);
}
console.log('='.repeat(70));
