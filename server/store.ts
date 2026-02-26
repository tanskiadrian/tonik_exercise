import fs from "fs";
import path from "path";
import { PlayerStats } from "../lib/types";

const STORE_PATH = path.join(process.cwd(), "data", "players.json");

function ensureStore(): Record<string, PlayerStats> {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, "{}");
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
}

export function getPlayerStats(name: string): PlayerStats | null {
  const store = ensureStore();
  return store[name.toLowerCase()] || null;
}

export function savePlayerRound(
  name: string,
  wpm: number,
  accuracy: number
): PlayerStats {
  const store = ensureStore();
  const key = name.toLowerCase();
  const existing = store[key];

  if (existing) {
    const totalRounds = existing.totalRounds + 1;
    store[key] = {
      name,
      totalRounds,
      avgWpm: Math.round(
        (existing.avgWpm * existing.totalRounds + wpm) / totalRounds
      ),
      avgAccuracy: parseFloat(
        (
          (existing.avgAccuracy * existing.totalRounds + accuracy) /
          totalRounds
        ).toFixed(4)
      ),
      bestWpm: Math.max(existing.bestWpm, wpm),
    };
  } else {
    store[key] = {
      name,
      totalRounds: 1,
      avgWpm: wpm,
      avgAccuracy: accuracy,
      bestWpm: wpm,
    };
  }

  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
  return store[key];
}