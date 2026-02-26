"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GameState, Player, PlayerStats } from "@/lib/types";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [myStats, setMyStats] = useState<PlayerStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socket = io({
      path: "/api/socketio",
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("game:state", (state: GameState) => {
      setGameState(state);
    });

    socket.on("game:tick", ({ timeLeftMs }) => {
      setTimeLeft(timeLeftMs);
    });

    socket.on("game:newRound", ({ sentence, roundNumber, startTime, endTime }) => {
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "playing",
          round: {
            sentence,
            roundNumber,
            startTime,
            endTime,
            timeLeftMs: endTime - Date.now(),
          },
          players: prev.players.map((p) => ({
            ...p,
            currentInput: "",
            wpm: 0,
            accuracy: 1,
            wordsCompleted: 0,
            finished: false,
          })),
        };
      });
    });

    socket.on("player:updated", (updatedPlayer: Player) => {
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map((p) =>
            p.id === updatedPlayer.id ? updatedPlayer : p
          ),
        };
      });
    });

    socket.on("player:left", (playerId: string) => {
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.filter((p) => p.id !== playerId),
        };
      });
    });

    socket.on("player:stats", (stats: PlayerStats | null) => {
      setMyStats(stats);
    });

    socket.on("error", (msg: string) => setError(msg));

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGame = (name: string) => {
    socketRef.current?.emit("player:join", { name });
  };

  const sendProgress = (input: string) => {
    socketRef.current?.emit("player:progress", { input });
  };

  return {
    connected,
    gameState,
    timeLeft,
    myStats,
    error,
    joinGame,
    sendProgress,
  };
}