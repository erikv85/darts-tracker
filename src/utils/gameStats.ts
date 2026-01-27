import { TARGETS } from "./constants";
import type { Attempt } from "./constants";

export function getAverageThrows(data: Record<number, Attempt[]>): string {
  const targetsWithAttempts = TARGETS.filter(t => (data[t] && data[t].length > 0));
  if (targetsWithAttempts.length === 0) return "0";
  const totalThrows = targetsWithAttempts.reduce((sum, t) => sum + (data[t]?.filter((v: string) => v.trim() !== "").length || 0), 0);
  return (totalThrows / targetsWithAttempts.length).toFixed(2);
}
