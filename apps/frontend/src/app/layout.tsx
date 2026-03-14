import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Cedex WorkSuite',
  description: 'SaaS de gestão de projetos e equipes com Supabase'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
