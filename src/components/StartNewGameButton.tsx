import React from "react";

interface StartNewGameButtonProps {
  onClick: () => void;
}

const StartNewGameButton: React.FC<StartNewGameButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 12px",
      border: "1px solid #ccc",
      borderRadius: 4,
      background: "#f0f0f0",
      cursor: "pointer",
      marginBottom: 12,
      color: "#111",
      fontWeight: 600,
    }}
  >
    New Game
  </button>
);

export default StartNewGameButton;
