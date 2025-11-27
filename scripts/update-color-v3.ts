import * as fs from 'fs';
import * as path from 'path';

interface GroupData {
  id: number; // これはgroup.json内での連番ID
  poem: string; // 漢字かな混じり
  group: '青' | '桃' | '黄' | '緑' | '橙';
}

interface PoemData {
  id: number; // 1-100の歌番号
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

// 文字列を正規化（ひらがなのみ、空白・記号なし）
function normalize(text: string): string {
  return text
    .replace(/\s+/g, '')
    .replace(/\n/g, '')
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

console.log('Matching poems by normalized text...\n');

// group.jsonの各歌に対して、poem.jsonから一致する歌を探す
const matches = new Map<number, '青' | '桃' | '黄' | '緑' | '橙'>(); // poem.id → group

groupData.forEach(groupItem => {
  const normalizedGroupPoem = normalize(groupItem.poem);
  
  // poem.jsonから一致する歌を探す
  let found = false;
  for (const poemItem of poemData) {
    const normalizedPoemText = normalize(poemItem.poem);
    
    // 完全一致を試す
    if (normalizedGroupPoem === normalizedPoemText) {
      matches.set(poemItem.id, groupItem.group);
      console.log(`✓ Match: Poem ID ${poemItem.id} → Group "${groupItem.group}" (exact match)`);
      found = true;
      break;
    }
  }
  
  // 完全一致しない場合、かな表記で試す
  if (!found) {
    for (const poemItem of poemData) {
      const normalizedKana = normalize(poemItem.above + poemItem.below);
      
      // かな表記との一致を試す（group.jsonの歌がひらがなの場合）
      if (normalizedGroupPoem === normalizedKana) {
        matches.set(poemItem.id, groupItem.group);
        console.log(`✓ Match: Poem ID ${poemItem.id} → Group "${groupItem.group}" (kana match)`);
        found = true;
        break;
      }
    }
  }
  
  if (!found) {
    console.log(`✗ No match for group ID ${groupItem.id}: ${groupItem.poem.substring(0, 30)}...`);
  }
});

console.log(`\n${'='.repeat(70)}`);
console.log(`Found ${matches.size} matches out of ${groupData.length} group entries\n`);

// poem.jsonを更新
let updatedCount = 0;
let unchangedCount = 0;
let notFoundCount = 0;
const notFound: number[] = [];

poemData.forEach(poem => {
  const group = matches.get(poem.id);
  
  if (group) {
    const newColor = groupToColor[group];
    if (poem.color !== newColor) {
      console.log(`Update ID ${poem.id}: ${poem.color} → ${newColor} (${group})`);
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
  console.log(`⚠️  Not found: ${notFoundCount} poems - IDs: ${notFound.slice(0, 10).join(', ')}${notFound.length > 10 ? '...' : ''}`);
} else {
  console.log(`✅ All ${poemData.length} poems matched successfully`);
}
console.log('='.repeat(70));
