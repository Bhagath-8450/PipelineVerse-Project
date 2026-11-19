export default function StatCard({ label, value, accent, hint }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className={accent ? `stat-value ${accent}` : "stat-value"}>{value}</strong>
      <span className="stat-hint">{hint}</span>
    </div>
  );
}
