import * as fs from 'fs';
import * as path from 'path';

interface GroupData {
  id: number;
  poem: string;
  group: '青' | '桃' | '黄' | '緑' | '橙';
}

interface KanaData {
  id: number;
  歌人: string;
  上の句: string;
  下の句: string;
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

// 文字列を正規化（空白・改行・記号を除去、小文字化）
function normalize(text: string): string {
  return text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, '')
    .replace(/[、。]/g, '')
    .toLowerCase()
    .trim();
}

// kana.json を読み込む
const kanaPath = path.join(__dirname, 'kana.json');
const kanaData: KanaData[] = JSON.parse(fs.readFileSync(kanaPath, 'utf-8'));

// group.json を読み込む
const groupPath = path.join(__dirname, 'group.json');
const groupData: GroupData[] = JSON.parse(fs.readFileSync(groupPath, 'utf-8'));

// poem.json を読み込む
const poemPath = path.join(__dirname, '../src/data/poem.json');
const poemData: PoemData[] = JSON.parse(fs.readFileSync(poemPath, 'utf-8'));

console.log('Step 1: Building kana map (poem id → normalized kana)...');
// kanaDataから、正規化されたかな → poem.json の id へのマッピング
const kanaMap = new Map<string, number>();
kanaData.forEach(item => {
  const normalizedKana = normalize(item.上の句 + item.下の句);
  kanaMap.set(normalizedKana, item.id);
});
console.log(`  Created kana map with ${kanaMap.size} entries\n`);

console.log('Step 2: Matching group.json poems to kana...');
// group.jsonの各歌をかなに変換して、poemのIDを特定
const groupIdToGroup = new Map<number, '青' | '桃' | '黄' | '緑' | '橙'>(); // poem id → group
let matchCount = 0;

groupData.forEach(groupItem => {
  // group.jsonの歌を正規化してかなに近い形にする
  // ただし漢字が含まれているので、poem.jsonの漢字かな混じりテキストと照合
  const normalizedGroupPoem = normalize(groupItem.poem);
  
  // poem.jsonから一致する歌を探す（上の句+下の句のかなで照合）
  let found = false;
  for (const poemItem of poemData) {
    const normalizedKana = normalize(poemItem.above + poemItem.below);
    const normalizedPoemText = normalize(poemItem.poem);
    
    // かな表記との一致を優先
    if (normalizedGroupPoem === normalizedKana) {
      groupIdToGroup.set(poemItem.id, groupItem.group);
      console.log(`  ✓ Match (kana): Poem ID ${poemItem.id} → Group "${groupItem.group}"`);
      matchCount++;
      found = true;
      break;
    }
    
    // 漢字かな混じりテキストとの一致
    if (normalizedGroupPoem === normalizedPoemText) {
      groupIdToGroup.set(poemItem.id, groupItem.group);
      console.log(`  ✓ Match (kanji): Poem ID ${poemItem.id} → Group "${groupItem.group}"`);
      matchCount++;
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log(`  ✗ No match for group ID ${groupItem.id}: ${groupItem.poem.substring(0, 25).replace(/\n/g, ' ')}...`);
  }
});

console.log(`\n${'='.repeat(70)}`);
console.log(`Matched ${matchCount} out of ${groupData.length} group entries\n`);

console.log('Step 3: Updating poem.json colors...');
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
console.log(`   Unchanged: ${unchangedCount} poems (already correct)`);
if (notFoundCount > 0) {
  console.log(`⚠️  Not found: ${notFoundCount} poems`);
  console.log(`   IDs: ${notFound.slice(0, 20).join(', ')}${notFound.length > 20 ? '...' : ''}`);
} else {
  console.log(`✅ All ${poemData.length} poems matched successfully!`);
}
console.log('='.repeat(70));
