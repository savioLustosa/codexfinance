import Link from 'next/link';

const features = [
  'Kanban e timeline em tempo real',
  'Gestão de squads, permissões e capacidade',
  'Relatórios de velocidade e SLA por projeto',
  'Automação de fluxos com gatilhos'
];

export default function MarketingPage() {
  return (
    <main className="container py-16">
      <header className="rounded-2xl border border-slate-800 bg-slate-950 p-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Project Management SaaS</p>
        <h1 className="mt-4 text-5xl font-bold text-white">Cedex WorkSuite</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Plataforma inspirada em Monday.com, Asana e ClickUp para gestão completa de projetos, equipes e operações.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/dashboard" className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950">
            Entrar no Dashboard
          </Link>
        </div>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {features.map((item) => (
          <article key={item} className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-300">
            {item}
          </article>
        ))}
      </section>
    </main>
  );
}
