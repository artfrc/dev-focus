# DevFocus

Sistema pessoal de organizacao de atividades ("Jira pessoal com gamificacao"): areas, prioridades,
cards com prazo e marcacao de "essencial", ofensiva (streak) diaria estilo Duolingo, historico em
calendario e notificacoes por e-mail (lembrete diario + alerta de prazo).

## Telas

| | |
|---|---|
| **Login** ![Login](telas/login.png) | **Painel Principal** ![Painel Principal](telas/painel-inicial.png) |
| **Meus Cards** ![Meus Cards](telas/cards.png) | **Áreas** ![Áreas](telas/areas.png) |
| **Histórico** ![Histórico](telas/historico.png) | **Configurações** ![Configurações](telas/configuracoes.png) |
| **E-mail de lembrete diário** ![E-mail de lembrete diário](telas/email.png) | |

## Arquitetura

```
/services
  /cards-service         -> CRUD de areas, prioridades e cards        (porta 3001)
  /streak-service         -> ofensiva, historico, cron de meia-noite   (porta 3002)
  /notification-service   -> e-mails (lembrete diario + alerta prazo)  (porta 3003)
  /api-gateway             -> ponto unico de entrada para o frontend    (porta 3000)
/frontend                  -> Vue 3 + Vite + Tailwind                   (porta 5173)
/supabase/migrations       -> schema SQL + RLS + seeds
```

O frontend fala **apenas** com o `api-gateway` (`/api/...`) para dados de areas/prioridades/cards/
streak, e diretamente com o Supabase Auth (login/cadastro) e a tabela `frases_motivacionais`
(conteudo publico de leitura). Cada microsservico usa o JWT do usuario (repassado pelo gateway)
para consultar o Supabase respeitando as policies de RLS — nenhum servico usa `service_role` a
pedido direto do frontend.

`streak-service` e `notification-service` tambem expoem rotas internas (`/internal/*` e
`/notify/*`) protegidas por um header `x-internal-key`, usadas pelos jobs agendados (cron) e nunca
roteadas pelo gateway.

## 1. Configurar o Supabase

1. Crie/abra um projeto em https://supabase.com.
2. Rode o SQL de `supabase/migrations/20260101000000_init_schema.sql` no SQL Editor do projeto
   (ou via `supabase db push` se estiver usando a CLI com o projeto linkado). Isso cria as tabelas,
   habilita RLS, cadastra as policies, popula frases motivacionais globais e cria um trigger que
   gera automaticamente as areas/prioridades padrao (Trabalho, Faculdade, Dia a dia + 4
   prioridades) e a linha de `streak` inicial para cada novo usuario.
3. Em **Authentication > Providers**, mantenha **Email** habilitado (login por e-mail/senha).
4. Colete em **Settings > API**:
   - `Project URL`
   - `anon public key`
   - `service_role key` (**segredo** — usar apenas em `streak-service` e `notification-service`)

## 2. Variaveis de ambiente

Copie cada `.env.example` para `.env` e preencha:

| Arquivo | Uso |
|---|---|
| `services/cards-service/.env` | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| `services/streak-service/.env` | idem + `SUPABASE_SERVICE_ROLE_KEY` + `INTERNAL_API_KEY` |
| `services/notification-service/.env` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `INTERNAL_API_KEY`, SMTP |
| `services/api-gateway/.env` | URLs dos servicos + origem do frontend |
| `frontend/.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_GATEWAY_URL` |

`INTERNAL_API_KEY` deve ser o **mesmo valor** em `streak-service` e `notification-service` (e em
qualquer chamador externo dos endpoints internos, se aplicavel).

## 3. Instalar e rodar

Este repo usa npm workspaces — um `npm install` na raiz instala todos os servicos e o frontend.

```bash
npm install
npm run dev
```

O `npm run dev` sobe os 5 processos de uma vez (gateway, cards, streak, notify, frontend) num
terminal so, com logs coloridos e prefixados por servico (`[gateway]`, `[cards]`, etc.). `Ctrl+C`
derruba tudo junto.

> Se voce rodar `npm install` de novo enquanto o `npm run dev` ja estiver de pe, o `--watch` dos
> servicos pode detectar a mudanca no `node_modules` e tentar reiniciar em cima da porta ainda
> ocupada (`EADDRINUSE` passageiro nos logs). Pare o `npm run dev` antes de instalar algo novo.

Se preferir cada servico no seu proprio terminal (logs isolados, restart individual sem derrubar
os outros):

```bash
npm run dev:gateway        # http://localhost:3000
npm run dev:cards          # http://localhost:3001
npm run dev:streak         # http://localhost:3002
npm run dev:notifications  # http://localhost:3003
npm run dev:frontend       # http://localhost:5173
```

## 4. Jobs agendados (cron)

- **streak-service**: todo dia as `00:05` (fuso `TZ` do `.env`) recalcula a ofensiva do dia
  anterior para todos os usuarios (`recalcularOfensivaTodos`), verificando se os cards essenciais
  com prazo naquele dia foram todos concluidos. O endpoint interno `POST /internal/recalcular`
  (protegido por `x-internal-key`) tambem pode ser chamado manualmente para backfill/depuracao,
  aceitando `{ data?: 'YYYY-MM-DD', user_id?: 'uuid' }`.
- **notification-service**: `CRON_LEMBRETE_DIARIO` (padrao `0 20 * * *`) dispara o lembrete diario
  de planejamento; `CRON_VERIFICAR_PRAZOS` (padrao `0 8 * * *`) envia o alerta para cards pendentes
  a 7 dias ou menos do prazo. Os mesmos disparos existem como endpoints internos
  (`POST /notify/lembrete-diario`, `POST /notify/verificar-prazos`) para execucao sob demanda.
- Sem SMTP configurado, o `notification-service` apenas loga o e-mail simulado no console — util
  para desenvolvimento local sem depender de credenciais reais.

## 5. Regra da ofensiva (streak)

Para uma data `D`: pega todos os cards `essencial = true` com `prazo = D`. Se nenhum estiver
`pendente` (inclui o caso de nao existir nenhum essencial nesse dia), a meta foi batida. O
`sequencia_atual` e recalculado contando dias consecutivos com meta batida terminando em `D`
(olhando `streak_historico`), e `maior_sequencia` guarda o maior valor ja atingido — essa
abordagem e idempotente, entao rodar o job mais de uma vez para o mesmo dia nao corrompe o
contador.

## 6. Autenticacao no frontend

- `src/lib/supabase.js` cria o client do Supabase (email/senha).
- `src/router/index.js` tem um guard global: rotas sem `meta.public` exigem sessao ativa e
  redirecionam para `/login` caso contrario.
- `src/lib/api.js` injeta automaticamente o `access_token` da sessao atual como
  `Authorization: Bearer <jwt>` em toda chamada ao `api-gateway`.
