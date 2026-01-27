import { useState, useRef, useEffect } from "react";

const TARGETS = Array.from({ length: 10 }, (_, i) => i + 1);

type Attempt = string;

export default function App() {
  const [gameStart, setGameStart] = useState<Date | null>(null);
  const [data, setData] = useState<Record<number, Attempt[]>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [focusedInputs, setFocusedInputs] = useState<Record<string, boolean>>({});

  const startNewGame = () => {
    setGameStart(new Date());
    const fresh: Record<number, Attempt[]> = {};
    TARGETS.forEach((t) => (fresh[t] = [""])); // Always start with one input per row
    setData(fresh);
    setFocusKey("1-0"); // Focus on the first input
  };

  const updateAttempt = (
    target: number,
    index: number,
    raw: string
  ) => {
    let value = raw.trim();

    if (value.toLowerCase() === "x") value = "X";

    if (value !== "X" && value !== "") {
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
    setData((prev) => {
      const nextIndex = prev[target]?.length ?? 0;
      setFocusKey(`${target}-${nextIndex}`);
      return {
        ...prev,
        [target]: [...prev[target], ""],
      };
    });
  };

  useEffect(() => {
    if (focusKey && inputRefs.current[focusKey]) {
      inputRefs.current[focusKey]?.focus();
      setFocusKey(null);
    }
  }, [focusKey]);

  return (
    <div style={{ minHeight: "100vh", width: "100vw", background: "#ffffff", padding: "24px", fontFamily: "sans-serif", color: "#111", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>🎯 Dart Practice Tracker</h1>

        <button
          onClick={startNewGame}
          style={{
            padding: "6px 12px",
            border: "1px solid #ccc",
            borderRadius: 4,
            background: "#f0f0f0", // Changed background color to light gray for better visibility
            cursor: "pointer",
            marginBottom: 12,
            color: "#111", // Ensure text color contrasts well
            fontWeight: 600, // Make text bold for better readability
          }}
        >
          New Game
        </button>

        {gameStart && (
          <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>
            Game started: {gameStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}

        {gameStart && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TARGETS.map((target) => (
              <div key={target} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 16, textAlign: "right", fontWeight: 600 }}>{target}</div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {data[target]?.map((val, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input
                        ref={(el) => {
                          inputRefs.current[`${target}-${i}`] = el;
                        }}
                        value={val}
                        onChange={(e) => {
                          const value = e.target.value.trim();
                          updateAttempt(target, i, value);
                          // If value matches the target, and not (target 1 and value '1'), move to next row
                          if (
                            value === String(target) &&
                            !(target === 1 && value === "1") &&
                            i === data[target].length - 1
                          ) {
                            const nextTarget = target + 1;
                            if (nextTarget <= TARGETS.length) {
                              // Ensure the next row exists and has at least one input
                              if (!data[nextTarget] || data[nextTarget].length === 0) {
                                setData((prev) => ({
                                  ...prev,
                                  [nextTarget]: [""]
                                }));
                              }
                              setFocusKey(`${nextTarget}-0`);
                            }
                          } else if (
                            value !== "" &&
                            (value.toLowerCase() === "x" || (Number(value) >= 1 && Number(value) <= 10)) &&
                            i === data[target].length - 1 &&
                            (value !== "1" || value === "10")
                          ) {
                            addAttempt(target);
                          }
                        }}
                        onFocus={() => {
                          setFocusedInputs((prev) => ({ ...prev, [`${target}-${i}`]: true }));
                        }}
                        onBlur={(e) => {
                          updateAttempt(target, i, e.target.value);
                          setFocusedInputs((prev) => ({ ...prev, [`${target}-${i}`]: false }));
                          if (i === data[target].length - 1) {
                            setData((prev) => {
                              const updated = { ...prev };
                              updated[target] = updated[target].filter((val, idx, arr) => idx < arr.length - 1 || val.trim() !== "");
                              return updated;
                            });
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Tab" && i === data[target].length - 1) {
                            e.preventDefault(); // Prevent default tab behavior
                            addAttempt(target); // Add a new input
                          }
                        }}
                        maxLength={2}
                        style={{
                          width: "2.5ch",
                          height: 22,
                          textAlign: "center",
                          border: "1px solid #ccc",
                          borderRadius: 3,
                          fontSize: 12,
                          background: "#f9f9f9", // Updated background to a light gray
                          color: "#111", // Ensure text color contrasts well
                        }}
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => addAttempt(target)}
                    style={{
                      width: "2.5ch",
                      height: 22,
                      border: "1px solid #ccc",
                      borderRadius: 3,
                      background: "#f0f0f0", // Match the 'New Game' button color
                      cursor: "pointer",
                      fontSize: 12,
                      lineHeight: "20px",
                    }}
                  >
                    +
                  </button>

                  {data[target]?.length > 0 &&
                    data[target].some((val) => val.trim() !== "") &&
                    !Object.values(focusedInputs).some((isFocused) => isFocused) &&
                    data[target].filter((val) => val.trim() !== "").slice(-1)[0] !== String(target) && (
                      <span style={{ color: "red", fontSize: 16, fontWeight: "bold" }}>!</span>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}

        {gameStart && (
          <button
            onClick={() => {
              const content = TARGETS.map((target) => data[target]?.join(" ")).join("\n");
              const blob = new Blob([content], { type: "text/plain" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "dart-practice.txt";
              link.click();
            }}
            style={{
              marginTop: 24,
              padding: "6px 12px",
              border: "1px solid #ccc",
              borderRadius: 4,
              background: "#f0f0f0",
              cursor: "pointer",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
