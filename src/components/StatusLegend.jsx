const items = [
  ["success", "Successful"],
  ["running", "Running"],
  ["failure", "Failed"],
  ["blocked", "Blocked"],
  ["pending", "Pending"]
];

export default function StatusLegend() {
  return (
    <div className="legend">
      {items.map(([status, label]) => (
        <span className="legend-item" key={status}>
          <i className={`legend-dot ${status}`} />
          {label}
        </span>
      ))}
    </div>
  );
}
