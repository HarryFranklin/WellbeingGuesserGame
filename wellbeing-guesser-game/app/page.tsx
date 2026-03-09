'use client';

import React, { useState, useEffect } from 'react';

/**
 * Wellbeing Guesser Game - PhD Research Tool
 * Part 1: Initial preference assessment (0 pts)
 * Part 2: Interactive decision-making game (Scoring)
 * Part 3: Final debrief and results summary
 */
export default function WellbeingGame() {
  // Navigation State
  const [stage, setStage] = useState<'HOME' | 'QUIZ' | 'GAME' | 'DEBRIEF'>('HOME');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Research Data & Scoring State
  const [quizPreferences, setQuizPreferences] = useState<string[]>([]);
  const [generatedValue, setGeneratedValue] = useState<number | null>(null);
  const [gameScore, setGameScore] = useState<number>(0);

  // Interaction State (Shared by Quiz and Game)
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const MAX_QUIZ_QUESTIONS = 3;
  const MAX_GAME_ROUNDS = 3;

  /**
   * DEBUG GENERATOR: 
   * Triggers once when moving to the GAME stage to simulate profile generation.
   */
  useEffect(() => {
    if (stage === 'GAME' && generatedValue === null) {
      const debugValue = Math.floor(Math.random() * 100) + 1;
      setGeneratedValue(debugValue);
    }
  }, [stage, generatedValue]);

  // --- STAGE 0: HOME ---
  const HomeStage = () => (
    <div className="flex flex-col items-center text-center gap-8 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">Wellbeing Research Study</h1>
        <p className="text-blue-400 font-mono text-sm uppercase tracking-widest">Computer Science PhD Project</p>
      </div>
      
      <div className="space-y-4 text-gray-400 leading-relaxed">
        <p>
          Thank you for participating in this study exploring wellbeing.
          The session consists of three main parts:
        </p>
        <ul className="text-sm space-y-2 inline-block text-left list-disc list-inside">
          <li>Part 1: Initial preference assessment</li>
          <li>Part 2: Interactive decision-making game</li>
          <li>Part 3: Final debrief and results summary</li>
        </ul>
      </div>

      <button 
        onClick={() => setStage('QUIZ')}
        className="mt-4 px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/10"
      >
        Enter Study
      </button>
    </div>
  );

  // --- STAGE 1: QUIZ (0 POINTS + SUBMIT BUTTON) ---
  const QuizStage = () => {
    const handleQuizSubmit = () => {
      if (!selectedOption) return;
      
      setQuizPreferences(prev => [...prev, selectedOption]);
      setSelectedOption(null); // Reset for next question

      if (currentStep < MAX_QUIZ_QUESTIONS) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(1);
        setStage('GAME');
      }
    };

    return (
      <div className="flex flex-col items-center gap-8 w-full max-w-md">
        <div className="text-center">
          <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Part 1: Assessment</span>
          <h2 className="text-2xl font-semibold text-white mt-2">Preference {currentStep} of {MAX_QUIZ_QUESTIONS}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 w-full">
          {['Option A', 'Option B', 'Option C'].map((opt) => (
            <button 
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className={`p-5 border-2 rounded-2xl transition-all text-left font-medium
                ${selectedOption === opt 
                  ? 'border-blue-500 bg-gray-800 text-white' 
                  : 'border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-700'}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        <button 
          onClick={handleQuizSubmit}
          disabled={!selectedOption}
          className={`w-full py-4 rounded-full font-bold uppercase tracking-widest transition-all
            ${selectedOption 
              ? 'bg-blue-600 text-white hover:bg-blue-500' 
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
          `}
        >
          Submit Preference
        </button>
      </div>
    );
  };

  // --- STAGE 2: GAME (SCORE ONLY FROM GAME CHOICES) ---
  const GameStage = () => {
    const correctAnswer = 'B';

    const handleVerify = () => {
      const win = selectedOption === correctAnswer;
      setIsCorrect(win);
      setShowFeedback(true);
      if (win) setGameScore(prev => prev + 10);
    };

    const handleNext = () => {
      setSelectedOption(null);
      setShowFeedback(false);
      if (currentStep < MAX_GAME_ROUNDS) {
        setCurrentStep(currentStep + 1);
      } else {
        setStage('DEBRIEF');
      }
    };

    return (
      <div className="relative flex flex-col items-center gap-8 w-full max-w-2xl">
        <div className="absolute -top-16 right-0 bg-gray-900 px-4 py-2 rounded-lg border border-blue-500 text-white font-mono shadow-lg">
          SCORE: {gameScore}
        </div>

        <div className="text-center">
          <span className="text-gray-500 font-mono text-xs uppercase tracking-widest">Part 2: Interactive Task</span>
          <h2 className="text-2xl font-semibold text-white mt-2">Round {currentStep} of {MAX_GAME_ROUNDS}</h2>
        </div>
        
        <div className="flex gap-4 w-full h-56">
          {['A', 'B'].map((choice) => (
            <button 
              key={choice}
              disabled={showFeedback}
              onClick={() => setSelectedOption(choice)}
              className={`relative flex-1 rounded-3xl border-2 transition-all flex items-center justify-center text-5xl font-black text-white
                ${selectedOption === choice ? 'border-blue-500 bg-gray-800' : 'border-gray-800 bg-gray-900 hover:border-gray-700'}
                ${showFeedback && choice === selectedOption ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}
              `}
            >
              {choice}
              {showFeedback && selectedOption === choice && (
                <div className={`absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-2xl
                  ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? '✓' : '✕'}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="h-32 flex flex-col items-center justify-center w-full">
          {!showFeedback ? (
            <button 
              onClick={handleVerify} 
              disabled={!selectedOption} 
              className={`px-14 py-4 rounded-full font-bold uppercase tracking-widest transition-all
                ${selectedOption ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
              `}
            >
              Submit Answer
            </button>
          ) : (
            <div className="text-center animate-in fade-in slide-in-from-bottom-2">
              <p className={`text-xl font-black ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'SUCCESS' : 'INCORRECT'}
              </p>
              <p className="text-white font-mono text-2xl mt-1">
                {isCorrect ? '+10 POINTS' : '+0 POINTS'}
              </p>
              <button 
                onClick={handleNext} 
                className="mt-4 px-8 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-full transition-colors uppercase font-bold"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 p-3 bg-white/5 border border-white/10 rounded-lg text-gray-500 font-mono text-[10px] text-center w-full">
          RESEARCH DEBUG | PROFILE ID: <span className="text-white font-bold">{generatedValue ?? '...'}</span> | PREFS LOGGED: {quizPreferences.length}
        </div>
      </div>
    );
  };

  // --- STAGE 3: DEBRIEF ---
  const DebriefStage = () => (
    <div className="flex flex-col items-center text-center gap-8">
      <h2 className="text-4xl font-bold text-white tracking-tight">Study Complete</h2>
      <div className="bg-gray-900 p-10 rounded-3xl border border-gray-800 w-full max-w-sm shadow-2xl text-center">
        <p className="text-blue-400 text-[10px] uppercase font-bold tracking-widest mb-2">Final Game Score</p>
        <p className="text-7xl text-white font-black">{gameScore}</p>
      </div>
      <button 
        onClick={() => window.location.reload()} 
        className="text-gray-600 hover:text-white text-xs transition-colors underline underline-offset-8"
      >
        Restart Session
      </button>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24 font-sans selection:bg-blue-500/30">
      <div className="w-full flex justify-center items-center">
        {stage === 'HOME' && <HomeStage />}
        {stage === 'QUIZ' && <QuizStage />}
        {stage === 'GAME' && <GameStage />}
        {stage === 'DEBRIEF' && <DebriefStage />}
      </div>
    </main>
  );
}