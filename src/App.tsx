import { useState } from "react";

const TARGETS = Array.from({ length: 10 }, (_, i) => i + 1);

type Attempt = string;

export default function App() {
  const [gameStart, setGameStart] = useState<Date | null>(null);
  const [data, setData] = useState<Record<number, Attempt[]>>({});

  const startNewGame = () => {
    setGameStart(new Date());
    const fresh: Record<number, Attempt[]> = {};
    TARGETS.forEach((t) => (fresh[t] = []));
    setData(fresh);
  };

  const updateAttempt = (
    target: number,
    index: number,
    raw: string
  ) => {
    let value = raw.trim();

    if (value.toLowerCase() === "x") value = "X";

    if (value !== "X") {
      const num = Number(value);
      if (!Number.isInteger(num) || num < 1 || num > 10) return;
    }

    setData((prev) => {
      const copy = { ...prev };
      const row = [...copy[target]];
      row[index] = value;
      copy[target] = row;
      return copy;
    });
  };

  const addAttempt = (target: number) => {
    setData((prev) => ({
      ...prev,
      [target]: [...prev[target], ""],
    }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">🎯 Dart Practice Tracker</h1>

      <button
        onClick={startNewGame}
        className="px-4 py-2 bg-black text-white rounded mb-4"
      >
        New Game
      </button>

      {gameStart && (
        <p className="text-sm text-gray-600 mb-6">
          Game started: {gameStart.toLocaleString()}
        </p>
      )}

      {gameStart && (
        <div className="space-y-4">
          {TARGETS.map((target) => (
            <div key={target} className="flex items-center gap-3">
              <div className="w-16 font-semibold">Target {target}</div>

              <div className="flex gap-2 flex-wrap">
                {data[target]?.map((val, i) => (
                  <input
                    key={i}
                    value={val}
                    onChange={(e) =>
                      updateAttempt(target, i, e.target.value)
                    }
                    onBlur={(e) =>
                      updateAttempt(target, i, e.target.value)
                    }
                    className="w-12 text-center border rounded"
                    maxLength={2}
                  />
                ))}

                <button
                  onClick={() => addAttempt(target)}
                  className="px-2 border rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
