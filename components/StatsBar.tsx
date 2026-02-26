"use client";

import { PlayerStats } from "@/lib/types";

interface Props {
  wpm: number;
  accuracy: number;
  savedStats: PlayerStats | null;
}

export default function StatsBar({ wpm, accuracy, savedStats }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="bg-gray-800 rounded px-4 py-2 flex items-center gap-2">
        <span className="text-gray-400 text-sm">WPM</span>
        <span className="text-lg font-bold text-green-400 font-mono">{wpm}</span>
      </div>

      <div className="bg-gray-800 rounded px-4 py-2 flex items-center gap-2">
        <span className="text-gray-400 text-sm">Accuracy</span>
        <span className="text-lg font-bold text-blue-400 font-mono">
          {(accuracy * 100).toFixed(1)}%
        </span>
      </div>

      {savedStats && (
        <>
          <div className="bg-gray-800 rounded px-4 py-2 flex items-center gap-2">
            <span className="text-gray-400 text-sm">Best WPM</span>
            <span className="text-lg font-bold text-yellow-400 font-mono">
              {savedStats.bestWpm}
            </span>
          </div>

          <div className="bg-gray-800 rounded px-4 py-2 flex items-center gap-2">
            <span className="text-gray-400 text-sm">Avg WPM</span>
            <span className="text-lg font-bold text-gray-300 font-mono">
              {savedStats.avgWpm}
            </span>
          </div>

          <div className="bg-gray-800 rounded px-4 py-2 flex items-center gap-2">
            <span className="text-gray-400 text-sm">Rounds</span>
            <span className="text-lg font-bold text-gray-300 font-mono">
              {savedStats.totalRounds}
            </span>
          </div>
        </>
      )}
    </div>
  );
}