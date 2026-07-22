# Tarefa 1 — component_bar_chart + fundação de dados (`/v1/dashboard/comparison`)

Você é o **dono do contrato** que outras duas telas (Início e Dashboard) vão consumir
depois. Entregue o componente `BarChart` **e** toda a camada de dados do endpoint
`GET /v1/dashboard/comparison`. Não altere `home-page.tsx` nem `dashboard-page.tsx` —
essas telas são de outras tarefas.

## Fontes da verdade (leia antes de codar)

- `wiki/components/component_bar_chart.md` — spec do componente (estados, toggle, indicador de comparação, tokens).
- `wiki/api/dashboard.md` — seção `GET /v1/dashboard/comparison` (parâmetros, envelope, `buckets`, `comparison`).
- `wiki/design_system.md` — tokens e regras de valor monetário.
- Componentes de referência já existentes no repo (siga o mesmo estilo):
  - `src/components/line-chart/line-chart.tsx` — padrão de chart Recharts, tooltip, skeleton, estado vazio, `ResponsiveContainer`.
  - `src/components/tabs/filter-tabs.tsx` e `src/components/tabs/tabs.tsx` — padrão do toggle segmentado (use para o toggle Mês/Semana).

## Escopo — entregáveis

### 1. Tipos — `src/types/dashboard.ts` (append, não reescreva o arquivo)

```ts
export type ComparisonGroupBy = 'month' | 'week'

export interface ComparisonBucket {
  periodStart: string // ISO date — ordenação e tooltip
  label: string // rótulo pt-BR já formatado pela API (ex.: "Jul/26" ou "12–18/jul")
  income: number // magnitude POSITIVA
  expense: number // magnitude POSITIVA
}

export interface DashboardComparisonStats {
  sampleSize: number // qtd de buckets na média (todos menos o último)
  incomeVsAvg: number | null // % com 1 casa; null = sem base de comparação
  expenseVsAvg: number | null
}

export interface DashboardComparison {
  groupBy: ComparisonGroupBy
  buckets: ComparisonBucket[]
  comparison: DashboardComparisonStats
}
```

### 2. Service — `src/services/dashboard.ts` (append)

O endpoint `comparison` aceita `period`, `dateFrom`, `dateTo`, `groupBy`, `categoryIds`,
`ministryId` — **não aceita `type`**. NÃO reutilize `toQueryParams` (ela envia `type`);
crie um mapper local que omite `type`.

```ts
export function getDashboardComparison(
  filters: DashboardFilters,
  groupBy: ComparisonGroupBy = 'month',
  signal?: AbortSignal,
): Promise<DashboardComparison> {
  return apiClient.get(
    '/dashboard/comparison',
    {
      period: filters.period,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      categoryIds: filters.categoryIds?.join(','),
      ministryId: filters.ministryId,
      groupBy,
    },
    signal,
  )
}
```

Importe `ComparisonGroupBy` e `DashboardComparison` de `@/types`.

### 3. Query key — `src/lib/query-keys.ts`

Adicione dentro de `dashboard`:

```ts
comparison: (filters: DashboardFilters, groupBy: ComparisonGroupBy) =>
  ['dashboard', 'comparison', filters, groupBy] as const,
```

Importe `ComparisonGroupBy` junto dos demais tipos no topo do arquivo.

### 4. Hooks TanStack Query

**Dashboard** — `src/features/dashboard/hooks/use-dashboard-comparison.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import { getDashboardComparison } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { ComparisonGroupBy, DashboardFilters } from '@/types'
import { isDashboardFiltersReady } from '../filters'

export function useDashboardComparison(filters: DashboardFilters, groupBy: ComparisonGroupBy) {
  return useQuery({
    queryKey: queryKeys.dashboard.comparison(filters, groupBy),
    queryFn: ({ signal }) => getDashboardComparison(filters, groupBy, signal),
    enabled: isDashboardFiltersReady(filters),
  })
}
```

**Início** — `src/features/home/hooks/use-dashboard-comparison.ts`. A Início mostra os
**últimos 6 meses**, agrupamento mensal fixo, sem toggle e sem filtros globais:

```ts
import { useQuery } from '@tanstack/react-query'
import { getDashboardComparison } from '@/services'
import { queryKeys } from '@/lib/query-keys'
import type { DashboardFilters } from '@/types'

// Início é fixa: últimos 6 meses, agrupamento mensal.
const HOME_COMPARISON_FILTERS: DashboardFilters = { period: 'last6Months' }

export function useDashboardComparison() {
  return useQuery({
    queryKey: queryKeys.dashboard.comparison(HOME_COMPARISON_FILTERS, 'month'),
    queryFn: ({ signal }) => getDashboardComparison(HOME_COMPARISON_FILTERS, 'month', signal),
  })
}
```

### 5. Componente — `src/components/bar-chart/`

Arquivos: `bar-chart.tsx`, `index.ts` (mesmo padrão de `line-chart/index.ts`:
`export { BarChart } from './bar-chart'` + `export type { BarChartProps }`), e
`bar-chart.test.tsx`.

**Props (contrato exato — não mude nomes):**

```ts
export interface BarChartProps {
  /** `buckets` de GET /v1/dashboard/comparison. Uma dupla de barras (entrada×saída) por item. */
  data: ComparisonBucket[]
  /** Objeto `comparison` da API — alimenta o indicador textual. Omitido = sem indicador. */
  comparison?: DashboardComparisonStats
  /** Skeleton no lugar do gráfico enquanto recarrega. */
  isLoading?: boolean
  /** Valor atual do toggle Mês/Semana. Só relevante quando `onGroupByChange` é passado. */
  groupBy?: ComparisonGroupBy
  /** Handler do toggle. QUANDO AUSENTE, o toggle NÃO é renderizado (caso da tela Início). */
  onGroupByChange?: (value: ComparisonGroupBy) => void
  /** Título opcional do cabeçalho do card. */
  title?: string
  className?: string
}
```

**Comportamento visual:**

- Espelhe o `line-chart.tsx`: `ResponsiveContainer`, altura `h-72`, `CartesianGrid`
  `stroke="var(--border)"` só horizontal, tooltip própria no mesmo estilo (borda `border`,
  `bg-popover`, valores em `font-mono` na cor semântica), sem hex hardcoded.
- Recharts `BarChart` com duas `Bar` **lado a lado** (agrupadas, não empilhadas):
  série `income` em `fill="var(--income)"`, série `expense` em `fill="var(--expense)"`.
- `XAxis dataKey="label"` (o rótulo já vem pronto da API). `YAxis` com `formatCurrency`
  e `fontFamily: 'var(--font-mono)'`, igual ao line-chart. Legenda "Entradas"/"Saídas".
- **Toggle Mês/Semana:** só quando `onGroupByChange` estiver definido. Renderize no canto
  do cabeçalho do gráfico usando o padrão de `FilterTabs`/`Tabs` (opções `month`→"Mês",
  `week`→"Semana"; ativa em `Azul`/primary). Sem `onGroupByChange` (Início) → nada de toggle.
- **Indicador de comparação:** quando `comparison` for passado, renderize acima do gráfico
  um texto por série usando `sampleSize`. Unidade depende do `groupBy` atual: `meses`
  (month) ou `semanas` (week). Formato: `Entradas ↑/↓ X,X% vs. média dos N meses anteriores`.
  - Seta `↑` para variação positiva, `↓` para negativa.
  - Percentual: 1 casa decimal, separador decimal vírgula
    (`Math.abs(v).toFixed(1).replace('.', ',')`), com `%`.
  - **Não use cor semântica** no indicador — cor `Entradas`/`Saídas` é reservada a valor
    monetário. Texto em `Corpo`/`muted-foreground`.
  - `incomeVsAvg`/`expenseVsAvg` `null` (ou `sampleSize` 0) → aquela série exibe `—`,
    **nunca** `0%`.
- **Loading:** skeleton idêntico ao do line-chart (`animate-pulse`, `bg-muted`, `h-72`).
- **Vazio:** quando `data` estiver vazio, ícone (`BarChart3` do lucide-react) +
  "Nenhuma transação encontrada", no mesmo padrão do estado vazio do line-chart.

### 6. Teste — `bar-chart.test.tsx`

Cubra o essencial (Vitest + Testing Library, siga `line-chart.test.tsx` /
`pie-chart.test.tsx`):

- Estado vazio renderiza a mensagem "Nenhuma transação encontrada".
- Estado loading renderiza o skeleton (role/aria como no line-chart).
- Toggle **não** aparece sem `onGroupByChange`; **aparece** com ele e dispara o handler ao clicar.
- Indicador de comparação: mostra `—` quando `incomeVsAvg`/`expenseVsAvg` é `null`;
  formata `↓ 10,0%` para `-10.0`; usa a unidade correta (`meses` vs `semanas`).

## Critérios de aceite

- `npm run lint` e `npm run test` passam.
- Sem hex hardcoded — só tokens/CSS variables.
- Contrato de tipos, service, query-key, hooks e props **exatamente** como acima
  (outras tarefas dependem desses nomes).
- Não tocou em `home-page.tsx`, `charts-section.tsx` nem `dashboard-page.tsx`.
- Commit na branch da worktree: `feat: component_bar_chart + dados de comparison (specs/component-bar-chart.md)`.
