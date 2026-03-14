export function KpiCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">{value}</h3>
      <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
    </article>
  );
}
