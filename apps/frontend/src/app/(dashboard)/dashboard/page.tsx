import { KpiCard } from '@/components/kpi-card';

const cards = [
  { title: 'Projetos ativos', value: '24', subtitle: '+14% vs mês passado' },
  { title: 'Tarefas em risco', value: '12', subtitle: 'Prioridade crítica nas próximas 48h' },
  { title: 'Produtividade da equipe', value: '87%', subtitle: 'Média de entrega no sprint atual' },
  { title: 'SLA cumprido', value: '96%', subtitle: 'Média trimestral' }
];

export default function DashboardPage() {
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold text-white">Visão executiva</h1>
      <p className="mt-2 text-slate-400">Acompanhe indicadores estratégicos de operação e execução.</p>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <KpiCard key={card.title} {...card} />
        ))}
      </section>
    </main>
  );
}
