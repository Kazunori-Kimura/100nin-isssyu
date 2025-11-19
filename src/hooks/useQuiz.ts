import { useState, useCallback, useMemo } from 'react';
import { QuizSession, QuizResult, QuizQuestion, SelectionMode } from '../types/quiz';
import PoemInfo from '../types/poem';
import { generateQuizQuestions, generateQuizQuestionsByIds } from '../utils/quizGenerator';

interface UseQuizOptions {
  poems: PoemInfo[];
  mode: SelectionMode;
  startRange?: number;
  endRange?: number;
  selectedIds?: number[];
}

export function useQuiz({ poems, mode, startRange, endRange, selectedIds }: UseQuizOptions) {
  const [session, setSession] = useState<QuizSession | null>(null);
  
  // クイズ設定を安定化
  const quizConfig = useMemo(() => ({ 
    poems, 
    mode, 
    startRange, 
    endRange, 
    selectedIds 
  }), [poems, mode, startRange, endRange, selectedIds]);
  
  const startQuiz = useCallback(() => {
    let questions: QuizQuestion[];
    
    if (quizConfig.mode === 'range' && quizConfig.startRange !== undefined && quizConfig.endRange !== undefined) {
      questions = generateQuizQuestions(quizConfig.poems, quizConfig.startRange, quizConfig.endRange);
    } else if ((quizConfig.mode === 'individual' || quizConfig.mode === 'color') && quizConfig.selectedIds !== undefined) {
      questions = generateQuizQuestionsByIds(quizConfig.poems, quizConfig.selectedIds);
    } else {
      console.error('Invalid quiz configuration');
      return;
    }
    
    setSession({
      questions,
      results: [],
      currentQuestionIndex: 0,
      score: 0,
      isCompleted: false,
    });
  }, [quizConfig]);
  
  const answerQuestion = useCallback((userAnswer: string) => {
    if (!session || session.isCompleted) return;
    
    const currentQuestion = session.questions[session.currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      above: currentQuestion.above,
      poet: currentQuestion.poet,
    };
    
    const newResults = [...session.results, result];
    const newScore = isCorrect ? session.score + 1 : session.score;
    const nextQuestionIndex = session.currentQuestionIndex + 1;
    const isCompleted = nextQuestionIndex >= session.questions.length;
    
    setSession({
      ...session,
      results: newResults,
      score: newScore,
      currentQuestionIndex: nextQuestionIndex,
      isCompleted,
    });
  }, [session]);
  
  const resetQuiz = useCallback(() => {
    setSession(null);
  }, []);
  
  const getCurrentQuestion = (): QuizQuestion | null => {
    if (!session || session.isCompleted) return null;
    return session.questions[session.currentQuestionIndex] || null;
  };
  
  return {
    session,
    startQuiz,
    answerQuestion,
    resetQuiz,
    getCurrentQuestion,
    isActive: !!session && !session.isCompleted,
    currentQuestionNumber: session ? session.currentQuestionIndex + 1 : 0,
    totalQuestions: session?.questions.length || 0,
  };
}