export default function SettingsPage() {
  return (
    <section>
      <h1>Configurações SaaS</h1>
      <div className="card" style={{ marginTop: '1rem' }}>
        <p>✔ Multi-tenant por workspace</p>
        <p>✔ RBAC (owner, admin, manager, member)</p>
        <p>✔ Auditoria e logs de atividade</p>
        <p>✔ Integração com Supabase Postgres</p>
      </div>
    </section>
  );
}
