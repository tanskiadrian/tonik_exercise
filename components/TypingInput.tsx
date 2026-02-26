"use client";

import { useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
  finished: boolean;
}

export default function TypingInput({
  value,
  onChange,
  disabled,
  finished,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  
  useEffect(() => {
    if (!disabled && ref.current) {
      ref.current.focus();
    }
  }, [disabled]);

  return (
    <div className="relative">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={2}
        className={`w-full px-4 py-3 bg-zinc-800 border rounded-xl text-white font-mono text-lg resize-none focus:outline-none transition-colors ${
          finished
            ? "border-emerald-500 bg-emerald-500/10"
            : disabled
            ? "border-zinc-700 text-zinc-500 cursor-not-allowed"
            : "border-zinc-600 focus:border-emerald-500"
        }`}
        placeholder={
          disabled
            ? finished
              ? "✓ Finished!"
              : "Waiting for next round..."
            : "Start typing..."
        }
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      {finished && (
        <div className="absolute right-3 top-3 text-emerald-400 text-2xl">
          !^
        </div>
      )}
    </div>
  );
}