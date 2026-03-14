const projects = [
  { name: 'Plataforma Enterprise', owner: 'Ana Souza', status: 'active', due: '2026-01-12' },
  { name: 'Portal de parceiros', owner: 'Rafael Costa', status: 'planning', due: '2025-12-03' },
  { name: 'App Mobile B2B', owner: 'Marina Lima', status: 'on_hold', due: '2026-02-20' }
];

export default function ProjectsPage() {
  return (
    <section>
      <h1>Projetos</h1>
      <p className="small">Projetos multi-times com prazos, progresso e saúde operacional.</p>
      <div className="grid" style={{ marginTop: '1rem' }}>
        {projects.map((project) => (
          <article className="card" key={project.name}>
            <h3>{project.name}</h3>
            <p className="small">Owner: {project.owner}</p>
            <p className="small">Status: {project.status}</p>
            <p className="small">Entrega: {project.due}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
