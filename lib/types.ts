export interface Player {
  id: string;
  name: string;
  currentInput: string;
  wpm: number;
  accuracy: number;
  wordsCompleted: number;
  finished: boolean;
  finishedAt?: number;
}

export interface RoundState {
  sentence: string;
  roundNumber: number;
  startTime: number;
  endTime: number;
  timeLeftMs: number;
}

export interface GameState {
  players: Player[];
  round: RoundState;
  status: "waiting" | "playing" | "between_rounds";
}

export interface PlayerStats {
  name: string;
  totalRounds: number;
  avgWpm: number;
  avgAccuracy: number;
  bestWpm: number;
}

// Client -> Server
export interface ClientEvents {
  "player:join": (data: { name: string }) => void;
  "player:progress": (data: { input: string }) => void;
  "player:finished": () => void;
}

// Server -> Client
export interface ServerEvents {
  "game:state": (state: GameState) => void;
  "game:tick": (data: { timeLeftMs: number }) => void;
  "game:newRound": (data: { sentence: string; roundNumber: number; startTime: number; endTime: number }) => void;
  "player:joined": (player: Player) => void;
  "player:left": (playerId: string) => void;
  "player:updated": (player: Player) => void;
  "player:stats": (stats: PlayerStats | null) => void;
  "error": (msg: string) => void;
}