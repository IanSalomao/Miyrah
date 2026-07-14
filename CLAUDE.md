# CLAUDE.md

Este arquivo orienta o Claude Code (claude.ai/code) ao trabalhar neste repositório.

## Sobre o projeto

O **Church Flow (ChF)** é um sistema de gestão financeira para igrejas — controle de entradas e saídas de forma eficiente, clara e auditável. Ele resolve deliberadamente **um único problema** (controle financeiro), ao contrário dos ChMS genéricos que tentam fazer tudo. Cada conta do sistema é uma igreja (multi-tenant por conta).

Este repositório contém **apenas o front-end**. O back-end (NestJS + PostgreSQL) viverá em repositório separado e **ainda não existe** — durante o desenvolvimento, a API é mockada com MSW seguindo o contrato já documentado na wiki.

## Fonte da verdade: `wiki/`

`wiki/` é um symlink para a especificação do projeto no vault Obsidian (`~/Documentos/I'AM/PESSOAL/CHURCH_FLOW`). **É somente leitura neste repositório** — mudanças de spec acontecem no vault, nunca daqui.

| Documento                        | Conteúdo                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------- |
| `wiki/Church_Flow.md`            | Spec geral: visão, requisitos, telas e regras de negócio                     |
| `wiki/design_system.md`          | Tokens visuais: cores, tipografia, layout, elemento de assinatura            |
| `wiki/API_docs.md`               | Padrões globais da API: envelope de resposta, auth, paginação, erros, casing |
| `wiki/api/*.md`                  | Contrato endpoint a endpoint, por domínio (auth, members, transactions…)     |
| `wiki/pages/page_*.md`           | Handoff de design de cada página: componentes, ações e endpoints usados      |
| `wiki/components/component_*.md` | Spec de cada componente reutilizado entre páginas                            |
| `wiki/database/*.md`             | Modelo de dados (referência de domínio — o front não acessa o banco)         |

Regras:

- **Antes de implementar ou alterar qualquer página/componente**, leia o `page_*.md` / `component_*.md` correspondente e o `design_system.md`. Não reinvente o que já está especificado.
- O contrato da API é `wiki/api/*` — os tipos TypeScript derivam dele, nunca o contrário.
- Se uma tarefa pedida divergir da wiki (campo novo, fluxo diferente, endpoint inexistente), **pergunte antes** — nunca resolva a divergência silenciosamente, nem editando código, nem assumindo que a wiki está desatualizada.

## Stack

| Peça               | Escolha                                            | Papel                                                                                        |
| ------------------ | -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Linguagem          | TypeScript (strict)                                | Sem `any`; tipos da API centralizados                                                        |
| Build              | Vite                                               | SPA — sem SSR                                                                                |
| UI                 | React 19 + React Router v7                         | Roteamento declarativo em modo SPA                                                           |
| Estilo             | Tailwind CSS + shadcn/ui                           | Tema via CSS variables (tokens do design system)                                             |
| Estado de servidor | TanStack Query                                     | Todo dado da API passa por query/mutation; estado local com hooks/Context (sem store global) |
| Formulários        | React Hook Form + Zod                              | Integrados via `<Form>` do shadcn/ui; schemas Zod reutilizáveis                              |
| Gráficos           | Recharts                                           | Via componentes de chart do shadcn/ui                                                        |
| HTTP               | `fetch` nativo + wrapper (`src/lib/api-client.ts`) | Sem axios/ky                                                                                 |
| Mock de API        | MSW (Mock Service Worker)                          | Espelha `wiki/api/*` na camada de rede                                                       |
| Testes             | Vitest + Testing Library                           | Sem E2E no MVP                                                                               |
| Qualidade          | ESLint + Prettier                                  |                                                                                              |
| Pacotes            | npm                                                | Não usar pnpm/yarn/bun                                                                       |

## Comandos

```bash
npm run dev      # servidor de desenvolvimento (MSW ativo)
npm run build    # tsc -b && vite build
npm run test     # vitest
npm run lint     # eslint
npm run format   # prettier
```

> O app ainda não foi scaffoldado. Ao criá-lo: template Vite `react-ts`, depois Tailwind, `shadcn init` e as dependências da tabela acima — mantendo os scripts com estes nomes.

## Estrutura de pastas

```
src/
├─ app/            # rotas, providers (QueryClient, auth), layouts
├─ components/     # compartilhados entre features
│  ├─ ui/          # base gerada pelo shadcn CLI
│  ├─ side-bar/    # ← wiki/components/component_side_bar.md
│  ├─ data-table/  # ← wiki/components/component_data_table.md
│  └─ ...          # um diretório por component_*.md
├─ features/       # um diretório por página/domínio
│  ├─ auth/        # login, register, forgot-password
│  ├─ home/        # ← wiki/pages/page_home.md (tela Início)
│  ├─ dashboard/
│  ├─ transactions/
│  │  ├─ components/
│  │  ├─ hooks/    # queries e mutations TanStack Query da feature
│  │  └─ schemas.ts
│  ├─ members/
│  ├─ ministries/
│  ├─ categories/
│  ├─ reports/
│  └─ settings/
├─ lib/            # api-client.ts, format.ts (moeda/data), utils
└─ mocks/          # handlers MSW, um arquivo por domínio de wiki/api/
```

Mapeamento wiki → código: `page_transactions.md` → `src/features/transactions/` + rota `/transactions`; `component_side_bar.md` → `src/components/side-bar/`. Os nomes em inglês da wiki **são** os nomes reais do projeto.

Rotas: `/login`, `/register`, `/forgot-password`, `/reset-password` (públicas, com `component_auth_layout`); `/` (Início), `/dashboard`, `/transactions`, `/members`, `/ministries`, `/categories`, `/reports`, `/settings` (protegidas, com sidebar).

`src/components/ui/` é código gerado pelo shadcn CLI — ajustes pontuais são permitidos, mas prefira estilizar via tokens/CSS variables a editar os componentes.

## Regras de desenvolvimento

### Idioma

- **Strings de UI**: sempre em pt-BR, com ortografia correta (acentos incluídos).
- **Código** (variáveis, funções, componentes, arquivos, rotas): sempre em inglês.
- **Comentários**: em português.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`…) com descrição em português.

### Design system (`wiki/design_system.md`)

- Os tokens `Papel` `#EEF1E7`, `Tinta` `#202B22`, `Contas` `#2B5C4F`, `Entradas` `#1E7A46`, `Saídas` `#A6342A` e `Linha` `#C9D0C1` viram CSS variables integradas ao tema Tailwind/shadcn (`Papel`→background, `Tinta`→foreground, `Contas`→primary, `Linha`→border, `Entradas`/`Saídas`→cores semânticas próprias). **Proibido hex hardcoded em componente** — sempre via token.
- Fontes self-hosted via `@fontsource`: **Bitter** (títulos/display), **Inter** (corpo), **IBM Plex Mono** com tabular figures (todo valor monetário e numérico).
- Todo valor monetário: fonte mono, alinhado à direita, na cor semântica com sinal `+`/`−` explícito — a cor nunca é a única pista.
- Tabelas com régua fina em `Linha` (sem zebra striping); cards com borda fina, sem sombra.
- A cor de categoria é **dado do usuário** (aparece só como swatch/dot ao lado do nome) — nunca substitui `Entradas`/`Saídas` no valor.

### Consumo de API (`wiki/API_docs.md`)

- Toda chamada passa pelo `src/lib/api-client.ts`: injeta `Authorization: Bearer`, faz unwrap do envelope `{ success, data }` e converte `{ success: false, error }` em `ApiError` tipado com `code`, `message` e `details`.
- Trate erros pelo `error.code` (estável, em inglês); a `message` da API já vem em pt-BR e pode ser exibida ao usuário.
- Todo dado da API via TanStack Query — **sem `fetch` solto em componente**. Query keys padronizadas por recurso (ex.: `['transactions', filters]`); mutations invalidam as queries afetadas.
- Paginação: `page`/`limit` (padrão 20, máx 100). Campos em `camelCase`.
- Datas chegam em ISO 8601 UTC; exibição em pt-BR. Moeda via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. Formatação centralizada em `src/lib/format.ts`.

### Regras de negócio no front

- **Transação**: valor armazenado com sinal (positivo = entrada, negativo = saída). No formulário o usuário digita valor positivo e escolhe o Tipo; o dropdown de categoria é filtrado pelo tipo, e categoria de tipo diferente é erro (`422 CATEGORY_TYPE_MISMATCH`).
- **Categoria**: o tipo é imutável após a criação (`CATEGORY_TYPE_IMMUTABLE`) — o campo fica desabilitado na edição.
- **Card Saldo**: sempre "até a data" — nunca afetado pelo filtro de período.
- **Gráfico de linha**: granularidade diária para períodos de até 1 mês; agregação mensal automática acima disso.
- **Filtro por ministério** (Dashboard): oculta transações sem ministério vinculado.
- **Exclusões**: sempre soft delete via `DELETE` + modal de confirmação. Excluir conta exige senha atual + frase de confirmação, e é irreversível.
- **Membro excluído** referenciado em transação antiga: continua exibindo o nome, com indicação visual de "excluído".
- **Avatar de membro**: sempre gerado das iniciais do nome — não existe upload de foto.
- **Estados vazios**: ícone + "Nenhum [item] encontrado" + botão de ação principal quando aplicável (todas as telas).
- **Início** é fixa (mês atual, sem filtros, sem botão de adicionar); **Dashboard** tem a barra de filtros globais. Lançamento de transação acontece só na tela Transações.

### Autenticação

- JWT Bearer simples, sem refresh token. Expiração de 24h, ou 30 dias com `rememberMe: true` (checkbox "Lembrar-me").
- Armazenamento do token: `localStorage` se "Lembrar-me" marcado, senão `sessionStorage`.
- Não existe endpoint de logout — logout é descartar o token no cliente.
- Resposta `401` em qualquer chamada → limpar sessão e redirecionar para `/login`.
- Rotas protegidas por guard de autenticação. O `churchId` vem sempre do token — nunca em URL ou corpo de requisição.

### Mocks (MSW)

- Um arquivo de handlers por domínio, espelhando 1:1 os endpoints de `wiki/api/*` — mesmo envelope, mesmos códigos de erro, mesma paginação.
- Seed de dados realista em pt-BR (nomes de membros, ministérios e categorias típicos de igreja brasileira).
- MSW ativo apenas em dev e testes; `VITE_API_URL` definirá a API real quando o back existir.

### Testes

- Prioridades: schemas Zod (validações como CNPJ e senha), `lib/format.ts` (moeda/data), lógica de sinal e filtros, componentes compartilhados (`data-table`, `metric-card`).
- Sem testes E2E no MVP.

## Fluxo de trabalho

- `npm run lint` e `npm run test` devem passar antes de qualquer commit.
- Decisão não coberta pela wiki nem por este arquivo (arquitetura, nome, formato de dado, fluxo de UX): **pergunte antes de assumir**. Se houver mais de uma interpretação possível, apresente as opções.
