import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";
import { Player, GameState, RoundState } from "../lib/types";
import { getRandomSentence } from "../lib/sentences";
import { calculateWPM, calculateAccuracy } from "../lib/calculate-stats";
import { getPlayerStats, savePlayerRound } from "./store";

const ROUND_DURATION_MS = 30_000;
const BETWEEN_ROUNDS_MS = 5_000;
const TICK_INTERVAL_MS = 100;

export class GameEngine {
  private io: Server;
  private players: Map<string, Player> = new Map();
  private socketToPlayer: Map<string, string> = new Map();
  private round: RoundState;
  private tickTimer: NodeJS.Timeout | null = null;
  private status: "waiting" | "playing" | "between_rounds" = "waiting";

  constructor(io: Server) {
    this.io = io;
    this.round = this.createRound();
    this.startGameLoop();
  }

  private createRound(): RoundState {
    const now = Date.now();
    return {
      sentence: getRandomSentence(),
      roundNumber: this.round ? this.round.roundNumber + 1 : 1,
      startTime: now,
      endTime: now + ROUND_DURATION_MS,
      timeLeftMs: ROUND_DURATION_MS,
    };
  }

  private startGameLoop() {
    this.status = "playing";
    this.round = this.createRound();
    this.resetAllPlayers();
    this.io.emit("game:newRound", {
      sentence: this.round.sentence,
      roundNumber: this.round.roundNumber,
      startTime: this.round.startTime,
      endTime: this.round.endTime,
    });

    if (this.tickTimer) clearInterval(this.tickTimer);

    this.tickTimer = setInterval(() => {
      const now = Date.now();

      if (this.status === "playing") {
        this.round.timeLeftMs = Math.max(0, this.round.endTime - now);
        this.io.emit("game:tick", { timeLeftMs: this.round.timeLeftMs });

        if (this.round.timeLeftMs <= 0) {
          this.endRound();
        }
      } else if (this.status === "between_rounds") {
        this.round.timeLeftMs = Math.max(0, this.round.endTime - now);
        this.io.emit("game:tick", { timeLeftMs: this.round.timeLeftMs });

        if (this.round.timeLeftMs <= 0) {
          this.startGameLoop();
        }
      }
    }, TICK_INTERVAL_MS);
  }

  private endRound() {
    this.players.forEach((player) => {
      if (player.wpm > 0 || player.currentInput.length > 0) {
        savePlayerRound(player.name, player.wpm, player.accuracy);
      }
    });

    this.status = "between_rounds";
    const now = Date.now();
    this.round.endTime = now + BETWEEN_ROUNDS_MS;
    this.round.timeLeftMs = BETWEEN_ROUNDS_MS;
  }

  private resetAllPlayers() {
    this.players.forEach((player) => {
      player.currentInput = "";
      player.wpm = 0;
      player.accuracy = 1;
      player.wordsCompleted = 0;
      player.finished = false;
      player.finishedAt = undefined;
    });
  }

  getState(): GameState {
    return {
      players: Array.from(this.players.values()),
      round: { ...this.round },
      status: this.status,
    };
  }

  handleConnection(socket: Socket) {
    socket.emit("game:state", this.getState());

    socket.on("player:join", ({ name }: { name: string }) => {
      const playerId = uuid();
      const player: Player = {
        id: playerId,
        name,
        currentInput: "",
        wpm: 0,
        accuracy: 1,
        wordsCompleted: 0,
        finished: false,
      };

      this.players.set(playerId, player);
      this.socketToPlayer.set(socket.id, playerId);

      const stats = getPlayerStats(name);
      socket.emit("player:stats", stats);

      this.io.emit("game:state", this.getState());
    });

    socket.on("player:progress", ({ input }: { input: string }) => {
      const playerId = this.socketToPlayer.get(socket.id);
      if (!playerId) return;
      const player = this.players.get(playerId);
      if (!player || player.finished || this.status !== "playing") return;

      player.currentInput = input;

      const elapsed = Date.now() - this.round.startTime;
      player.wpm = calculateWPM(input, this.round.sentence, elapsed);
      player.accuracy = calculateAccuracy(input, this.round.sentence);

      const inputWords = input.trim().split(/\s+/);
      const sentenceWords = this.round.sentence.trim().split(/\s+/);
      let correct = 0;
      for (let i = 0; i < inputWords.length; i++) {
        if (inputWords[i] === sentenceWords[i]) correct++;
      }
      player.wordsCompleted = correct;

      if (input.trim() === this.round.sentence.trim()) {
        player.finished = true;
        player.finishedAt = Date.now();
      }

      this.io.emit("player:updated", player);
    });

    socket.on("disconnect", () => {
      const playerId = this.socketToPlayer.get(socket.id);
      if (playerId) {
        this.players.delete(playerId);
        this.socketToPlayer.delete(socket.id);
        this.io.emit("player:left", playerId);
      }
    });
  }
}