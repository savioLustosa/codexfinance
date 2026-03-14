# Benchmark de mercado (SaaS de gestão de projetos e equipe)

## Referências analisadas

- **monday.com:** UX visual forte, automações, integrações e múltiplas visualizações (board, timeline, workload).
- **Asana:** gestão de portfólio, metas e workflows maduros para operações cross-team.
- **ClickUp:** alta customização, docs embutidos, metas e dashboards avançados.
- **Jira:** excelente rastreabilidade e governança para times de produto/engenharia.

## Requisitos para competir em nível SaaS

1. **Arquitetura multi-tenant** por workspace/organização.
2. **RBAC avançado** (owner/admin/manager/member).
3. **Módulos centrais**: projetos, tasks, comentários, time, convites, auditoria.
4. **Escalabilidade horizontal** no backend com API stateless.
5. **Observabilidade** (healthcheck, logs estruturados, métricas).
6. **Frontend rápido** com SSR/streaming e boa experiência em grandes volumes.

## Stack recomendada para este projeto

### Frontend: **Next.js (React + TypeScript)**
- Excelente performance com rendering híbrido (SSR/SSG/ISR).
- Ecossistema robusto para dashboards e produto SaaS.
- Escala bem com design system e modularização por feature.

### Backend: **Fastify + TypeScript**
- Alta performance por request (ótimo para APIs B2B).
- Tipagem forte e validação via Zod.
- Estrutura simples para modularização e evolução para microserviços.

### Banco: **Supabase Postgres**
- Postgres gerenciado, com backup e tooling pronto.
- Suporte a SQL avançado, índices, triggers e extensões.
- Fácil evolução para RLS e realtime conforme maturidade do produto.
