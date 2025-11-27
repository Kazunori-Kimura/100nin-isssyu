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

// 歌のテキストを正規化（空白、改行、句読点を削除、ひらがなのみに変換）
function normalizePoem(poem: string): string {
  return poem
    .replace(/\s+/g, '')
    .replace(/\n/g, '')
    .replace(/[、。]/g, '')
    .toLowerCase()
    .trim();
}

// 上の句と下の句を結合して正規化
function normalizeKana(above: string, below: string): string {
  return normalizePoem(above + below);
}

interface KanaData {
  id: number;
  歌人: string;
  上の句: string;
  下の句: string;
}

// kana.json を読み込んで、かな表記から poem.json の id へのマッピングを作成
const kanaPath = path.join(__dirname, 'kana.json');
const kanaData: KanaData[] = JSON.parse(fs.readFileSync(kanaPath, 'utf-8'));

// group.json を読み込む
const groupPath = path.join(__dirname, 'group.json');
const groupData: GroupData[] = JSON.parse(fs.readFileSync(groupPath, 'utf-8'));

// poem.json を読み込む
const poemPath = path.join(__dirname, '../src/data/poem.json');
const poemData: PoemData[] = JSON.parse(fs.readFileSync(poemPath, 'utf-8'));

// kanaDataから、正規化されたかな → poem.json の id へのマッピングを作成
const kanaToIdMap = new Map<string, number>();
kanaData.forEach(item => {
  const normalizedKana = normalizeKana(item.上の句, item.下の句);
  kanaToIdMap.set(normalizedKana, item.id);
});

// groupDataから、正規化された歌のテキスト → グループへのマッピングを作成
const groupMap = new Map<string, '青' | '桃' | '黄' | '緑' | '橙'>();
groupData.forEach(item => {
  const normalizedPoem = normalizePoem(item.poem);
  groupMap.set(normalizedPoem, item.group);
});

// group.jsonの歌のテキストを正規化して、kanaのidを見つける
const groupIdToGroup = new Map<number, '青' | '桃' | '黄' | '緑' | '橙'>();
groupData.forEach(groupItem => {
  // group.jsonの歌のテキストを正規化
  const normalizedGroupPoem = normalizePoem(groupItem.poem);
  
  // kanaDataから対応するかな表記を探す
  kanaData.forEach(kanaItem => {
    const normalizedKana = normalizeKana(kanaItem.上の句, kanaItem.下の句);
    // もしgroup.jsonの歌のテキストに、kanaのかな表記の一部が含まれているか確認
    // より確実な方法として、poem.jsonの歌のテキストと照合
    const poemItem = poemData.find(p => p.id === kanaItem.id);
    if (poemItem) {
      const normalizedPoemText = normalizePoem(poemItem.poem);
      // 部分一致で確認（歌のテキストは表記が異なる可能性がある）
      const isMatch = normalizedGroupPoem === normalizedKana || 
                      normalizedPoemText === normalizedGroupPoem ||
                      normalizedKana === normalizedGroupPoem;
      
      if (isMatch) {
        groupIdToGroup.set(kanaItem.id, groupItem.group);
      }
    }
  });
});

// poem.jsonの各アイテムのcolorを更新
let updatedCount = 0;
let notFoundCount = 0;
const notFound: number[] = [];

poemData.forEach(poem => {
  const normalizedKana = normalizeKana(poem.above, poem.below);
  const group = groupMap.get(normalizedKana);
  
  if (group) {
    const newColor = groupToColor[group];
    if (poem.color !== newColor) {
      console.log(`ID ${poem.id}: ${poem.color} → ${newColor} (${group}) - ${poem.poem.substring(0, 20)}...`);
      poem.color = newColor;
      updatedCount++;
    }
  } else {
    console.error(`⚠️  Warning: No group data found for poem id ${poem.id}`);
    console.error(`   Kana: ${normalizedKana.substring(0, 30)}...`);
    console.error(`   Poem: ${poem.poem.substring(0, 30)}...`);
    notFound.push(poem.id);
    notFoundCount++;
  }
});

// 更新されたデータをpoem.jsonに書き込む
fs.writeFileSync(poemPath, JSON.stringify(poemData, null, 2) + '\n', 'utf-8');

console.log('\n' + '='.repeat(60));
console.log(`✅ Updated ${updatedCount} poems in ${poemPath}`);
if (notFoundCount > 0) {
  console.log(`⚠️  ${notFoundCount} poems not found in group.json: ${notFound.join(', ')}`);
} else {
  console.log(`✅ All ${poemData.length} poems matched successfully`);
}
console.log('='.repeat(60));
