#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

interface PoemInfo {
  id: number;
  poem: string;
  poet: string;
  poet_kana: string;
  above: string;
  below: string;
  color: 'blue' | 'pink' | 'yellow' | 'green' | 'orange';
}

// コマンドライン引数を解析
const args = process.argv.slice(2);
const colorArg = args.find(arg => arg.startsWith('--color='));

if (!colorArg) {
  console.error('Error: --color option is required');
  console.error('Usage: npx ts-node scripts/color.ts --color=<color>');
  console.error('Available colors: blue, pink, yellow, green, orange');
  process.exit(1);
}

const color = colorArg.split('=')[1];
const validColors = ['blue', 'pink', 'yellow', 'green', 'orange'];

if (!validColors.includes(color)) {
  console.error(`Error: Invalid color "${color}"`);
  console.error('Available colors: blue, pink, yellow, green, orange');
  process.exit(1);
}

// poem.jsonを読み込み
const poemJsonPath = path.join(__dirname, '..', 'src', 'data', 'poem.json');
const poemData: PoemInfo[] = JSON.parse(fs.readFileSync(poemJsonPath, 'utf-8'));

// 指定された色でフィルタリング
const filteredPoems = poemData.filter(poem => poem.color === color);

// 結果を出力
console.log(JSON.stringify(filteredPoems, null, 2));
