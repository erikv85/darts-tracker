import { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TARGETS } from "../utils/constants";
import { formatAttemptInput } from "../utils/attemptUtils";
import type { Attempt } from "../utils/constants";

function gameColor(index: number, total: number) {
  return `hsl(${(index * 360) / total}, 65%, 65%)`;
}

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
  const { chartData, gameKeys } = useMemo(() => {
    const games = getFinishedGames();
    const perTargetPerGame: Record<number, number[]> = {};
    const obPerGame: number[] = [];
    const ibPerGame: number[] = [];

    TARGETS.forEach((t) => (perTargetPerGame[t] = []));
    games.forEach((_, i) => {
      obPerGame[i] = 0;
      ibPerGame[i] = 0;
    });

    games.forEach((game, gIdx) => {
      TARGETS.forEach((target) => {
        const attempts = (game.data[target] || []).filter(
          (v: string) => v.trim() !== "",
        );
        perTargetPerGame[target] ??= [];
        perTargetPerGame[target][gIdx] = attempts.length;
      });

      Object.values(game.data).forEach((row) => {
        (row as Attempt[]).forEach((v) => {
          const formatted = formatAttemptInput(v);
          if (formatted === "OB") obPerGame[gIdx]++;
          else if (formatted === "IB") ibPerGame[gIdx]++;
        });
      });
    });

    const gameKeys = games.map((_, i) => `g${i}`);

    const chartData = [
      ...TARGETS.map((target) => {
        const entry: Record<string, number | string> = { target: String(target) };
        gameKeys.forEach((key, i) => {
          entry[key] = perTargetPerGame[target]?.[i] ?? 0;
        });
        return entry;
      }),
      ...(() => {
        const obEntry: Record<string, number | string> = { target: "OB" };
        const ibEntry: Record<string, number | string> = { target: "IB" };
        gameKeys.forEach((key, i) => {
          obEntry[key] = obPerGame[i] ?? 0;
          ibEntry[key] = ibPerGame[i] ?? 0;
        });
        return [obEntry, ibEntry];
      })(),
    ];

    return { chartData, gameKeys };
  }, []);

  const averageCurve = useMemo(() => {
    const games = getFinishedGames().slice().reverse();
    if (games.length === 0) return [];

    let cumulativeThrows = 0;

    return games.map((game, i) => {
      const gameThrows = Object.values(game.data).reduce(
        (sum, attempts) => sum + (attempts as Attempt[]).filter((v) => v.trim() !== "").length,
        0,
      );
      cumulativeThrows += gameThrows;
      return {
        game: i + 1,
        average: Math.round((cumulativeThrows / ((i + 1) * TARGETS.length)) * 100) / 100,
      };
    });
  }, []);

  const ranking = useMemo(() => {
    const games = getFinishedGames();
    const gameCount = games.length;
    if (gameCount === 0) return [];
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

    return TARGETS.map((target) => ({
      target,
      attempts: perTarget[target],
      avg: perTarget[target] / gameCount,
    }))
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
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const total = payload.reduce((sum, entry) => sum + (Number(entry.value) || 0), 0);
                  return (
                    <div
                      style={{
                        padding: "4px 8px",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        background: "#fff",
                        color: "#111",
                        fontSize: 12,
                      }}
                    >
                      {payload[0].payload.target}: {total}
                    </div>
                  );
                }}
              />
              {gameKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="stack"
                  fill={gameColor(i, gameKeys.length)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        {averageCurve.length > 0 && (
          <div style={{ width: "100%", height: 300, marginTop: 24 }}>
            <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Average Development</h2>
            <ResponsiveContainer>
              <LineChart
                data={averageCurve}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="game"
                  label={{
                    value: "Game",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis
                  label={{
                    value: "Avg throws / target",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#8884d8"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
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
                  <span>{r.attempts} throws / {r.avg.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
