import { MetricCard } from '../components/metric-card';
import { metrics } from '../lib/mock-data';

export default function DashboardPage() {
  return (
    <section>
      <h1>Dashboard SaaS de Gestão</h1>
      <p className="small">Visão executiva para operação, capacidade e produtividade da equipe.</p>
      <div className="grid" style={{ marginTop: '1rem' }}>
        {metrics.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
