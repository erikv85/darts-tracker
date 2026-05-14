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
    const totals: Record<number, number> = {};
    TARGETS.forEach((t) => (totals[t] = 0));

    games.forEach((game) => {
      TARGETS.forEach((target) => {
        const attempts = (game.data[target] || []).filter(
          (v: string) => v.trim() !== "",
        );
        totals[target] += attempts.length;
      });
    });

    return TARGETS.map((target) => ({
      target: String(target),
      attempts: totals[target],
    }));
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
      </div>
    </div>
  );
}
