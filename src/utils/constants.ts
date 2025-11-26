export const DEFAULT_START_RANGE = 1;
export const DEFAULT_END_RANGE = 100;
export const QUESTIONS_PER_QUIZ = 20;
export const CHOICES_PER_QUESTION = 4;
export const MIN_RANGE_SIZE = 20; // 20問のクイズ作成のため最低20首必要

export const STORAGE_KEYS = {
  SETTINGS: 'hyakunin-isshu-settings',
} as const;

export const SCORE_MESSAGES = {
  EXCELLENT: "素晴らしい！百人一首マスターですね！",
  GOOD: "とても良くできました！",
  FAIR: "まずまずの成績です。もう少し頑張りましょう！",
  POOR: "まだまだ伸びしろがあります。継続は力なり！",
} as const;