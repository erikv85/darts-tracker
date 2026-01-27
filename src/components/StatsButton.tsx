import React from "react";

interface StatsButtonProps {
  onClick: () => void;
}

const StatsButton: React.FC<StatsButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 12px",
      border: "1px solid #ccc",
      borderRadius: 4,
      background: "#f0f0f0",
      cursor: "pointer",
      color: "#111",
      fontWeight: 600,
    }}
  >
    Show Game Stats
  </button>
);

export default StatsButton;
