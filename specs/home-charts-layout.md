# Tarefa 2 — Novo layout de gráficos da tela Início

Reorganize a seção de gráficos da tela **Início** (`page_home`). O componente
`BarChart` e o hook `useDashboardComparison` **já existem** no repositório (foram
entregues por outra tarefa) — apenas consuma-os.

## Fontes da verdade

- `wiki/pages/page_home.md` — a tela Início (fixa, mês atual, sem filtros, sem botão de adicionar).
- `wiki/components/component_bar_chart.md` e `wiki/components/component_line_chart.md`.
- `wiki/design_system.md`.

## Escopo — arquivo a alterar: `src/features/home/components/charts-section.tsx`

Layout novo:

- **`LineChart`** — entradas e saídas por dia do mês atual. Ocupa **2/3** da largura, à esquerda.
- **`BarChart`** — comparativo entrada × saída dos **últimos 6 meses**. Ocupa **1/3**, à direita.
- **Remova os dois `PieChart`** (entradas/saídas por categoria) desta tela. Remova o import do `PieChart`.

### Como fazer

- Grid responsivo: em telas grandes, `lg:grid-cols-3` com o `LineChart` em `lg:col-span-2`
  e o `BarChart` em `lg:col-span-1`; empilhado (uma coluna) no mobile.
- O `LineChart` continua vindo de `useDashboardCharts()` (hook da Início, sem args) —
  use só `data.line`; os arrays de categoria não são mais usados aqui.
- O `BarChart` vem do **novo hook da Início** `useDashboardComparison()` (sem args,
  fixo em últimos 6 meses / mensal). Importe de `../hooks/use-dashboard-comparison`.
- Passe ao `BarChart`: `data={comparison?.buckets ?? []}`,
  `comparison={comparison?.comparison}`, `isLoading`, e um `title` adequado
  (ex.: "Últimos 6 meses"). **NÃO** passe `onGroupByChange` — na Início não há toggle
  (o toggle só existe no Dashboard).
- Trate erro do novo hook como o `useDashboardCharts` já é tratado: `BlockError` com
  `refetch`. As duas queries (charts e comparison) podem ter estados de erro/loading
  independentes — cada gráfico cuida do seu.
- Preserve o comportamento e a estrutura de `home-page.tsx` (não precisa alterá-lo; ele
  só renderiza `<ChartsSection />`).

## Critérios de aceite

- `npm run lint` e `npm run test` passam.
- Pizzas removidas da Início; Line 2/3 + Bar 1/3 lado a lado no desktop, empilhados no mobile.
- Sem hex hardcoded. Strings de UI em pt-BR.
- Commit: `feat: novo layout de graficos da Inicio (specs/home-charts-layout.md)`.
