import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TARGETS } from "../utils/constants";
import { formatAttemptInput } from "../utils/attemptUtils";
import type { Attempt } from "../utils/constants";

const FINISHED_GAMES_STORAGE_KEY = "friendly-round-the-clock-finished";

interface FinishedGame {
  gameId: "friendly-round-the-clock";
  id: string;
  isFinished: true;
  gameStart: string | null;
  finishedAt: string;
  data: Record<number, Attempt[]>;
  showStats: boolean;
}

function getFinishedGames(): FinishedGame[] {
  const raw = window.localStorage.getItem(FINISHED_GAMES_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as FinishedGame[]) : [];
}

interface GameHistoryProps {
  onBack: () => void;
}

export default function GameHistory({ onBack }: GameHistoryProps) {
  const chartData = useMemo(() => {
    const games = getFinishedGames();
    const perTarget: Record<number, number> = {};
    let obCount = 0;
    let ibCount = 0;
    TARGETS.forEach((t) => (perTarget[t] = 0));

    games.forEach((game) => {
      TARGETS.forEach((target) => {
        const attempts = (game.data[target] || []).filter(
          (v: string) => v.trim() !== "",
        );
        perTarget[target] += attempts.length;
      });

      Object.values(game.data).forEach((row) => {
        (row as Attempt[]).forEach((v) => {
          const formatted = formatAttemptInput(v);
          if (formatted === "OB") obCount++;
          else if (formatted === "IB") ibCount++;
        });
      });
    });

    return [
      ...TARGETS.map((target) => ({
        target: String(target),
        attempts: perTarget[target],
      })),
      { target: "OB", attempts: obCount },
      { target: "IB", attempts: ibCount },
    ];
  }, []);

  const ranking = useMemo(() => {
    const games = getFinishedGames();
    const perTarget: Record<number, number> = {};
    TARGETS.forEach((t) => (perTarget[t] = 0));

    games.forEach((game) => {
      TARGETS.forEach((target) => {
        const attempts = (game.data[target] || []).filter(
          (v: string) => v.trim() !== "",
        );
        perTarget[target] += attempts.length;
      });
    });

    return TARGETS.map((target) => ({ target, attempts: perTarget[target] }))
      .sort((a, b) => {
        const diff = a.attempts - b.attempts;
        if (diff !== 0) return diff;
        return a.target - b.target;
      });
  }, []);

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
          Back
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
          Game History
        </h1>
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="target"
                label={{
                  value: "Target",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{
                  value: "Attempts",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar dataKey="attempts" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {ranking.length > 0 && (
          <section
            style={{
              marginTop: 24,
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Target Ranking</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {ranking.map((r, i) => (
                <div
                  key={r.target}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "4px 0",
                    borderBottom: i < ranking.length - 1 ? "1px solid #e5e5e5" : "none",
                    color: "#333",
                  }}
                >
                  <span>
                    {r.target}
                  </span>
                  <span>{r.attempts} throws</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
