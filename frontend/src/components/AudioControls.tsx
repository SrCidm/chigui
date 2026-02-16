"use client";

import { useSpeech } from "@/hooks/useSpeech";

export default function AudioControls() {
  const { speaking, paused, speed, changeSpeed, pause, resume, stop } = useSpeech();

  if (!speaking) return null;

  const speeds = [1, 1.25, 1.5, 2];

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">🔊 Playing...</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Pause/Resume */}
        {paused ? (
          <button
            onClick={resume}
            className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition"
            title="Resume"
          >
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={pause}
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition"
            title="Pause"
          >
            <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}

        {/* Stop */}
        <button
          onClick={stop}
          className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
          title="Stop"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => changeSpeed(s)}
              className={`px-2 py-1 text-xs rounded transition ${
                speed === s
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
