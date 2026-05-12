import React from "react";
import { getAttemptTarget } from "../utils/attemptUtils";

type Attempt = string;

interface AttemptsRowProps {
  target: number;
  attempts: Attempt[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  focusedInputs: Record<string, boolean>;
  setFocusedInputs: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setFocusKey: (key: string) => void;
  data: Record<number, Attempt[]>;
}

const AttemptsRow: React.FC<AttemptsRowProps> = ({
  target,
  attempts,
  onChange,
  onAdd,
  inputRefs,
  focusedInputs,
  setFocusedInputs,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 16, textAlign: "right", fontWeight: 600 }}>{target}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {attempts.map((val, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              ref={(el) => {
                inputRefs.current[`${target}-${i}`] = el;
              }}
              value={val}
              onChange={(e) => onChange(i, e.target.value)}
              onFocus={() => {
                setFocusedInputs((prev) => ({ ...prev, [`${target}-${i}`]: true }));
              }}
              onBlur={(e) => {
                onChange(i, e.target.value);
                setFocusedInputs((prev) => ({ ...prev, [`${target}-${i}`]: false }));
                if (i === attempts.length - 1) {
                  onChange(i, e.target.value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab" && i === attempts.length - 1) {
                  e.preventDefault();
                  onAdd();
                }
              }}
              maxLength={3}
              style={{
                width: "4ch",
                height: 22,
                textAlign: "center",
                border: "1px solid #ccc",
                borderRadius: 3,
                fontSize: 12,
                background: "#f9f9f9",
                color: "#111",
              }}
            />
          </div>
        ))}
        <button
          onClick={onAdd}
          style={{
            width: "2.5ch",
            height: 22,
            border: "1px solid #ccc",
            borderRadius: 3,
            background: "#f0f0f0",
            cursor: "pointer",
            fontSize: 12,
            lineHeight: "20px",
          }}
        >
          +
        </button>
        {(() => {
          // Show exclamation if: row has at least one non-empty, no input in row is focused, and last non-empty !== target
          const nonEmpty = attempts.map(v => v.trim()).filter(v => v !== "");
          const last = nonEmpty.length > 0 ? nonEmpty[nonEmpty.length - 1] : null;
          const anyFocused = attempts.some((_, i) => focusedInputs[`${target}-${i}`]);
          return (
            nonEmpty.length > 0 &&
            !anyFocused &&
            getAttemptTarget(last ?? "") !== target
          ) ? (
            <span style={{ color: "red", fontSize: 16, fontWeight: "bold" }}>!</span>
          ) : null;
        })()}
      </div>
    </div>
  );
};

export default AttemptsRow;
