// Utility for validating and formatting attempt input
export function formatAttemptInput(raw: string): string {
  let value = raw.trim();
  if (value.toLowerCase() === "x") return "X";

  const normalized = value.toUpperCase();
  if (/^[TDM]$/.test(normalized)) return normalized;

  const prefixMatch = normalized.match(/^([TDM])(\d{1,2})$/);
  if (prefixMatch) {
    const [, letter, digits] = prefixMatch;
    if (isValidAttemptNumber(digits)) return `${letter}${Number(digits)}`;
  }

  const suffixMatch = normalized.match(/^(\d{1,2})([TDM])$/);
  if (suffixMatch) {
    const [, digits, letter] = suffixMatch;
    if (isValidAttemptNumber(digits)) return `${letter}${Number(digits)}`;
  }

  if (/^\d{1,2}$/.test(normalized) && isValidAttemptNumber(normalized)) {
    return `${Number(normalized)}`;
  }

  return value;
}

function isValidAttemptNumber(value: string): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num >= 1 && num <= 20;
}

export function getAttemptTarget(value: string): number | null {
  const normalized = formatAttemptInput(value);
  if (normalized === "" || normalized === "X") return null;

  const letteredMatch = normalized.match(/^([TDM])(\d{1,2})$/);
  if (letteredMatch) {
    if (letteredMatch[1] === "M") return null;
    return Number(letteredMatch[2]);
  }

  return isValidAttemptNumber(normalized) ? Number(normalized) : null;
}

export function isMissAttempt(value: string): boolean {
  const normalized = formatAttemptInput(value);
  return normalized === "X" || /^M\d{1,2}$/.test(normalized);
}

function isCompleteMissAttempt(value: string): boolean {
  const normalized = formatAttemptInput(value);
  if (normalized === "X") return true;
  if (!/^M\d{1,2}$/.test(normalized)) return false;

  const marginTarget = Number(normalized.slice(1));
  return marginTarget >= 3;
}

export function isAllowedAttemptInput(value: string): boolean {
  const normalized = value.trim().toUpperCase();

  if (normalized === "" || normalized === "X") return true;
  if (/^[TDM]$/.test(normalized)) return true;
  if (/^[1-9]$/.test(normalized)) return true;
  if (/^([TDM])(\d)$/.test(normalized) || /^(\d)([TDM])$/.test(normalized)) return true;

  if (/^\d{2}$/.test(normalized)) return isValidAttemptNumber(normalized);

  const prefixMatch = normalized.match(/^([TDM])(\d{2})$/);
  if (prefixMatch) return isValidAttemptNumber(prefixMatch[2]);

  const suffixMatch = normalized.match(/^(\d{2})([TDM])$/);
  if (suffixMatch) return isValidAttemptNumber(suffixMatch[1]);

  return false;
}

export function isValidAttempt(value: string): boolean {
  if (value === "") return true;
  return formatAttemptInput(value) === "X" || getAttemptTarget(value) !== null;
}

// Should add a new input after this value?
export function shouldAddAttempt(value: string): boolean {
  if (value === "") return false;
  if (isCompleteMissAttempt(value)) return true;

  const normalized = value.trim().toUpperCase();
  if (/^[TDM]$/.test(normalized)) return false;
  if (/^\d{1,2}$/.test(normalized)) return false;
  if (/^[TDM]\d$/.test(normalized)) return false;
  if (/^\d[TDM]$/.test(normalized)) return getAttemptTarget(normalized) !== null || isMissAttempt(normalized);
  if (/^[TDM]\d{2}$/.test(normalized) || /^\d{2}[TDM]$/.test(normalized)) {
    return getAttemptTarget(normalized) !== null || isMissAttempt(normalized);
  }

  return getAttemptTarget(normalized) !== null || isMissAttempt(normalized);
}

// Should auto-advance to next row?
export function shouldAdvanceRow(value: string, target: number): boolean {
  const attemptTarget = getAttemptTarget(value);
  if (attemptTarget !== target) return false;

  const normalized = value.trim().toUpperCase();
  if (/^[TDM]$/.test(normalized)) return false;
  if (/^\d{1,2}$/.test(normalized)) return false;
  if (/^[TDM]\d$/.test(normalized)) {
    return attemptTarget >= 10;
  }
  if (/^\d[TDM]$/.test(normalized)) return true;

  return true;
}
