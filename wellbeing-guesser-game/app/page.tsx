import React from 'react';

/**
 * Main landing page for the Wellbeing Guesser Game.
 * Uses Tailwind CSS for layout and styling.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Wellbeing Guesser Game
        </h1>
        <p className="text-gray-400">
          A research project exploring digital wellbeing.
        </p>
      </div>
    </main>
  );
}