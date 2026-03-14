interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
}

export function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <div className="card">
      <p className="small">{label}</p>
      <h3>{value}</h3>
      <span className="badge">{trend}</span>
    </div>
  );
}
