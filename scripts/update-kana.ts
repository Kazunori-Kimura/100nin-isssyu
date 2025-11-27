import * as fs from 'fs';
import * as path from 'path';

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
  color: string;
}

// kana.json を読み込む
const kanaPath = path.join(__dirname, 'kana.json');
const kanaData: KanaData[] = JSON.parse(fs.readFileSync(kanaPath, 'utf-8'));

// poem.json を読み込む
const poemPath = path.join(__dirname, '../src/data/poem.json');
const poemData: PoemData[] = JSON.parse(fs.readFileSync(poemPath, 'utf-8'));

// kanaDataをMapに変換して高速検索
const kanaMap = new Map<number, KanaData>();
kanaData.forEach(item => {
  kanaMap.set(item.id, item);
});

// poem.jsonの各アイテムの above, below を更新
let updatedCount = 0;
poemData.forEach(poem => {
  const kana = kanaMap.get(poem.id);
  if (kana) {
    poem.above = kana.上の句;
    poem.below = kana.下の句;
    updatedCount++;
  } else {
    console.error(`Warning: No kana data found for poem id ${poem.id}`);
  }
});

// 更新されたデータをpoem.jsonに書き込む
fs.writeFileSync(poemPath, JSON.stringify(poemData, null, 2) + '\n', 'utf-8');

console.log(`✅ Updated ${updatedCount} poems in ${poemPath}`);
