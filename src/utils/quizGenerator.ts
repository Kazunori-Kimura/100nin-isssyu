import PoemInfo from '../types/poem';
import { QuizQuestion } from '../types/quiz';
import { shuffleArray } from './shuffleArray';
import { QUESTIONS_PER_QUIZ, CHOICES_PER_QUESTION } from './constants';

/**
 * 指定範囲から20首をランダム選択
 */
export const selectQuestions = (poems: PoemInfo[], start: number, end: number): PoemInfo[] => {
  const filteredPoems = poems.filter(p => p.id >= start && p.id <= end);
  return shuffleArray(filteredPoems).slice(0, QUESTIONS_PER_QUIZ);
};

/**
 * 指定されたIDリストから20首をランダム選択
 */
export const selectQuestionsByIds = (poems: PoemInfo[], selectedIds: number[]): PoemInfo[] => {
  const filteredPoems = poems.filter(p => selectedIds.includes(p.id));
  return shuffleArray(filteredPoems).slice(0, Math.min(QUESTIONS_PER_QUIZ, filteredPoems.length));
};

/**
 * 4択選択肢生成（正解1つ + 誤答3つ）
 */
export const generateChoices = (correct: string, allBelow: string[]): string[] => {
  const incorrect = shuffleArray(allBelow.filter(b => b !== correct)).slice(0, CHOICES_PER_QUESTION - 1);
  return shuffleArray([correct, ...incorrect]);
};

/**
 * 単一の歌からクイズ問題を生成
 */
export const createQuizQuestion = (poem: PoemInfo, allPoems: PoemInfo[]): QuizQuestion => {
  const allBelowVerses = allPoems.map(p => p.below);
  const choices = generateChoices(poem.below, allBelowVerses);

  return {
    id: poem.id,
    above: poem.above,
    correctAnswer: poem.below,
    choices,
    poet: poem.poet,
    fullPoem: poem.poem,
  };
};

/**
 * クイズセッション用の問題群を生成（範囲指定）
 */
export const generateQuizQuestions = (poems: PoemInfo[], start: number, end: number): QuizQuestion[] => {
  const selectedPoems = selectQuestions(poems, start, end);
  return selectedPoems.map(poem => createQuizQuestion(poem, poems));
};

/**
 * クイズセッション用の問題群を生成（ID指定）
 */
export const generateQuizQuestionsByIds = (poems: PoemInfo[], selectedIds: number[]): QuizQuestion[] => {
  const selectedPoems = selectQuestionsByIds(poems, selectedIds);
  return selectedPoems.map(poem => createQuizQuestion(poem, poems));
};

/**
 * スコアに基づく評価メッセージを取得
 */
export const getScoreMessage = (correctCount: number, total: number): string => {
  const percentage = (correctCount / total) * 100;
  
  if (percentage >= 90) return "素晴らしい！百人一首マスターですね！";
  if (percentage >= 70) return "とても良くできました！";
  if (percentage >= 50) return "まずまずの成績です。もう少し頑張りましょう！";
  return "まだまだ伸びしろがあります。継続は力なり！";
};