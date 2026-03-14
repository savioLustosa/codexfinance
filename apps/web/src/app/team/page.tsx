const members = [
  { name: 'Ana Souza', role: 'Head of Product', allocation: '85%' },
  { name: 'Rafael Costa', role: 'Engineering Manager', allocation: '78%' },
  { name: 'Marina Lima', role: 'UX Lead', allocation: '63%' },
  { name: 'Bruno Dias', role: 'Data Analyst', allocation: '70%' }
];

export default function TeamPage() {
  return (
    <section>
      <h1>Equipe</h1>
      <p className="small">Capacidade, alocação e performance por squads.</p>
      <div className="grid" style={{ marginTop: '1rem' }}>
        {members.map((member) => (
          <div className="card" key={member.name}>
            <h3>{member.name}</h3>
            <p className="small">{member.role}</p>
            <p className="small">Alocação: {member.allocation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
