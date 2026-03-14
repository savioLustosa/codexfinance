# Pesquisa de mercado e posicionamento técnico

## Ferramentas analisadas

### Monday.com
- **Pontos fortes:** automações nativas, múltiplas visualizações (kanban, timeline, workload), UX madura para operações.
- **Pontos fracos:** custo cresce rápido por usuário e por recursos enterprise.

### ClickUp
- **Pontos fortes:** alto nível de customização, docs e tarefas no mesmo ecossistema.
- **Pontos fracos:** curva de aprendizado elevada para equipes menos técnicas.

### Asana
- **Pontos fortes:** simplicidade para gestão por objetivos e tracking de entregas.
- **Pontos fracos:** menos flexível para fluxos muito customizados.

### Linear + Jira (referência de engenharia)
- **Pontos fortes:** velocidade, confiabilidade e rastreabilidade robusta para times de produto/engenharia.
- **Pontos fracos:** Jira pode ficar complexo para áreas não técnicas.

## Recomendação de stack para SaaS robusto

### Frontend recomendado: **Next.js (App Router) + React + TypeScript**
- Excelente performance com Server Components e cache inteligente.
- Estrutura produtiva para produto SaaS (painéis, páginas públicas, auth e rotas protegidas).
- Ecossistema muito maduro para integração com Supabase.

### Backend recomendado: **Node.js + Fastify + TypeScript**
- Fastify oferece baixa latência e boa escalabilidade horizontal.
- Estrutura modular facilita domínio por contexto (auth, projetos, tarefas, equipes).
- Compatível com filas, eventos e arquitetura orientada a domínio no crescimento.

### Banco e Auth: **Supabase (PostgreSQL + Auth + RLS)**
- PostgreSQL gerenciado com recursos avançados.
- Autenticação pronta e segura com JWT.
- RLS reduz risco de vazamento multi-tenant.

## Decisão arquitetural adotada neste projeto
- **Frontend:** Next.js 15 + TypeScript.
- **Backend:** Fastify + TypeScript com API REST modular.
- **Shared contracts:** pacote `@cedex/shared` com schemas Zod.
- **Dados:** Supabase com migrations SQL e RLS habilitado por entidade.
