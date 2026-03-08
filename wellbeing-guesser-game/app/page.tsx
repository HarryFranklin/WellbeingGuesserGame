'use client';

import React, { useState } from 'react';

/**
 * Wellbeing Guesser Game - PhD Research Tool
 * Includes: Home, Quiz (3 questions), Game (3 rounds with feedback), and Debrief.
 */
export default function WellbeingGame() {
  // Navigation and Progress State
  const [stage, setStage] = useState<'HOME' | 'QUIZ' | 'GAME' | 'DEBRIEF'>('HOME');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Data and Scoring State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [gameScore, setGameScore] = useState<number>(0);

  // Game Logic State
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Constants
  const MAX_QUIZ_QUESTIONS = 3;
  const MAX_GAME_ROUNDS = 3;

  // --- STAGE 0: HOME ---
  const HomeStage = () => (
    <div className="flex flex-col items-center text-center gap-6 max-w-2xl">
      <h2 className="text-3xl font-semibold text-white">Welcome to the Study</h2>
      <p className="text-gray-400 leading-relaxed">
        This application is part of a Computer Science PhD research project into digital wellbeing. 
        You will complete a short 3-question quiz, followed by a 3-round interactive game.
      </p>
      <button 
        onClick={() => setStage('QUIZ')}
        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
      >
        Start Experiment
      </button>
    </div>
  );

  // --- STAGE 1: QUIZ ---
  const QuizStage = () => {
    const handleNext = () => {
      setQuizScore(prev => prev + 5); // Placeholder calculation for quiz weighting
      if (currentStep < MAX_QUIZ_QUESTIONS) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(1); // Reset step counter for the Game stage
        setStage('GAME');
      }
    };

    return (
      <div className="flex flex-col items-center gap-6">
        <span className="text-blue-500 font-mono text-sm">Question {currentStep} of {MAX_QUIZ_QUESTIONS}</span>
        <h2 className="text-2xl font-semibold text-white">Wellbeing Assessment</h2>
        <div className="w-64 h-40 bg-gray-800 flex items-center justify-center text-gray-500 border border-gray-700 italic">
          [Research Graphic {currentStep}]
        </div>
        <ul className="grid grid-cols-1 gap-3 w-full max-w-md">
          {['Definitely', 'Probably', 'Probably Not', 'Definitely Not'].map((opt) => (
            <button 
              key={opt}
              onClick={handleNext}
              className="p-3 bg-gray-900 border border-gray-700 text-white rounded hover:border-blue-500 transition-all text-center"
            >
              {opt}
            </button>
          ))}
        </ul>
      </div>
    );
  };

  // --- STAGE 2: GAME ---
  const GameStage = () => {
    const correctAnswer = 'A'; // Placeholder logic: Option A is always "correct"

    const handleVerify = () => {
      const win = selectedOption === correctAnswer;
      setIsCorrect(win);
      setShowFeedback(true);
      if (win) {
        setGameScore(prev => prev + 10);
      }
    };

    const handleNextRound = () => {
      setSelectedOption(null);
      setShowFeedback(false);
      if (currentStep < MAX_GAME_ROUNDS) {
        setCurrentStep(currentStep + 1);
      } else {
        setStage('DEBRIEF');
      }
    };

    return (
      <div className="relative flex flex-col items-center gap-6 w-full max-w-2xl">
        {/* HUD: Top Right Score */}
        <div className="absolute -top-16 right-0 bg-gray-900 p-3 rounded-lg border border-blue-500 text-white font-mono shadow-lg">
          Total Score: {gameScore + quizScore}
        </div>

        <span className="text-green-500 font-mono text-sm">Round {currentStep} of {MAX_GAME_ROUNDS}</span>
        <h2 className="text-2xl font-semibold text-white">The Guesser Game</h2>
        
        <div className="flex gap-6 w-full h-64">
          {['A', 'B'].map((type) => (
            <button 
              key={type}
              disabled={showFeedback}
              onClick={() => setSelectedOption(type as 'A' | 'B')}
              className={`relative flex-1 bg-gray-800 border-2 rounded-xl transition-all flex items-center justify-center text-white text-lg 
                ${selectedOption === type ? 'border-blue-500 bg-gray-700' : 'border-gray-700 hover:border-gray-500'}
                ${showFeedback && type === selectedOption ? (isCorrect ? 'border-green-500' : 'border-red-500') : ''}
              `}
            >
              [Image {type}]
              {showFeedback && selectedOption === type && (
                <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                  ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? '✓' : '✕'}
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 mt-4 h-24">
          {!showFeedback ? (
            <button 
              onClick={handleVerify}
              disabled={!selectedOption}
              className={`px-10 py-3 rounded-full font-bold transition-all
                ${selectedOption ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
              `}
            >
              Submit Answer
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <p className={`text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'You chose correctly!' : 'You chose incorrectly.'}
              </p>
              <p className="text-white font-mono text-xl">
                {isCorrect ? '+10 POINTS' : '+0 POINTS'}
              </p>
              <button 
                onClick={handleNextRound}
                className="mt-2 text-blue-400 underline hover:text-blue-300"
              >
                {currentStep < MAX_GAME_ROUNDS ? 'Next Round' : 'See Final Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- STAGE 3: DEBRIEF ---
  const DebriefStage = () => (
    <div className="flex flex-col items-center text-center gap-6">
      <h2 className="text-3xl font-semibold text-white">Final Report</h2>
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <p className="text-white text-xl">Final Score: {gameScore + quizScore}</p>
        <p className="text-gray-500 mt-2">Quiz Contribution: {quizScore}</p>
        <p className="text-gray-500">Game Contribution: {gameScore}</p>
      </div>
      <p className="max-w-md text-gray-400 italic">
        "Thank you for participating. This data will be used for academic analysis."
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 text-sm text-gray-600 hover:text-gray-400 underline"
      >
        Restart Session
      </button>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24">
      {/* Global Progress Bar (Hidden on Home) */}
      {stage !== 'HOME' && (
        <div className="mb-12 w-full max-w-md">
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-700 ease-in-out" 
              style={{ width: stage === 'QUIZ' ? '33%' : stage === 'GAME' ? '66%' : '100%' }}
            />
          </div>
        </div>
      )}

      {/* Stage Rendering */}
      {stage === 'HOME' && <HomeStage />}
      {stage === 'QUIZ' && <QuizStage />}
      {stage === 'GAME' && <GameStage />}
      {stage === 'DEBRIEF' && <DebriefStage />}
    </main>
  );
}