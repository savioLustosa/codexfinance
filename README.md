# Cedex WorkSuite

SaaS de gestão de projetos e equipes inspirado em Monday.com/ClickUp, com foco em velocidade, estabilidade e escalabilidade.

## Arquitetura

- `apps/frontend`: Next.js 15 (App Router) para dashboard, área pública e UX de produto.
- `apps/backend`: API Fastify modular (auth, teams, projects, tasks, users).
- `packages/shared`: contratos compartilhados (`zod`) entre front e back.
- `supabase/migrations`: esquema SQL + políticas RLS para multi-tenant seguro.
- `docs/market-analysis.md`: pesquisa comparativa e justificativa de stack.

## Stack recomendada (adotada)

- **Frontend:** Next.js + React + TypeScript
- **Backend:** Fastify + TypeScript
- **Banco/Auth:** Supabase PostgreSQL + Auth + RLS

## Rodando localmente

1. Copie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Inicie o backend:
   ```bash
   npm run dev:backend
   ```
4. Em outro terminal, inicie o frontend:
   ```bash
   npm run dev:frontend
   ```

## Endpoints principais (backend)

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/users/me`
- `GET|POST /api/teams`
- `GET|POST /api/projects`
- `GET|POST /api/tasks`

## Boas práticas aplicadas

- Organização por domínio e separação de responsabilidades.
- Tipagem forte em toda a aplicação.
- Contratos compartilhados com validação (`zod`).
- Base pronta para CI/CD e escalabilidade horizontal.

## Versionamento

- Versão atual inicial para testes: `0.2.0`.
- Validação pré-release local: `npm run release:check`.
- Pipeline de CI no GitHub Actions: `.github/workflows/ci.yml`.
- Guia de publicação/tags: `docs/github-publish.md`.
