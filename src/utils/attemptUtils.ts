// Utility for validating and formatting attempt input
export function formatAttemptInput(raw: string): string {
  let value = raw.trim();
  if (value.toLowerCase() === "x") value = "X";
  return value;
}

export function isValidAttempt(value: string): boolean {
  if (value === "X" || value === "") return true;
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 10;
}

// Should add a new input after this value?
export function shouldAddAttempt(value: string): boolean {
  if (value === "") return false;
  if (value.toLowerCase() === "x") return true;
  if (value === "1") return false; // allow typing '10'
  if (value === "10") return true;
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 10;
}

// Should auto-advance to next row?
export function shouldAdvanceRow(value: string, target: number): boolean {
  if (value === String(target) && (value !== "1" || value === "10")) return true;
  return false;
}
