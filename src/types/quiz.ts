export interface QuizQuestion {
  id: number;
  above: string;        // 問題として表示する上の句
  correctAnswer: string; // 正解の下の句
  choices: string[];    // 4つの選択肢
  poet: string;         // 歌人名
  fullPoem: string;     // 完全な歌詞
}

export interface QuizResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  above: string;
  poet: string;
}

export interface QuizSession {
  questions: QuizQuestion[];
  results: QuizResult[];
  currentQuestionIndex: number;
  score: number;
  isCompleted: boolean;
}

export type SelectionMode = 'range' | 'individual';

export interface AppSettings {
  mode: SelectionMode;          // 選択モード（範囲選択 or 個別選択）
  startRange: number;           // 出題開始番号（範囲選択時）
  endRange: number;             // 出題終了番号（範囲選択時）
  selectedIds: number[];        // 選択された歌のID配列（個別選択時）
}