import React, { useRef } from "react";

interface ImportButtonProps {
  onImport: (games: unknown[]) => void;
}

const ImportButton: React.FC<ImportButtonProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const games = Array.isArray(parsed) ? parsed : [parsed];
        const valid = games.filter(
          (g: unknown) =>
            g &&
            typeof g === "object" &&
            (g as Record<string, unknown>).isFinished === true &&
            (g as Record<string, unknown>).finishedAt &&
            (g as Record<string, unknown>).data &&
            typeof (g as Record<string, unknown>).data === "object",
        );
        if (valid.length > 0) {
          onImport(valid);
        }
      } catch {
        // ignore invalid files
      }
    };
    reader.readAsText(file);

    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
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
        Import
      </button>
    </>
  );
};

export default ImportButton;
