
import { TARGETS } from "../utils/constants";
import { getAverageThrows } from "../utils/gameStats";
import { getAttemptTarget, isMissAttempt } from "../utils/attemptUtils";
import type { Attempt } from "../utils/constants";

interface StatsSectionProps {
  data: Record<number, Attempt[]>;
}

const StatsSection: React.FC<StatsSectionProps> = ({ data }) => {
  // Helper functions
  const attemptsPerTarget = TARGETS.map(target => (data[target] || []).filter(v => v.trim() !== "").length);
  const firstThrowAccuracy = TARGETS.reduce((acc, target) => {
    const row = data[target] || [];
    if (row[0] && row[0].trim() !== "") {
      if (getAttemptTarget(row[0]) === target) acc.hits++;
      else if (isMissAttempt(row[0])) acc.misses++;
      else acc.wrong++;
      acc.total++;
    }
    return acc;
  }, { hits: 0, misses: 0, wrong: 0, total: 0 });

  // Short-term accuracy: first 2 throws per target
  const shortTerm = TARGETS.reduce((acc, target) => {
    const row = (data[target] || []).slice(0, 2);
    row.forEach(val => {
      if (getAttemptTarget(val) === target) acc.hits++;
      else if (isMissAttempt(val)) acc.misses++;
      else if (val.trim() !== "") acc.wrong++;
    });
    acc.total += row.filter(v => v.trim() !== "").length;
    return acc;
  }, { hits: 0, misses: 0, wrong: 0, total: 0 });

  // Missed throws and wrong number patterns
  const missedThrows: { target: number, indices: number[] }[] = [];
  const wrongNumberThrows: { target: number, value: string, indices: number[] }[] = [];
  TARGETS.forEach(target => {
    const row = data[target] || [];
    const missIdx: number[] = [];
    const wrongIdx: number[] = [];
    row.forEach((val, i) => {
      if (isMissAttempt(val)) missIdx.push(i+1);
      else if (val.trim() !== "" && getAttemptTarget(val) !== target) wrongIdx.push(i+1);
    });
    if (missIdx.length > 0) missedThrows.push({ target, indices: missIdx });
    if (wrongIdx.length > 0) wrongNumberThrows.push({ target, value: row[wrongIdx[0]-1], indices: wrongIdx });
  });

  // Fatigue/pressure: compare first half vs second half
  const allAttempts = TARGETS.flatMap(target => (data[target] || []).filter(v => v.trim() !== ""));
  const half = Math.floor(allAttempts.length / 2);
  const firstHalf = allAttempts.slice(0, half);
  const secondHalf = allAttempts.slice(half);
  function hitCount(arr: string[]) {
    return arr.filter((v, i) => v.trim() === String(TARGETS[Math.floor(i/TARGETS.length)])).length;
  }
  const firstHalfHits = hitCount(firstHalf);
  const secondHalfHits = hitCount(secondHalf);

  // Board control, precision, strengths/weaknesses
  const boardControl = attemptsPerTarget.filter(n => n === 1).length / TARGETS.length;
  const precision = TARGETS.reduce((acc, target) => {
    const row = data[target] || [];
    const hits = row.filter(v => getAttemptTarget(v) === target).length;
    acc.total += (row.filter(v => v.trim() !== "").length);
    acc.hits += hits;
    return acc;
  }, { hits: 0, total: 0 });
  const precisionRate = precision.total ? (precision.hits / precision.total) : 0;

  // Strengths/weaknesses: targets with best/worst accuracy
  const perTargetAccuracy = TARGETS.map(target => {
    const row = data[target] || [];
    const attempts = row.filter(v => v.trim() !== "").length;
    const hits = row.filter(v => getAttemptTarget(v) === target).length;
    return { target, accuracy: attempts ? hits/attempts : 0, attempts };
  });
  const best = perTargetAccuracy.reduce((a, b) => (b.accuracy > a.accuracy ? b : a), perTargetAccuracy[0]);
  const worst = perTargetAccuracy.reduce((a, b) => (b.accuracy < a.accuracy ? b : a), perTargetAccuracy[0]);

  // Add average throws and remove summary
  const averageThrows = getAverageThrows(data);
  return (
    <section>
      <h2>Game Analysis</h2>
      <ul>
        <li><strong>Average Throws per Target:</strong> {averageThrows}</li>
        <li><strong>Attempts per Target:</strong> {attemptsPerTarget.join(", ")}</li>
        <li><strong>First-Throw Accuracy:</strong> {firstThrowAccuracy.hits} / {firstThrowAccuracy.total} ({firstThrowAccuracy.total ? ((firstThrowAccuracy.hits/firstThrowAccuracy.total)*100).toFixed(1) : 0}%)</li>
        <li><strong>Short-Term Accuracy (first 2 throws):</strong> {shortTerm.hits} / {shortTerm.total} ({shortTerm.total ? ((shortTerm.hits/shortTerm.total)*100).toFixed(1) : 0}%)</li>
        <li><strong>Missed Throws:</strong> {missedThrows.length ? missedThrows.map(m => `T${m.target}: [${m.indices.join(', ')}]`).join('; ') : 'None'}</li>
        <li><strong>Wrong Number Hits:</strong> {wrongNumberThrows.length ? wrongNumberThrows.map(w => `T${w.target}: [${w.indices.join(', ')}]`).join('; ') : 'None'}</li>
        <li><strong>Fatigue/Pressure Effect:</strong> First half hits: {firstHalfHits}, Second half hits: {secondHalfHits} {secondHalfHits < firstHalfHits ? '(Possible fatigue/pressure drop)' : ''}</li>
        <li><strong>Board Control (1st try):</strong> {(boardControl*100).toFixed(1)}%</li>
        <li><strong>Overall Precision:</strong> {(precisionRate*100).toFixed(1)}%</li>
        <li><strong>Strength:</strong> T{best.target} ({(best.accuracy*100).toFixed(1)}% over {best.attempts} attempts)</li>
        <li><strong>Weakness:</strong> T{worst.target} ({(worst.accuracy*100).toFixed(1)}% over {worst.attempts} attempts)</li>
      </ul>
    </section>
  );
};

export default StatsSection;
