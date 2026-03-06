# Finance SaaS

Sistema SaaS de gestão financeira pessoal com arquitetura MVC, API REST, autenticação JWT e frontend em HTML/CSS/JS com Chart.js.

## Stack
- **Frontend:** HTML, CSS, Vanilla JS, Chart.js
- **Backend:** Node.js + Express
- **Banco:** PostgreSQL (Supabase)
- **Auth:** JWT com hash de senha (bcrypt)

## Estrutura

```txt
backend/
  controllers/
  routes/
  models/
  middleware/
frontend/
  pages/
  components/
  styles/
  scripts/
```

## Funcionalidades
- Cadastro, login, logout e recuperação de senha
- CRUD de transações (receita/despesa)
- Categorias padrão + personalizadas
- Dashboard com saldo, receitas/despesas mensais e gráficos
- Metas financeiras com progresso e aporte
- Exportação CSV e PDF (impressão)
- UI responsiva mobile-first com modo dark
- PWA instalável (manifest + service worker)
- Segurança com validação de dados + rate limit + JWT + hash de senha

## Configuração
1. Instale dependências:
   ```bash
   npm install
   ```
2. Crie um `.env`:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB
   JWT_SECRET=super-secret
   NODE_ENV=development
   ```
3. Rode o schema no PostgreSQL/Supabase:
   ```bash
   psql "$DATABASE_URL" -f backend/schema.sql
   ```
4. Execute:
   ```bash
   npm start
   ```
5. Abra `http://localhost:3000`.
