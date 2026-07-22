# Tarefa 3 — Adicionar component_bar_chart ao Dashboard

Adicione o gráfico de barras comparativas à tela **Dashboard** (`page_dashboard`), com
toggle local Mês/Semana e indicador de variação. O componente `BarChart` e o hook
`useDashboardComparison` **já existem** no repositório (entregues por outra tarefa) —
apenas consuma-os. **Não remova** os gráficos de pizza existentes do Dashboard.

## Fontes da verdade

- `wiki/pages/page_dashboard.md` — tela de análise com barra de filtros globais.
- `wiki/components/component_bar_chart.md` — toggle local, indicador de comparação.
- `wiki/design_system.md`.

## Escopo — arquivo a alterar: `src/features/dashboard/pages/dashboard-page.tsx`

Adicione o `BarChart`:

- **Barras comparativas entrada × saída por período**, recalculado pelos **filtros
  globais** da tela (o mesmo `filters` já usado por `useDashboardSummary`/`useDashboardCharts`).
- **Toggle local Mês/Semana**: estado próprio deste gráfico, que **não** afeta o resto da
  tela. Use `useState<ComparisonGroupBy>('month')` na página e passe `groupBy` +
  `onGroupByChange` ao `BarChart` (é a presença de `onGroupByChange` que faz o toggle
  aparecer).
- **Indicador de variação** do período mais recente vs. a média dos anteriores: passe
  `comparison={comparisonQuery.data?.comparison}` ao `BarChart`.

### Como fazer

- Importe `useDashboardComparison` de `../hooks/use-dashboard-comparison` (versão do
  Dashboard, que recebe `(filters, groupBy)`), `BarChart` de `@/components/bar-chart`, e
  o tipo `ComparisonGroupBy` de `@/types`.
- Estado local na página:
  `const [groupBy, setGroupBy] = useState<ComparisonGroupBy>('month')`.
- `const comparisonQuery = useDashboardComparison(filters, groupBy)` — junto das demais
  queries; ele reage aos filtros globais e ao `groupBy` local automaticamente (query key).
- Renderize o `BarChart` dentro do bloco `filtersReady`, logo após o `LineChart` (antes
  do grid de pizzas). Envolva com tratamento de erro no padrão da página: se
  `comparisonQuery.isError`, mostre `<BlockError>` com `refetch`; senão renderize
  `<BarChart data={comparisonQuery.data?.buckets ?? []} comparison={comparisonQuery.data?.comparison} isLoading={comparisonQuery.isPending} groupBy={groupBy} onGroupByChange={setGroupBy} title="Comparativo por período" />`.
- Mantenha os dois `PieChart` como estão. Não altere a lógica de filtros/summary.

## Critérios de aceite

- `npm run lint` e `npm run test` passam.
- Bar chart aparece no Dashboard com toggle Mês/Semana funcional (troca o `groupBy` e
  refaz só a query de comparison) e indicador de variação; pizzas preservadas.
- Toggle é local — não mexe nos filtros globais nem nos outros gráficos/cards.
- Sem hex hardcoded. Strings de UI em pt-BR.
- Commit: `feat: bar chart no Dashboard com toggle Mes/Semana (specs/dashboard-bar-chart.md)`.
