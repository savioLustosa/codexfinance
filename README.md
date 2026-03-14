# ProjectHub SaaS

Plataforma SaaS para gestão de projetos e equipes (inspirada em monday.com, Asana e ClickUp), com arquitetura moderna e foco em performance, estabilidade e escalabilidade.

## Stack escolhida

- **Frontend:** Next.js 15 + React + TypeScript
- **Backend:** Fastify + TypeScript + Zod
- **Banco:** Supabase Postgres
- **Monorepo:** NPM workspaces

## Estrutura

```txt
apps/
  api/      # API REST
  web/      # Frontend web
packages/
  shared/   # Tipos e contratos comuns
supabase/
  migrations/
docs/
```

## Funcionalidades base implementadas

- Autenticação por JWT
- Gestão de workspaces (multi-tenant)
- Gestão de projetos
- Gestão de tasks com atualização de status
- Gestão de equipe (listagem e convite)
- Dashboard e páginas operacionais no frontend
- Healthcheck para observabilidade

## Banco de dados (Supabase)

1. Crie um projeto no Supabase e copie a `DATABASE_URL`.
2. Execute a migration:
   ```bash
   psql "$DATABASE_URL" -f supabase/migrations/0001_init_project_hub.sql
   ```

## Rodando localmente

1. Instale dependências:
   ```bash
   cp .env.example .env
   ```
2. Configure ambiente do backend:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
3. Execute:
   ```bash
   npm run dev
   ```
4. Web: `http://localhost:3000`
5. API: `http://localhost:4000/api/health`

## Documentação adicional

- `docs/market-analysis.md`
- `docs/architecture.md`
