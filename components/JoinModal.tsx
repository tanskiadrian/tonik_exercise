"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  onJoin: (name: string) => void;
}

export default function JoinModal({ onJoin }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    onJoin(trimmed);
  };

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-8 w-full max-w-sm mx-4 shadow-2xl shadow-black/50">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-200 mb-1">
            Join the race
          </h2>
          <p className="text-sm text-zinc-500">
            Pick a name and start typing.
          </p>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Your name"
          className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-md text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors mb-4"
          autoFocus
          maxLength={20}
        />

        <button
          onClick={handleSubmit}
          disabled={name.trim().length < 2}
          className="w-full py-2.5 text-sm font-medium rounded-md transition-colors bg-zinc-200 text-zinc-900 hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600"
        >
          Start
        </button>

        <p className="text-[11px] text-zinc-700 text-center mt-4">
          Adrian Tanski — recruitment exercise
        </p>
      </div>
    </div>
  );

  if (typeof window === "undefined") return modal;
  return createPortal(modal, document.body);
}