# Arquitetura proposta

## Organização do repositório

```txt
apps/
  api/         # Fastify API (módulos: auth, workspaces, projects, tasks, team)
  web/         # Next.js App Router
packages/
  shared/      # Tipos e contratos compartilhados
supabase/
  migrations/  # SQL versionado do banco
docs/          # Pesquisa, arquitetura e decisões
```

## Princípios de robustez

- **Separação por domínio:** módulos independentes no backend.
- **Contrato único de tipos:** `@hub/shared` evita drift entre frontend/backend.
- **Banco com versionamento:** migrations SQL rastreáveis no Git.
- **Pronto para escala:** multi-tenant, RBAC e trilha de auditoria desde o início.
