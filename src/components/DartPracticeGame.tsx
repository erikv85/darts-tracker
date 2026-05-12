import { useEffect, useRef, useState } from "react";
import AttemptsRow from "./AttemptsRow";
import FinishButton from "./FinishButton";
import SaveButton from "./SaveButton";
import StartNewGameButton from "./StartNewGameButton";
import StatsButton from "./StatsButton";
import StatsSection from "./StatsSection";
import {
  formatAttemptInput,
  isAllowedAttemptInput,
  shouldAddAttempt,
  shouldAdvanceRow,
} from "../utils/attemptUtils";
import { TARGETS } from "../utils/constants";
import type { Attempt } from "../utils/constants";

interface DartPracticeGameProps {
  onBack: () => void;
}

const LEGACY_STORAGE_KEY = "friendly-round-the-clock-save";
const ACTIVE_GAME_STORAGE_KEY = "friendly-round-the-clock-active";
const FINISHED_GAMES_STORAGE_KEY = "friendly-round-the-clock-finished";

interface SavedGameBase {
  gameId: "friendly-round-the-clock";
  id: string;
  gameStart: string | null;
  data: Record<number, Attempt[]>;
  showStats: boolean;
}

interface ActiveGame extends SavedGameBase {
  isFinished: false;
  finishedAt: null;
}

interface FinishedGame extends SavedGameBase {
  isFinished: true;
  finishedAt: string;
}

interface LegacySavedGame {
  gameId?: "friendly-round-the-clock";
  id?: string;
  isFinished?: boolean;
  gameStart: string | null;
  finishedAt?: string | null;
  data: Record<number, Attempt[]>;
  showStats: boolean;
}

function createGameId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `game-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function sameFinishedGame(a: FinishedGame, b: FinishedGame) {
  return (
    a.gameStart === b.gameStart &&
    a.finishedAt === b.finishedAt &&
    JSON.stringify(a.data) === JSON.stringify(b.data)
  );
}

function getFinishedGames(): FinishedGame[] {
  const rawFinishedGames = window.localStorage.getItem(FINISHED_GAMES_STORAGE_KEY);
  return rawFinishedGames ? (JSON.parse(rawFinishedGames) as FinishedGame[]) : [];
}

function getTotalThrows(data: Record<number, Attempt[]>) {
  return Object.values(data).reduce(
    (sum, attempts) => sum + attempts.filter((attempt) => attempt.trim() !== "").length,
    0,
  );
}

export default function DartPracticeGame({ onBack }: DartPracticeGameProps) {
  const [gameStart, setGameStart] = useState<Date | null>(null);
  const [data, setData] = useState<Record<number, Attempt[]>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});
  const [showStats, setShowStats] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [finishedGames, setFinishedGames] = useState<FinishedGame[]>([]);
  const [finishedGamesCount, setFinishedGamesCount] = useState(0);
  const hasLoadedSavedGame = useRef(false);

  useEffect(() => {
    try {
      const rawLegacySavedGame = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (rawLegacySavedGame) {
        const legacySavedGame = JSON.parse(rawLegacySavedGame) as LegacySavedGame;

        if (legacySavedGame.isFinished) {
          const finishedGames = getFinishedGames();

          const migratedFinishedGame: FinishedGame = {
            gameId: "friendly-round-the-clock",
            id: legacySavedGame.id ?? createGameId(),
            isFinished: true,
            gameStart: legacySavedGame.gameStart,
            finishedAt: legacySavedGame.finishedAt ?? new Date().toISOString(),
            data: legacySavedGame.data ?? {},
            showStats: legacySavedGame.showStats ?? false,
          };

          if (!finishedGames.some((game) => sameFinishedGame(game, migratedFinishedGame))) {
            window.localStorage.setItem(
              FINISHED_GAMES_STORAGE_KEY,
              JSON.stringify([migratedFinishedGame, ...finishedGames]),
            );
          }
        } else {
          const migratedActiveGame: ActiveGame = {
            gameId: "friendly-round-the-clock",
            id: legacySavedGame.id ?? createGameId(),
            isFinished: false,
            gameStart: legacySavedGame.gameStart,
            finishedAt: null,
            data: legacySavedGame.data ?? {},
            showStats: legacySavedGame.showStats ?? false,
          };

          window.localStorage.setItem(
            ACTIVE_GAME_STORAGE_KEY,
            JSON.stringify(migratedActiveGame),
          );
        }

        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      }

      const rawActiveGame = window.localStorage.getItem(ACTIVE_GAME_STORAGE_KEY);
      if (rawActiveGame) {
        const activeGame = JSON.parse(rawActiveGame) as ActiveGame;
        if (!activeGame.isFinished) {
          setGameStart(activeGame.gameStart ? new Date(activeGame.gameStart) : null);
          setData(activeGame.data ?? {});
          setShowStats(activeGame.showStats ?? false);
          setSaveMessage("Loaded saved game from this browser.");
        }
      }

      const storedFinishedGames = getFinishedGames();
      setFinishedGames(storedFinishedGames);
      setFinishedGamesCount(storedFinishedGames.length);
    } catch {
      setSaveMessage("Could not load saved game.");
    } finally {
      hasLoadedSavedGame.current = true;
    }
  }, []);

  const persistActiveGame = (savedGame: ActiveGame) => {
    window.localStorage.setItem(ACTIVE_GAME_STORAGE_KEY, JSON.stringify(savedGame));
  };

  const appendFinishedGame = (savedGame: FinishedGame) => {
    const finishedGames = getFinishedGames();
    const updatedFinishedGames = [savedGame, ...finishedGames];
    window.localStorage.setItem(
      FINISHED_GAMES_STORAGE_KEY,
      JSON.stringify(updatedFinishedGames),
    );
    setFinishedGames(updatedFinishedGames);
    setFinishedGamesCount(updatedFinishedGames.length);
  };

  useEffect(() => {
    if (!hasLoadedSavedGame.current || !gameStart) return;

    const rawActiveGame = window.localStorage.getItem(ACTIVE_GAME_STORAGE_KEY);
    const existingGameId = rawActiveGame ? (JSON.parse(rawActiveGame) as ActiveGame).id ?? createGameId() : createGameId();

    persistActiveGame({
      gameId: "friendly-round-the-clock",
      id: existingGameId,
      isFinished: false,
      gameStart: gameStart.toISOString(),
      finishedAt: null,
      data,
      showStats,
    });
  }, [gameStart, data, showStats]);

  const startNewGame = () => {
    setGameStart(new Date());
    const fresh: Record<number, Attempt[]> = {};
    TARGETS.forEach((t) => (fresh[t] = [""]));
    setData(fresh);
    setFocusKey("1-0");
    setShowStats(false);
    setSaveMessage(null);
  };

  const saveGame = () => {
    if (!gameStart) return;

    const rawActiveGame = window.localStorage.getItem(ACTIVE_GAME_STORAGE_KEY);
    const existingGameId = rawActiveGame ? (JSON.parse(rawActiveGame) as ActiveGame).id ?? createGameId() : createGameId();

    persistActiveGame({
      gameId: "friendly-round-the-clock",
      id: existingGameId,
      isFinished: false,
      gameStart: gameStart.toISOString(),
      finishedAt: null,
      data,
      showStats,
    });
    setSaveMessage("Saved to this browser.");
  };

  const finishGame = () => {
    if (!gameStart) return;

    const rawActiveGame = window.localStorage.getItem(ACTIVE_GAME_STORAGE_KEY);
    const existingGameId = rawActiveGame ? (JSON.parse(rawActiveGame) as ActiveGame).id ?? createGameId() : createGameId();

    appendFinishedGame({
      gameId: "friendly-round-the-clock",
      id: existingGameId,
      isFinished: true,
      gameStart: gameStart.toISOString(),
      finishedAt: new Date().toISOString(),
      data,
      showStats,
    });
    window.localStorage.removeItem(ACTIVE_GAME_STORAGE_KEY);

    setGameStart(null);
    setData({});
    setShowStats(false);
    setFocusedInputs({});
    setFocusKey(null);
    setSaveMessage("Game finished.");
  };

  const updateAttempt = (target: number, index: number, raw: string) => {
    if (!isAllowedAttemptInput(raw)) return;

    const value = formatAttemptInput(raw);

    setData((prev) => {
      const copy = { ...prev };
      const row = [...copy[target]];
      row[index] = value;
      copy[target] = row;
      return copy;
    });
  };

  const addAttempt = (target: number) => {
    setData((prev) => {
      const currentRow = prev[target] || [];
      if (currentRow.length === 0 || currentRow[currentRow.length - 1].trim() === "") {
        return prev;
      }

      const nextIndex = currentRow.length;
      setFocusKey(`${target}-${nextIndex}`);

      return {
        ...prev,
        [target]: [...currentRow, ""],
      };
    });
  };

  useEffect(() => {
    if (focusKey && inputRefs.current[focusKey]) {
      inputRefs.current[focusKey]?.focus();
      setTimeout(() => setFocusKey(null), 0);
    }
  }, [focusKey]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#ffffff",
        padding: "24px",
        fontFamily: "sans-serif",
        color: "#111",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: 16,
            padding: "6px 12px",
            border: "1px solid #ccc",
            borderRadius: 4,
            background: "#f7f7f7",
            color: "#111",
            fontWeight: 600,
          }}
        >
          Back to All Games
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Friendly round the clock</h1>
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa",
            color: "#333",
          }}
        >
          <strong>Rules:</strong> Hit 1-20 in order. Doubles and triples count as singles. Arrows that fall off still count.
        </div>
        {saveMessage && (
          <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>
            <div>{saveMessage}</div>
            <div>{finishedGamesCount} finished game{finishedGamesCount === 1 ? "" : "s"} saved in this browser.</div>
          </div>
        )}
        {finishedGamesCount > 0 && (
          <section
            style={{
              marginBottom: 24,
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Latest Finished Games</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {finishedGames.slice(0, 10).map((game) => {
                const finishedAt = new Date(game.finishedAt);
                return (
                  <div
                    key={game.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      paddingBottom: 8,
                      borderBottom: "1px solid #e5e5e5",
                      color: "#333",
                    }}
                  >
                    <span>
                      {finishedAt.toLocaleDateString()} {finishedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span>{getTotalThrows(game.data)} throws</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        <StartNewGameButton onClick={startNewGame} />
        {gameStart && (
          <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>
            Game started: {gameStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
        {gameStart && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TARGETS.map((target) => (
              <AttemptsRow
                key={target}
                target={target}
                attempts={data[target] || []}
                onChange={(i, value) => {
                  updateAttempt(target, i, value);
                  if (
                    shouldAdvanceRow(value.trim(), target) &&
                    i === (data[target]?.length ?? 1) - 1
                  ) {
                    const nextTarget = target + 1;
                    if (nextTarget <= TARGETS.length) {
                      if (!data[nextTarget] || data[nextTarget].length === 0) {
                        setData((prev) => ({ ...prev, [nextTarget]: [""] }));
                      }
                      setFocusKey(`${nextTarget}-0`);
                    }
                  } else if (
                    shouldAddAttempt(value.trim()) &&
                    i === (data[target]?.length ?? 1) - 1
                  ) {
                    addAttempt(target);
                  }
                }}
                onAdd={() => addAttempt(target)}
                inputRefs={inputRefs}
                focusedInputs={focusedInputs}
                setFocusedInputs={setFocusedInputs}
                setFocusKey={setFocusKey}
                data={data}
              />
            ))}
          </div>
        )}
        {gameStart && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 24 }}>
            <SaveButton onClick={saveGame} />
            <FinishButton onClick={finishGame} />
            <StatsButton
              onClick={() => {
                setShowStats(true);
              }}
            />
          </div>
        )}
        {showStats && <StatsSection data={data} />}
      </div>
    </div>
  );
}
