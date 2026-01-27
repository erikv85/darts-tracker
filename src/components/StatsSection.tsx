
import { getAverageThrows } from "../utils/gameStats";
import type { Attempt } from "../utils/constants";

interface StatsSectionProps {
  data: Record<number, Attempt[]>;
}

const StatsSection: React.FC<StatsSectionProps> = ({ data }) => {
  const averageThrows = getAverageThrows(data);
  return (
    <section style={{
      background: "#fff",
      padding: 24,
      borderRadius: 8,
      minWidth: 300,
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      marginTop: 20,
      marginBottom: 20,
      maxWidth: 400,
    }}>
      <h2 style={{ marginTop: 0 }}>Game Statistics</h2>
      <div style={{ fontSize: 18, marginBottom: 16 }}>
        <strong>Average Throws per Target:</strong> {averageThrows}
      </div>
    </section>
  );
};

export default StatsSection;
