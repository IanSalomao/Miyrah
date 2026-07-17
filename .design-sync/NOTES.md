# Notas do design-sync — Miyrah

Repo é o **front-end (app SPA)**, não uma biblioteca publicada. Sem Storybook, sem
barrel de biblioteca, `dist/` é o build do app. Por isso o sync usa modo synth/barrel.

## Decisões de setup

- **shape = package**, entrada via **barrel** `.design-sync/entry.ts` (`--entry`), porque
  não há build de biblioteca. O barrel reexporta os componentes → `window.Miyrah`.
  `componentSrcMap` enumera os cards (a descoberta por `.d.ts` não acha nada — dist é do app).
- **Colisão de nomes**: `ui/tabs` colide com `components/tabs` (o DS reestiliza o primitivo).
  O barrel exporta só `@/components/tabs/*` (o do DS) e **omite `@/components/ui/tabs`**.
- **CSS (Tailwind v4)**: os utilitários só existem no CSS compilado hasheado do app
  (`dist/assets/index-*.css`). `.design-sync/prepare-css.mjs` reescreve as urls de fonte
  `/assets/...` (absolutas, irressolvíveis) → `./...` e grava `dist/assets/_ds_styles.css`,
  que é o `cfg.cssEntry`. `buildCmd = "npm run build && node .design-sync/prepare-css.mjs"`.
- **Fontes**: Barlow + JetBrains Mono (@fontsource) e Recoleta (self-hosted em
  `src/assets/fonts`). Resolvidas via a reescrita do prepare-css (os woff2/woff estão em
  dist/assets com os nomes exatos referenciados). `[FONT_DANGLING]` resolvido dessa forma.
- **Playwright**: cache local tem chromium build **1217** → usar **playwright@1.59.1**
  (1.61 fixa 1228 e falha "Executable doesn't exist"). Instalado em `.ds-sync/`.

## Provider

Alguns componentes leem contexto: `SideBar` (React Router **e** `useAuth`), `AuthLayout`
(React Router, Outlet) e `MemberPicker` (TanStack Query). `cfg.provider` aponta para
`DesignSyncProvider` (`.design-sync/provider.tsx`, via `extraEntries`) que envolve tudo em
`QueryClientProvider` + `MemoryRouter` + `AuthProvider`. Inofensivo para os demais.
- **`AuthProvider` importado de `@/app/auth-provider`** (mesma instância de `AuthContext`
  do bundle, já que provider.tsx é compilado dentro do bundle). Importar `AuthContext.Provider`
  numa *story* NÃO funciona — cria uma segunda instância de contexto que o `useAuth` compilado
  não enxerga. Por isso o AuthProvider vive no provider global, não nas stories.

## Aprendizados das ondas de autoria (5 ondas, 37 componentes)

- **Compostos**: o shim `miyrah` reexporta todos os subcomponentes (FieldLabel, InputGroupAddon,
  DialogContent, SelectItem, etc.) — confirmado via `entry.ts`/bundle.
- **Form** (react-hook-form): a story precisa criar `useForm` internamente (`<Form {...form}>`);
  o provider global não fornece form context. Erro de validação via `form.setError` em `useEffect`.
- **Filtros** são controlados (value+onChange): stories usam `useState` com valor inicial realista.
- **Sheet** não-modal no preview: `<Sheet modal={false}>` + `<SheetContent overlay={false}>`.
- **Command** renderiza vazio sem itens e não traz card próprio — precisa de wrapper com borda/raio.
- **Overlays** (Dialog/Sheet/Popover/ConfirmModal/FormDrawer): o pipeline de captura confina o
  portal ao viewport do card; com `minHeight` suficiente no wrapper coube tudo — **sem overrides**.
- **MemberPicker**: o `useQuery` só afeta a lista aberta; os estados de trigger fechado
  (Selected/Placeholder/Disabled) renderizam de `value`/`label` — não precisou de skip.

## Componentes que dependem de dados/interação

- `MemberPicker`: faz `useQuery` de membros — sem API real, fica em loading/vazio no preview.
- `Command`: paleta vazia por padrão (render blank) — precisa de composição autorada.
- Overlays (`Dialog`, `Sheet`, `Popover`, `Select` aberto): usar `defaultOpen` e conferir
  se o portal não escapa do card.

## Known render warns

- `Select` cell `Open`: leve corte no topo do dropdown (Radix ancora no item selecionado). Aceitável.
- `CategoryFilter`/`MinistryFilter`: capturam só o trigger fechado (o overlay abre por estado
  interno, sem prop externa). Estado captureável aceito; a lista aberta não aparece no card.
- **GRID_OVERFLOW resolvido via `cfg.overrides`** (13 componentes): `cardMode:"column"` para largos
  (FilterBar, PeriodFilter, Checkbox, LineChart, MemberPicker, MetricCard, FormDrawer, PieChart,
  FilterTabs) e `cardMode:"single"` para portal/fixed (Dialog→ConfirmDelete, Popover→BalanceDetails,
  Select→Open, ConfirmModal→DeleteTransaction). Não voltam a flaggar por construção.

## Recharts vs captura (IMPORTANTE)

`LineChart`/`PieChart` (Recharts) animam a entrada (~400–1500ms). O `package-capture.mjs`
screenshota em `networkidle`, que pode pegar a animação no meio (donut colapsado, linha parando
antes do fim). **Workaround atual está DENTRO das previews** (`LineChart.tsx`/`PieChart.tsx`):
elas mantêm a rede ocupada ~1.6s para adiar o `networkidle` até depois da animação. É um hack
frágil — se um dia falhar, a alternativa limpa é `isAnimationActive={false}` nos componentes de
chart ou um settle-delay pós-networkidle no capture.

## Re-sync risks

- `cfg.cssEntry` depende de `dist/assets/_ds_styles.css`, **gerado pelo prepare-css a partir
  do build do app**. Sempre rode `buildCmd` (que já encadeia o prepare-css) antes do conversor.
- O hash de `index-*.css` muda a cada build; o prepare-css faz glob do maior `index-*.css`, então
  é robusto — mas se o app parar de emitir CSS com esse padrão, ajuste `prepare-css.mjs`.
- Grupos dos cards: primitivos `ui/*` caem em "general"; customizados vão pra pasta de origem.
  Se quiser reagrupar, use frontmatter `category` em docs (`cfg.docsMap`).
- **Previews de chart** carregam um hack de timing (rede ocupada ~1.6s) atado ao comportamento de
  animação do Recharts — se o Recharts/capture mudar, revalidar `LineChart`/`PieChart`.
- **SideBar** depende do `AuthProvider` no provider global; se `@/app/auth-provider` ou
  `@/app/query-client` mudarem de caminho/assinatura, o provider quebra.
