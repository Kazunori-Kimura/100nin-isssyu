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

interface CheckResult {
  unmatchedFromGroup: Array<{
    groupId: number;
    poem: string;
    group: string;
  }>;
  unmatchedFromPoem: Array<{
    poemId: number;
    poem: string;
    color: string;
  }>;
}

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

// poem.jsonから、歌の最初の部分 → poem を作成
const poemPrefixMap = new Map<string, PoemData>();
poemData.forEach(poem => {
  const prefix = getPrefix(poem.poem);
  poemPrefixMap.set(prefix, poem);
});

const matchedPoemIds = new Set<number>();
const unmatchedFromGroup: Array<{groupId: number; poem: string; group: string}> = [];

// group.jsonの各アイテムをマッチング
groupData.forEach(groupItem => {
  const prefix = getPrefix(groupItem.poem);
  const matchedPoem = poemPrefixMap.get(prefix);
  
  if (matchedPoem) {
    matchedPoemIds.add(matchedPoem.id);
  } else {
    unmatchedFromGroup.push({
      groupId: groupItem.id,
      poem: groupItem.poem.replace(/\n/g, ' '),
      group: groupItem.group
    });
  }
});

// poem.jsonでマッチしなかったアイテムを抽出
const unmatchedFromPoem: Array<{poemId: number; poem: string; color: string}> = [];
poemData.forEach(poem => {
  if (!matchedPoemIds.has(poem.id)) {
    unmatchedFromPoem.push({
      poemId: poem.id,
      poem: poem.poem,
      color: poem.color
    });
  }
});

const result: CheckResult = {
  unmatchedFromGroup,
  unmatchedFromPoem
};

// check.jsonに書き出し
const checkPath = path.join(__dirname, 'check.json');
fs.writeFileSync(checkPath, JSON.stringify(result, null, 2) + '\n', 'utf-8');

console.log('='.repeat(70));
console.log('Unmatched poems analysis:');
console.log('='.repeat(70));
console.log(`\nUnmatched from group.json: ${unmatchedFromGroup.length} entries`);
unmatchedFromGroup.forEach(item => {
  console.log(`  Group ID ${item.groupId} (${item.group}): ${item.poem.substring(0, 40)}...`);
});

console.log(`\nUnmatched from poem.json: ${unmatchedFromPoem.length} entries`);
unmatchedFromPoem.forEach(item => {
  console.log(`  Poem ID ${item.poemId} (${item.color}): ${item.poem.substring(0, 40)}...`);
});

console.log(`\n${'='.repeat(70)}`);
console.log(`✅ Results written to: ${checkPath}`);
console.log('='.repeat(70));
