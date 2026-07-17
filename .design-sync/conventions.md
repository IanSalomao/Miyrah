## Miyrah — convenções do design system

Miyrah é um sistema de **gestão financeira para igrejas** (multi-tenant por igreja). UI sempre em
**pt-BR**. Paleta monocromática azul sobre base clara e morna. Os componentes são React + Tailwind v4
(base shadcn/ui) e já vêm estilizados pelos tokens do DS.

### Setup e wrapping

A maioria dos componentes renderiza sozinha — só precisa da folha de estilos (`styles.css`, que traz
tokens + fontes). Alguns leem contexto e exigem providers ao redor:

- **SideBar** — precisa de React Router **e** de um provider de autenticação (`useAuth`).
- **AuthLayout** — precisa de React Router (usa `<Outlet>`).
- **MemberPicker** — busca membros via TanStack Query (envolva em `QueryClientProvider`).

```tsx
<QueryClientProvider client={queryClient}>
  <BrowserRouter>{/* app */}</BrowserRouter>
</QueryClientProvider>
```

### Idioma visual: classes utilitárias Tailwind sobre tokens do DS

Estilize com utilitários Tailwind que mapeiam para os tokens da marca — **nunca hex hardcoded**:

| Papel | Classes |
|---|---|
| Fundo / superfície | `bg-background` (Papel), `bg-card` (Superfície), `bg-popover` (Elevado) |
| Texto | `text-foreground` (Tinta), `text-muted-foreground` (secundário) |
| Accent / interação | `bg-primary` `text-primary` (Azul — **nunca** cor de dinheiro), foco em `ring` |
| Bordas / réguas | `border-border` (Linha) |
| Elevação | `shadow-sm` (card/tabela), `shadow-lg` (auth), `rounded-lg` |
| **Valores financeiros** | `text-income` (entradas, verde) · `text-expense` (saídas, vermelho) |
| Tipografia | `font-display` (Recoleta, títulos) · `font-mono` (JetBrains Mono, valores) · Barlow é o corpo padrão |

**Regra de dinheiro (obrigatória):** todo valor monetário usa `font-mono tabular-nums`, alinhado à
direita, na cor semântica (`text-income`/`text-expense`) com sinal `+`/`−` explícito — a cor **nunca**
é a única pista. `text-primary` (Azul) nunca representa dinheiro. A cor de categoria é dado do usuário
(aparece só como swatch/dot ao lado do nome), nunca substitui income/expense no valor.

**Padrões de UX:** criar/editar em **drawer lateral** (`FormDrawer` / `Sheet`, não-modal, mantém a
tela utilizável); confirmações destrutivas em **pop-up** centralizado (`ConfirmModal` / `Dialog`).
Avatares de membro são gerados das iniciais (`MemberAvatar`) — não há upload de foto.

### Onde está a verdade

- Estilos e tokens: `styles.css` e seu fecho de `@import` (`_ds_bundle.css`, `fonts/`).
- API de cada componente: o `<Name>.d.ts` (props) e o `<Name>.prompt.md` (uso) ao lado de cada card.

### Exemplo idiomático

```tsx
import { MetricCard } from 'miyrah'

// Bloco de métricas do topo do Dashboard
<div className="grid grid-cols-4 gap-4 bg-background p-6">
  <MetricCard label="Entradas" value={18450} variant="income" />
  <MetricCard label="Saídas" value={7320.5} variant="expense" />
  <MetricCard label="Saldo" value={11129.5} variant="balance" />
  <MetricCard label="Transações" value={143} variant="neutral" />
</div>
```
