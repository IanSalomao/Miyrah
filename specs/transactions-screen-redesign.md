# Redesign da tela de Transações — card-row + limpeza visual

## Contexto

A tela de Transações (`src/features/transactions/transactions-page.tsx`) é a mais
importante do sistema — todo o Miyrah gira em torno desse dado. Vamos redesenhá-la
para ficar mais **clean, minimalista e orientada a desempenho/produtividade/clareza**.

A melhoria concreta desta tarefa: substituir a `DataTable` genérica por um
componente de **card-row** dedicado a cada transação, com mais densidade de
informação visual do que uma tabela simples.

Existe um segundo agente trabalhando **em paralelo, em outra worktree**, na
reformulação do formulário de criação/edição (`transaction-form-modal.tsx`). Vocês
não se comunicam. Para não colidir, respeite rigorosamente o "Escopo" abaixo.

## Fonte da verdade (leia antes de implementar)

- `wiki/pages/page_transactions.md` — regras de negócio da página (colunas,
  paginação, filtros, ações).
- `wiki/design_system.md` — tokens de cor/tipografia/elevação. **Proibido hex
  hardcoded** — sempre via token/classe Tailwind (`text-income`, `text-expense`,
  `border-border`, etc., ver `src/index.css`/`tailwind` para os tokens já
  mapeados).
- `wiki/components/component_modal_form.md` (contexto, não é o foco desta tarefa).
- Use a skill `/frontend-design:frontend-design` como guia de execução visual.

## Mockup de referência (Transacoes.html do claude.ai/design)

O trecho abaixo é um protótipo estático (React 18 solto, sem TS, sem API real)
exportado do design tool. Ele é **só referência visual/estrutural** — não copie o
código literalmente; reimplemente com os padrões reais do projeto (TypeScript,
Tailwind, componentes/hooks já existentes no repo, dados vindos de
`transactionsQuery.data.items: Transaction[]`).

Cabeçalho da lista:

```jsx
function TxHeaderRow() {
  const cell = { fontSize: 11.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--tinta-subtle)" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "44px minmax(0,2.4fr) 1.35fr 0.95fr auto",
      alignItems: "center", gap: 20, padding: "0 20px 2px" }}>
      <span />
      <span style={cell}>Categoria & descrição</span>
      <span style={cell}>Membro / ministério</span>
      <span style={cell}>Data e hora</span>
      <span style={{ ...cell, textAlign: "right" }}>Valor</span>
    </div>
  );
}
```

Card-row de cada transação (ícone entrada/saída · categoria+tag/descrição ·
membro/ministério · data+hora · valor):

```jsx
function TxRow({ tx }) {
  const c = CAT[tx.cat];
  const income = c.type === "entrada";
  const Arrow = income ? IcArrowIn : IcArrowOut;
  const money = income ? "var(--income)" : "var(--expense)";
  const tint = income ? "#1f7a5417" : "#b5443a17"; // ~9% de opacidade da cor semântica
  return (
    <div className="mi-row" style={{ display: "grid", gridTemplateColumns: "44px minmax(0,2.4fr) 1.35fr 0.95fr auto",
      alignItems: "center", gap: 20, background: "var(--card)", border: "1px solid var(--linha)",
      borderRadius: 14, padding: "14px 20px" }}>
      {/* 1 · entrada/saída */}
      <div className="grid place-items-center shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: tint, color: money }}>
        <Arrow size={21} sw={2.2} />
      </div>
      {/* 2 · categoria + tag / descrição */}
      <div style={{ minWidth: 0 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 3 }}>
          <span style={{ color: c.color, display: "inline-flex", flexShrink: 0 }}><IcTag size={15} /></span>
          <span style={{ fontWeight: 600, fontSize: 15, color: "var(--tinta)" }}>{c.name}</span>
        </div>
        <div style={{ fontSize: 13.5, color: "var(--tinta-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.desc}</div>
      </div>
      {/* 3 · membro / ministério */}
      <div style={{ minWidth: 0 }}>
        {tx.member ? (
          <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
            <MemberAvatar name={tx.member} size="sm" />
            <span style={{ fontSize: 13.5, color: "var(--tinta)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.member}</span>
          </div>
        ) : tx.ministry ? (
          <div className="flex items-center gap-2" style={{ color: "var(--tinta-muted)", minWidth: 0 }}>
            <IcBuilding size={16} />
            <span style={{ fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.ministry}</span>
          </div>
        ) : (
          <span style={{ color: "var(--tinta-subtle)", fontSize: 14 }}>—</span>
        )}
      </div>
      {/* 4 · data e hora */}
      <div style={{ fontSize: 13.5, color: "var(--tinta)" }}>
        <div style={{ fontVariantNumeric: "tabular-nums" }}>{tx.date}</div>
        <div className="flex items-center gap-1" style={{ color: "var(--tinta-subtle)", fontSize: 12.5, marginTop: 2 }}>
          <IcClock size={13} /><span style={{ fontVariantNumeric: "tabular-nums" }}>{tx.time}</span>
        </div>
      </div>
      {/* 5 · valor */}
      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums",
        fontWeight: 600, fontSize: 16, color: money, whiteSpace: "nowrap" }}>
        {income ? "+" : "−"}R$ {brl(tx.value)}
      </div>
    </div>
  );
}
```

Observações sobre o mockup e como adaptar para o código real:

- `tx.date`/`tx.time` no mockup são strings separadas; no dado real,
  `Transaction.date` é `YYYY-MM-DD` (sem hora — usar `formatDate` de
  `@/lib/format.ts`) e não existe timestamp de hora de lançamento no tipo
  `Transaction` atual (só `createdAt`/`updatedAt`, que são metadados, não "data e
  hora da transação"). **Decisão:** exiba `formatDate(transaction.date)` na
  primeira linha; na segunda linha (ícone de relógio), exiba a hora derivada de
  `transaction.createdAt` via `formatDateTime`/um novo helper que extraia só
  `HH:mm` — se não houver like helper pronto, adicione um pequeno helper local
  no próprio componente (não precisa mexer em `lib/format.ts`, mas pode se for
  aditivo). Não invente campo novo na API.
- Ícones: use `lucide-react` (já é dependência do projeto — ver
  `transaction-linked-cell.tsx`/`transactions-page.tsx` para exemplos), não
  crie SVGs inline como o mockup faz. Equivalentes sugeridos:
  `ArrowDownIcon`/`ArrowDownLeftIcon` (entrada) e `ArrowUpIcon`/`ArrowUpRightIcon`
  (saída), `TagIcon`, `Building2Icon`, `ClockIcon`.
- Cores: nunca hex hardcoded. O tint de fundo do ícone (`#1f7a5417`) deve virar
  algo como `bg-income/10 text-income` / `bg-expense/10 text-expense` (classes
  Tailwind já usadas em outros componentes do projeto — confirme os nomes reais
  olhando `tailwind.config`/`src/index.css` e `metric-card.tsx`).
- A cor da categoria (`c.color`/`category.color`) é dado do usuário, não token —
  mantém-se como está (inline `style={{ color: category.color }}` no ícone de
  tag), nunca substitui a cor semântica do valor.

## Ações Editar/Excluir (decisão já tomada com o usuário)

O mockup **não mostra** ícones de ação no card-row. Decisão: usar um botão
**kebab (⋯)** que só aparece no hover/focus da linha (mesmo padrão de
`opacity-0 group-hover:opacity-100 focus-within:opacity-100` já usado em
`src/components/data-table/data-table.tsx`), posicionado à direita, depois da
coluna de valor (ou sobreposto a ela só visualmente no hover — julgamento seu,
desde que não quebre o alinhamento em repouso). Ao clicar, abre um
`Popover` (`@/components/ui/popover`, já existe no projeto) com duas opções:
"Editar" e "Excluir" (ícones `PencilIcon`/`Trash2Icon` de lucide-react, "Excluir"
em cor destrutiva). Não precisa adicionar `dropdown-menu` do shadcn — o Popover
já disponível é suficiente.

## Escopo — arquivos que você PODE alterar

- `src/features/transactions/transactions-page.tsx`
- `src/features/transactions/components/transaction-row.tsx` (**novo**)
- `src/features/transactions/components/transactions-filter-bar.tsx`
- Qualquer outro arquivo **novo** dentro de
  `src/features/transactions/components/` cujo nome comece com `transaction-row`
  (ex.: skeleton, estado vazio), se precisar quebrar em sub-componentes.

## Fora de escopo — NÃO altere (outro agente está mexendo nesses arquivos)

- `src/features/transactions/components/transaction-form-modal.tsx`
- `src/features/transactions/components/member-picker.tsx`
- `src/features/transactions/components/segmented-control.tsx`
- `src/features/transactions/schemas.ts`
- `src/features/transactions/hooks/use-transaction-mutations.ts`
- Qualquer coisa fora de `src/features/transactions/`.

**Contrato que não pode mudar:** a página continua renderizando
`<TransactionFormModal open={...} onOpenChange={...} transaction={...} />`
exatamente como hoje (ver `transactions-page.tsx` atual) — `transaction: null`
= criar, `transaction` presente = editar. Não mude essa assinatura nem tente
adivinhar a nova implementação interna do formulário (ela está sendo reescrita
em paralelo para suportar lançamentos encadeados, mas a interface pública com a
página é a mesma).

## Requisitos funcionais

1. **`TransactionRow`** — grid de 5 colunas conforme mockup acima:
   ícone entrada/saída · (categoria com tag colorida + descrição, 2 linhas) ·
   membro/ministério · data e hora · valor (mono, alinhado à direita, sinal
   `+`/`−` explícito via `formatSignedCurrency`, cor semântica).
2. Categoria/membro/ministério excluídos: mantenha a indicação visual
   "(excluído)" que já existe hoje (`TransactionLinkedCell` e o tratamento de
   `category.deleted` em `transactions-page.tsx`) — pode extrair/adaptar esse
   componente, mas não perca esse comportamento.
3. Cabeçalho da lista (`TxHeaderRow` acima), sem rótulo na coluna do
   ícone/ações.
4. **Loading:** substitua o skeleton de linhas de tabela por um equivalente em
   card (ex.: `TransactionRowSkeleton`).
5. **Erro:** mantenha mensagem + botão "Tentar novamente" (mesmo texto/
   comportamento de hoje), sem a moldura de `<table>`.
6. **Vazio:** "Nenhuma transação encontrada" + botão "Adicionar transação"
   (regra global do projeto para estados vazios).
7. **Paginação:** continue usando `@/components/pagination/pagination`
   (`Pagination`/`PaginationProps`) abaixo da lista, com os mesmos dados de
   `transactionsQuery.data.meta` — não removê-la só porque o mockup (com dado
   estático) não a mostra.
8. Cards de métrica (`MetricCard`) e `ConfirmModal` de exclusão continuam como
   estão — não precisa recriar, só religar aos novos callbacks de
   editar/excluir do card-row.
9. **Filtros:** mantenha a semântica atual (busca por descrição, período por
   `dateFrom`/`dateTo`, categoria única, tipo) — é permitido só um polimento
   visual (espaçamento, tokens, cantos) para casar com o clima do mockup. NÃO
   troque o filtro de período por presets ("Últimos 30 dias" etc. do mockup) —
   isso mudaria a semântica de filtragem além do que foi pedido e divergiria de
   `wiki/pages/page_transactions.md`.
10. Ajuste espaçamento/tipografia gerais da página para o clima "clean e
    minimalista" dos tokens do design system (elevação `sm`, título em
    Recoleta se ainda não estiver, etc.), sem redesenhar sidebar/layout
    protegido (fora do escopo).

## Critérios de aceite

- `npm run lint` e `npm run test` passam.
- Tela renderiza a lista como card-row (não mais `<table>`), com hover
  revelando o kebab de ações.
- Editar abre o drawer de edição (mesmo fluxo de hoje); Excluir abre o
  `ConfirmModal` existente.
- Paginação, métricas, filtros, loading/erro/vazio continuam funcionando.
- Nenhum hex hardcoded introduzido (revise antes de finalizar).

## Fluxo de finalização

1. Rode lint e os testes relevantes (`transactions-page`,
   `transaction-row` se você criar testes).
2. Faça commit na branch da sua worktree:
   `feat: card-row na tela de transações (specs/transactions-screen-redesign.md)`.
3. Não faça merge para `main`. Retorne um resumo do que foi feito, arquivos
   alterados, resultado dos testes e qualquer decisão relevante.
