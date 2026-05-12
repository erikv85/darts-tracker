import { useState } from "react";
import type { CSSProperties } from "react";
import DartPracticeGame from "./components/DartPracticeGame";

type Screen = "menu" | "dart-practice";

const appShellStyle: CSSProperties = {
  minHeight: "100vh",
  width: "100vw",
  background: "#ffffff",
  padding: "24px",
  fontFamily: "sans-serif",
  color: "#111",
  boxSizing: "border-box",
};

const contentStyle: CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
};

const menuCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 12,
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 12,
  background: "#fafafa",
};

const gameButtonStyle: CSSProperties = {
  padding: "10px 16px",
  border: "1px solid #ccc",
  borderRadius: 8,
  background: "#f0f0f0",
  color: "#111",
  fontWeight: 600,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("menu");

  if (screen === "dart-practice") {
    return <DartPracticeGame onBack={() => setScreen("menu")} />;
  }

  return (
    <div style={appShellStyle}>
      <div style={contentStyle}>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>All Games</h1>
        <p style={{ marginTop: 0, marginBottom: 24, color: "#555" }}>
          Choose a game to start tracking.
        </p>
        <section style={menuCardStyle}>
          <div>
            <h2 style={{ fontSize: 18, margin: "0 0 6px" }}>Friendly round the clock</h2>
            <p style={{ margin: 0, color: "#555" }}>
              Hit 1 through 20 in order, with doubles and triples counting as singles.
            </p>
          </div>
          <button onClick={() => setScreen("dart-practice")} style={gameButtonStyle}>
            Open Game
          </button>
        </section>
      </div>
    </div>
  );
}
