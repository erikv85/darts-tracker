import React from "react";

interface ExportButtonProps {
  onClick: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => (
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
    Export
  </button>
);

export default ExportButton;
