"use client";

import { Player } from "@/lib/types";
import { useTableSort, SortKey } from "@/hooks/useTableSort";

interface Props {
  players: Player[];
  sentence: string;
}

export default function PlayerTable({ players, sentence }: Props) {
  const {
    sorted,
    sortKey,
    sortDir,
    toggleSort,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
  } = useTableSort(players);

  if (players.length === 0) {
    return <div className="bg-gray-800 rounded p-8 text-center text-gray-500">No players yet.</div>;
  }

  const handleSort = (key: SortKey) => toggleSort(key);
  const arrow = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " |ASC" : "|DESC ") : "";

  return (
    <div className="bg-gray-800 rounded overflow-hidden">
      <div className="flex justify-between px-4 py-2 border-b border-gray-700">
        <span className="text-sm text-gray-400">{players.length} players</span>
        <div className="flex gap-1">
          {[5, 10, 20].map((n) => (
            <button
              key={n}
              onClick={() => { setRowsPerPage(n); setPage(0); }}
              className={`text-xs px-2 py-1 rounded ${rowsPerPage === n ? "bg-gray-600 text-white" : "text-gray-500"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700 text-gray-400 text-xs text-left">
            <th className="px-4 py-2 w-10">#</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("name")}>Player{arrow("name")}</th>
            <th className="px-4 py-2">Progress</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("wpm")}>WPM{arrow("wpm")}</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("accuracy")}>Accuracy{arrow("accuracy")}</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((player, i) => {
            const progress = Math.min((player.currentInput.length / sentence.length) * 100, 100);
            return (
              <tr key={player.id} className="border-b border-gray-700">
                <td className="px-4 py-2 text-gray-500 font-mono">{page * rowsPerPage + i + 1}</td>
                <td className="px-4 py-2 text-white font-medium">{player.name}</td>
                <td className="px-4 py-2 min-w-[150px]">
                  <div className="bg-gray-700 rounded h-2">
                    <div className="bg-green-500 h-2 rounded" style={{ width: `${progress}%` }} />
                  </div>
                </td>
                <td className="px-4 py-2 text-green-400 font-mono font-bold">{player.wpm}</td>
                <td className="px-4 py-2 text-gray-300 font-mono">{(player.accuracy * 100).toFixed(1)}%</td>
                <td className="px-4 py-2 text-xs">
                  {player.finished
                    ? <span className="text-green-400">Done</span>
                    : player.currentInput.length > 0
                    ? <span className="text-yellow-400">Typing</span>
                    : <span className="text-gray-600">Idle</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 py-2 border-t border-gray-700 text-xs text-gray-400">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="disabled:text-gray-700">Prev</button>
          <span>{page + 1}/{totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="disabled:text-gray-700">Next</button>
        </div>
      )}
    </div>
  );
}