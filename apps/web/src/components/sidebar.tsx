import Link from 'next/link';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/projects', label: 'Projetos' },
  { href: '/tasks', label: 'Tasks / Kanban' },
  { href: '/team', label: 'Equipe' },
  { href: '/settings', label: 'Configurações' }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>ProjectHub SaaS</h2>
      <p className="small">Gestão de projetos nível enterprise</p>
      <nav style={{ marginTop: '1rem' }}>
        {links.map((link) => (
          <Link className="nav-link" key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
