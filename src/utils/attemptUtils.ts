// Utility for validating and formatting attempt input
export function formatAttemptInput(raw: string): string {
  let value = raw.trim();
  if (value.toLowerCase() === "x") value = "X";
  return value;
}

export function isValidAttempt(value: string): boolean {
  if (value === "X" || value === "") return true;
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 20;
}

// Should add a new input after this value?
export function shouldAddAttempt(value: string): boolean {
  if (value === "") return false;
  if (value.toLowerCase() === "x") return true;
  if (value === "1" || value === "2") return false; // allow typing 10-19 and 20
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 20;
}

// Should auto-advance to next row?
export function shouldAdvanceRow(value: string, target: number): boolean {
  if (value !== String(target)) return false;
  return value !== "1" && value !== "2";
}
