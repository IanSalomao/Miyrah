# Formulário de transação com lançamentos encadeados (batch add)

## Contexto

O formulário de criação de transação (`transaction-form-modal.tsx`) precisa
ganhar uma feature de produtividade: ao **criar** (não ao editar) uma
transação, o usuário pode empilhar vários "cards" de formulário no mesmo
drawer e salvar tudo de uma vez — uma bateria de lançamentos encadeados.

Existe um segundo agente trabalhando **em paralelo, em outra worktree**, no
redesign visual da tela (`transactions-page.tsx`, novo `transaction-row.tsx`).
Vocês não se comunicam. Para não colidir, respeite rigorosamente o "Escopo"
abaixo — principalmente o contrato público do `TransactionFormModal`.

## Fonte da verdade (leia antes de implementar)

- `wiki/pages/page_transactions.md` — regras de negócio (campos do formulário,
  fluxo de criar/editar, erros de API).
- `wiki/api/transactions.md` — contrato de `POST /v1/transactions` (**não há
  endpoint de criação em lote** — só uma transação por chamada).
- `wiki/components/component_modal_form.md` e
  `wiki/design_system.md#Formulários — drawer lateral vs. pop-up` — drawer
  lateral não-modal para criar/editar.
- Use a skill `/frontend-design:frontend-design` como guia de execução visual.
- Leia o código atual antes de reescrever:
  `src/features/transactions/components/transaction-form-modal.tsx`,
  `src/features/transactions/components/transaction-form-modal.test.tsx`,
  `src/features/transactions/schemas.ts`,
  `src/features/transactions/hooks/use-transaction-mutations.ts`,
  `src/features/transactions/hooks/use-categories-options.ts`,
  `src/features/transactions/hooks/use-ministries-options.ts`,
  `src/features/transactions/components/member-picker.tsx`,
  `src/features/transactions/components/segmented-control.tsx`,
  `src/components/modal-form/form-drawer.tsx`.

## Mockup de referência (Transacoes.html do claude.ai/design)

O trecho abaixo é um protótipo estático (React 18 solto, sem TS, sem API real,
sem React Hook Form/Zod) exportado do design tool. É **só referência
visual/estrutural** — a implementação real deve usar os padrões do projeto:
React Hook Form + Zod (`schemas.ts`), TanStack Query, componentes já
existentes (`FormDrawer`, `SegmentedControl`, `MemberPicker`, `Select` do
shadcn), dados vindos das APIs reais (não das constantes `CAT`/`MEMBERS`/
`MINISTRIES` do mockup).

```jsx
let __uid = 100;
const blankForm = () => ({
  uid: ++__uid, type: "entrada", cat: "dizimos", desc: "",
  link: "none", member: "", ministry: "",
  date: "2026-07-17", time: "", value: "",
});

function FormCard({ f, index, count, update, remove }) {
  const income = f.type === "entrada";
  const catOpts = Object.entries(CAT).filter(([, c]) => c.type === f.type);
  const setType = (t) => update(f.uid, { type: t, cat: CAT[f.cat]?.type === t ? f.cat : Object.keys(CAT).find((k) => CAT[k].type === t) });
  return (
    <div style={{ border: "1px solid var(--linha)", borderRadius: 14, background: "var(--card)", padding: 16, boxShadow: "0 1px 2px #12203a0a" }}>
      {/* cabeçalho do card: número + segmented Entrada/Saída + (se count>1) lixeira remover */}
      {/* campos em grid 2 colunas: Categoria | Valor | Descrição (largura total) |
          Vínculo (segmented Nenhum/Membro/Ministério + select condicional) |
          Data | Hora */}
    </div>
  );
}

function BatchAddDrawer({ open, onOpenChange }) {
  const [forms, setForms] = useState([blankForm()]);
  React.useEffect(() => { if (open) setForms([blankForm()]); }, [open]);

  const update = (uid, patch) => setForms((fs) => fs.map((f) => f.uid === uid ? { ...f, ...patch } : f));
  const remove = (uid) => setForms((fs) => fs.filter((f) => f.uid !== uid));
  const addAfter = (i) => setForms((fs) => [...fs.slice(0, i + 1), blankForm(), ...fs.slice(i + 1)]);
  const dupAt = (i) => setForms((fs) => [...fs.slice(0, i + 1), { ...fs[i], uid: ++__uid }, ...fs.slice(i + 1)]);

  const n = forms.length;

  return (
    <FormDrawer open={open} onOpenChange={onOpenChange}
      onSubmit={(e) => { e.preventDefault(); onOpenChange(false); }}
      title="Novos lançamentos"
      description={`${n} ${n === 1 ? "transação encadeada" : "transações encadeadas"}`}
      submitLabel={`Salvar ${n} ${n === 1 ? "transação" : "transações"}`}>
      <div className="flex flex-col">
        {forms.map((f, i) => (
          <React.Fragment key={f.uid}>
            <FormCard f={f} index={i} count={n} update={update} remove={remove} />
            <div className="flex items-center justify-center gap-2" style={{ padding: "12px 0" }}>
              <button type="button" onClick={() => addAfter(i)}>+ Adicionar</button>
              <button type="button" onClick={() => dupAt(i)}>⧉ Duplicar</button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </FormDrawer>
  );
}
```

Ideia central a preservar: **cada card é independente** (tipo, categoria,
valor, descrição, vínculo com membro/ministério, data próprios), um botão
"Adicionar" logo abaixo de cada card insere um novo card em branco **depois
daquele** (não sempre no fim da lista), e "Duplicar" insere uma cópia dos
valores daquele card logo abaixo. O card só ocupa a altura necessária para
seus campos (sem sobra de espaço). Numeração visual (#1, #2...) e botão de
remover (lixeira) por card quando há mais de 1.

## Escopo — arquivos que você PODE alterar

- `src/features/transactions/components/transaction-form-modal.tsx`
  (reescrita principal)
- `src/features/transactions/components/transaction-form-modal.test.tsx`
  (atualize/reescreva os testes para o novo fluxo)
- Novos arquivos em `src/features/transactions/components/` (ex.:
  `transaction-batch-form-card.tsx` + teste), se quiser quebrar em
  sub-componentes.
- `src/features/transactions/schemas.ts` — só **adicionando** exports novos
  se precisar (ex. um helper de schema por card). NÃO remova nem mude a
  assinatura dos exports existentes (`transactionTypeOptions`,
  `createTransactionSchema`, `TransactionFormValues`, `toTransactionPayload`).
- `src/features/transactions/hooks/use-transaction-mutations.ts` — só
  **adicionando** um novo hook (ex. `useCreateTransactions` para criação em
  lote). Não altere `useCreateTransaction`/`useUpdateTransaction`/
  `useRemoveTransaction` existentes.
- `src/features/transactions/components/member-picker.tsx` e
  `segmented-control.tsx` — reaproveite como estão; só altere se for
  estritamente necessário para suportar múltiplas instâncias simultâneas (ex.
  garantir que múltiplos `MemberPicker` na mesma tela não compartilhem estado
  indevidamente — hoje cada um já tem seu próprio `useState`, então
  provavelmente não precisa mexer).

## Fora de escopo — NÃO altere (outro agente está mexendo nesses arquivos)

- `src/features/transactions/transactions-page.tsx`
- `src/features/transactions/components/transaction-row.tsx`
- `src/features/transactions/components/transactions-filter-bar.tsx`
- Qualquer coisa fora de `src/features/transactions/`.

**Contrato que não pode mudar:** a página (`transactions-page.tsx`, que você
não vai tocar) importa e usa:

```tsx
<TransactionFormModal
  open={formModal.open}
  onOpenChange={(open) => setFormModal((prev) => ({ ...prev, open }))}
  transaction={formModal.transaction}
/>
```

`transaction: null` (ou ausente) = **modo criação** (aqui entra o
encadeamento). `transaction` presente = **modo edição** (comportamento atual,
sem encadeamento). Mantenha exatamente essa assinatura de props
(`TransactionFormModalProps`) — o outro agente depende dela sem saber os
detalhes internos da sua implementação.

## Requisitos funcionais

1. **Modo edição** (`transaction` presente): mantenha o comportamento atual —
   um único formulário com os campos de hoje (Tipo, Valor, Data, Categoria,
   Descrição, Membro, Ministério), sem encadeamento, sem botões
   Adicionar/Duplicar.
2. **Modo criação** (`transaction` nulo/ausente): drawer abre com **1 card**.
   Cada card tem, abaixo dele, os botões **"Adicionar"** (insere um card em
   branco logo após aquele) e **"Duplicar"** (insere uma cópia dos valores
   daquele card logo após). Numeração por card; botão de remover (lixeira)
   quando há mais de 1 card. Ao fechar/cancelar e reabrir o drawer, resetar
   para 1 card em branco.
3. **Campos de cada card:** Tipo (reaproveitar `SegmentedControl` existente,
   Entrada/Saída), Categoria (Select filtrado pelo tipo daquele card
   especificamente — como pode haver cards com tipos diferentes, você
   provavelmente vai precisar chamar `useCategoriesOptions(cardType)` uma vez
   por card, não uma vez só pro drawer inteiro), Valor (`font-mono`, alinhado
   à direita, cor semântica ao vivo conforme o tipo do card), Data,
   Descrição, Membro (opcional, reaproveitar `MemberPicker`), Ministério
   (opcional, reaproveitar `Select` + `useMinistriesOptions`). Trocar o Tipo
   de um card limpa a Categoria daquele card se ela não for compatível (mesma
   regra que já existe hoje em `handleTypeChange`).
4. **Validação por card:** reaproveite (ou adapte) `createTransactionSchema`
   por card, incluindo a checagem cliente de `categoryId` × `type` (mesma
   regra que já existe). Só permita submeter se **todos** os cards forem
   válidos; cards inválidos mostram erro inline nos campos (mesmo padrão
   atual: `<p className="text-xs text-destructive">`) e bloqueiam o submit —
   ao tentar submeter com algum card inválido, dê scroll/foco até o primeiro
   inválido.
5. **Submissão:** como só existe `POST /v1/transactions` (uma transação por
   chamada, ver `wiki/api/transactions.md`), dispare **uma chamada por card**
   via `Promise.allSettled` (não pare no primeiro erro).
   - Se **todas** tiverem sucesso: feche o drawer e invalide as queries de
     transações (reaproveite o padrão de `queryKeys.transactions.all` de
     `use-transaction-mutations.ts`) uma única vez ao final.
   - Se **algumas falharem**: invalide as queries mesmo assim (para refletir
     as que já foram criadas), **remova da lista os cards que tiveram
     sucesso**, mantenha no drawer só os cards que falharam com o erro de
     cada um aplicado (mesmo tratamento de `error.code` que já existe hoje:
     `CATEGORY_TYPE_MISMATCH` marca o campo Categoria, `VALIDATION_ERROR` com
     `details` marca os campos indicados, `RESOURCE_NOT_FOUND` não se aplica
     em criação), e atualize o rótulo do botão de submit para refletir quantos
     cards ainda restam salvar (ex. "Salvar 2 transações" → depois de 1
     sucesso e 1 falha, vira "Salvar 1 transação").
6. **Rodapé/cabeçalho do drawer:** botão de submit dinâmico
   "Salvar N transação(ões)" (concordância singular/plural), desabilitado
   durante o carregamento; pode reaproveitar a `description` do `FormDrawer`
   para indicar quantos cards existem (ex. "3 transações encadeadas") — não é
   obrigatório mostrar o saldo somado do mockup, mas pode incluir se for
   simples.
7. Reaproveite o `FormDrawer` existente (`@/components/modal-form/form-drawer`)
   como casca do drawer — não recrie do zero.
8. Nenhum hex hardcoded; comentários em português; strings de UI em pt-BR
   corretamente acentuadas.

## Critérios de aceite

- `npm run lint` e `npm run test` passam.
- Editar uma transação existente continua funcionando exatamente como hoje
  (mesmo fluxo single-card, sem Adicionar/Duplicar).
- Criar com 1 card funciona (equivalente ao fluxo atual).
- Adicionar/Duplicar/Remover cards funciona, com o card inserido na posição
  correta (logo após o card de origem, não sempre no fim).
- Cada card valida seu próprio tipo↔categoria antes do submit.
- Submeter com múltiplos cards dispara uma chamada por card; sucesso total
  fecha o drawer; sucesso parcial mantém só os cards com falha, com o erro
  correspondente, e não perde os dados já digitados nos cards que falharam.
- Teste automatizado cobrindo pelo menos: edição ainda funciona, criação com
  múltiplos cards dispara N chamadas, e sucesso parcial mantém os cards que
  falharam.

## Fluxo de finalização

1. Rode lint e os testes relevantes
   (`transaction-form-modal.test.tsx` e quaisquer novos arquivos de teste).
2. Faça commit na branch da sua worktree:
   `feat: lançamentos encadeados no formulário de transação (specs/transactions-batch-form.md)`.
3. Não faça merge para `main`. Retorne um resumo do que foi feito, arquivos
   alterados, resultado dos testes e qualquer decisão relevante (ex. como
   ficou a chamada por card ao `POST /v1/transactions`, tratamento de sucesso
   parcial).
