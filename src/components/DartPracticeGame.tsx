import { useEffect, useRef, useState } from "react";
import AttemptsRow from "./AttemptsRow";
import SaveButton from "./SaveButton";
import StartNewGameButton from "./StartNewGameButton";
import StatsButton from "./StatsButton";
import StatsSection from "./StatsSection";
import {
  formatAttemptInput,
  isValidAttempt,
  shouldAddAttempt,
  shouldAdvanceRow,
} from "../utils/attemptUtils";
import { TARGETS } from "../utils/constants";
import type { Attempt } from "../utils/constants";

interface DartPracticeGameProps {
  onBack: () => void;
}

export default function DartPracticeGame({ onBack }: DartPracticeGameProps) {
  const [gameStart, setGameStart] = useState<Date | null>(null);
  const [data, setData] = useState<Record<number, Attempt[]>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});
  const [showStats, setShowStats] = useState(false);

  const startNewGame = () => {
    setGameStart(new Date());
    const fresh: Record<number, Attempt[]> = {};
    TARGETS.forEach((t) => (fresh[t] = [""]));
    setData(fresh);
    setFocusKey("1-0");
    setShowStats(false);
  };

  const updateAttempt = (target: number, index: number, raw: string) => {
    const value = formatAttemptInput(raw);
    if (!isValidAttempt(value)) return;

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
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Dart Practice Tracker</h1>
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
            <SaveButton
              onClick={() => {
                const content = TARGETS.map((target) => data[target]?.join(" ")).join("\n");
                const blob = new Blob([content], { type: "text/plain" });
                const pad = (n: number) => n.toString().padStart(2, "0");
                const d = gameStart ? new Date(gameStart) : new Date();
                const timestamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
                const filename = `dart-practice-${timestamp}.txt`;
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
              }}
            />
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
