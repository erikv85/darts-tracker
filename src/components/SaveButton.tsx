import React from "react";

interface SaveButtonProps {
  onClick: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
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
);

export default SaveButton;
