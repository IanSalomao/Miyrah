# Assinatura — Plano, Forma de pagamento e Faturas

Tela de gestão da assinatura SaaS da igreja (rota `/subscription`), mais o aviso global de
teste/somente-leitura no layout autenticado. Consome o módulo `subscriptions` da API
(`Api.Miyrah/src/modules/subscriptions`, gateway AbacatePay).

> [!warning] Sem spec na wiki
> A wiki ainda não tem `pages/page_subscription.md` nem `api/subscriptions.md`. As fontes
> abaixo + as decisões registradas aqui (confirmadas pelo Ian em 19/10/2026) valem até a
> spec ser escrita no vault. Ao portar para a wiki, esta seção vira o handoff da página.

## Fontes da verdade

- `wiki/pricing.md` — plano único, preços, trial de 14 dias, somente leitura.
- Contrato real da API (DTOs do back): `subscription.dto.ts`, `payment.dto.ts`,
  `create-checkout.dto.ts`, `checkout-created.dto.ts`.
- `wiki/design_system.md`.

## Contrato da API consumido

| Endpoint | Uso |
| --- | --- |
| `GET /v1/subscriptions/me` | Estado da assinatura: `status`, `plan`, `trialEndsAt`, `currentPeriodEnd`, `canceledAt`, `readOnly` |
| `POST /v1/subscriptions/checkout` | `{ plan: 'monthly' \| 'annual', method?: 'card' \| 'pix' }` → `{ checkoutUrl, plan, method, paymentId }` |
| `POST /v1/subscriptions/cancel` | Cancela sem multa → `Subscription` atualizada (acesso segue até `currentPeriodEnd`) |
| `GET /v1/subscriptions/payments` | Histórico paginado (`page`/`limit`) de `Payment` |

- `status`: `trialing` (teste) · `active` · `past_due` (inadimplente) · `canceled`.
- `readOnly` é a fonte da verdade do bloqueio (calculado por `currentPeriodEnd`), **não**
  derivar do `status` no front.
- Mensal = recorrente, **só cartão** (`PLAN_METHOD_NOT_ALLOWED` se vier `pix`). Anual =
  pagamento único, cartão ou PIX (default PIX). Boleto (citado no pricing) **não existe** na API.
- Escrita em domínio com conta em somente-leitura → `402 SUBSCRIPTION_INACTIVE`.
- Valores do histórico em **centavos** (`amountCents`).

## Decisões

1. **Rota `/subscription`**, item "Assinatura" na sidebar (ícone `CreditCard`), antes de
   Configurações. Página com abas (`component_tabs`, variante Navegação):
   **Plano** (padrão) · **Pagamento** · **Faturas**.
2. **Preços como constantes no front** (`PLAN_PRICES` em `src/features/subscription/plans.ts`,
   citando `pricing.md`): mensal R$ 29,00, anual R$ 290,00. A API não expõe preço.
3. **Valores de preço e fatura em neutro**: mono, alinhados à direita, cor `Tinta`, **sem
   sinal**. Não são lançamentos do caixa da igreja — exceção consciente à regra de
   `Entradas`/`Saídas`.
4. **Forma de pagamento via checkout**: não há gestão de cartões. A aba mostra a forma do
   último pagamento confirmado. Trocar:
   - **Anual**: escolher Cartão/PIX e renovar (novo checkout; o período empilha no atual).
   - **Mensal ativo**: sem botão de checkout (a API não impede recorrência duplicada na
     AbacatePay). A aba orienta: cancelar e assinar de novo com o novo cartão, sem perder
     acesso.
5. **Checkout na mesma aba** (`window.location.assign(checkoutUrl)`). A volta é configurada
   no back: `BILLING_RETURN_URL=<front>/subscription` e
   `BILLING_COMPLETION_URL=<front>/subscription?checkout=completed`. Com
   `checkout=completed`, a tela mostra "pagamento em processamento" e reconsulta
   `/subscriptions/me` a cada 5 s por até 1 min (confirmação chega por webhook).
6. **Somente leitura fora da tela**: banner global no `ProtectedLayout` + reação ao `402`.
   Os botões das outras telas **não** são desabilitados.

## Aba Plano

**Card "Situação da assinatura"** (`Superfície` + `Linha` + sombra `sm`): título, badge de
status e uma linha de contexto:

| Situação | Badge | Texto |
| --- | --- | --- |
| `trialing`, com acesso | Período de teste | "Seu teste grátis termina em {data} ({n} dias)." |
| `trialing`, `readOnly` | Teste encerrado | "Seu teste grátis terminou em {data}. A conta está em somente leitura." |
| `active` mensal | Ativa | "Plano Mensal · renovação automática em {currentPeriodEnd}." |
| `active` anual | Ativa | "Plano Anual · válido até {currentPeriodEnd}." |
| `canceled`, com acesso | Cancelada | "Cancelada em {canceledAt}. Acesso até {currentPeriodEnd}." |
| `canceled`, `readOnly` | Cancelada | "Assinatura encerrada em {currentPeriodEnd}. A conta está em somente leitura." |
| `past_due` | Pagamento pendente | "Não identificamos o pagamento. A conta está em somente leitura." |

Quando `readOnly`, o card ganha a nota de somente leitura: dá para consultar o histórico e
gerar relatórios, mas não para lançar ou editar.

**Ação "Cancelar assinatura"** (botão destrutivo `outline`), só com `status = active`. Abre
o `ConfirmModal` (sem frase de confirmação): "O acesso continua até {currentPeriodEnd} e
nada mais será cobrado." Sucesso atualiza o cache de `subscription`.

**Cards de plano** (grid 2 colunas, `md:`): Mensal e Anual, cada um com preço (mono, grande),
periodicidade, descrição e CTA:

- Mensal: "R$ 29,00 /mês" · "Cobrança recorrente no cartão de crédito." CTA "Assinar plano mensal".
- Anual: "R$ 290,00 /ano" · "Equivale a 10 meses — 2 meses grátis. Pagamento único." Seletor
  Cartão/PIX (`SegmentedControl`, default PIX). CTA "Assinar plano anual".
- Regras de exibição do CTA:
  - `status ≠ active`: os dois CTAs disponíveis.
  - `active` mensal: card Mensal marcado "Plano atual", **sem CTAs** nos dois cards. Nota:
    "Para mudar de plano, cancele a assinatura atual. Seu acesso segue até o fim do
    período, e o novo plano começa a contar a partir dele."
  - `active` anual: card Anual marcado "Plano atual", CTA vira "Renovar plano anual"
    (empilha +1 ano). Card Mensal sem CTA, com a mesma nota.
- CTA em carregamento: "Abrindo pagamento…" e os dois cards bloqueados. Erro: mensagem da
  API abaixo dos cards.

## Aba Pagamento

Card "Forma de pagamento":

- Fonte: primeiro `Payment` com `status = paid` na 1ª página do histórico (mesma query da
  aba Faturas, `page=1`, `limit=20`).
- Sem pagamento confirmado: estado vazio (ícone + "Nenhuma forma de pagamento cadastrada" +
  botão "Escolher plano", que leva para a aba Plano).
- Com pagamento: ícone (`CreditCard`/`QrCode`), nome ("Cartão de crédito" / "PIX"),
  contexto ("Cobrança recorrente mensal" / "Pagamento anual à vista") e "Último pagamento
  em {paidAt}".
- Nota de segurança: "Os dados de pagamento ficam com a AbacatePay, nossa parceira de
  pagamentos. O Miyrah não armazena número de cartão."
- Troca (decisão 4):
  - Assinatura anual (ou sem assinatura ativa): "Trocar forma de pagamento" leva para a aba
    Plano, onde o Cartão/PIX é escolhido no card Anual.
  - Mensal ativo: texto de orientação (cancelar e assinar de novo), com botão "Ir para Plano".

Card "Formas aceitas": tabela simples (Mensal → Cartão de crédito, recorrente; Anual →
Cartão ou PIX, pagamento único).

## Aba Faturas

`DataTable` paginado (`GET /subscriptions/payments`, `limit` 20, `keepPreviousData`):

| Coluna | Conteúdo |
| --- | --- |
| Data | `paidAt ?? createdAt` (dd/mm/aaaa), mono |
| Descrição | "Plano Mensal"/"Plano Anual" + período `periodStart – periodEnd` em `Tinta-muted` |
| Forma | ícone + "Cartão"/"PIX" |
| Status | badge: Paga · Aguardando pagamento · Falhou · Estornada |
| Valor | `amountCents / 100` em BRL, `numeric`, neutro (decisão 3) |

Estado vazio: ícone `Receipt` + "Nenhuma fatura encontrada". Sem download (a API não expõe
recibo/NFS-e).

## Aviso global (banner)

`SubscriptionBanner` no topo do conteúdo do `ProtectedLayout`, alimentado por
`useSubscription()` (mesma query da tela, `staleTime` padrão). Não aparece na própria
`/subscription`.

- `readOnly`: tom `Saídas` (borda/fundo tint): "Sua conta está em somente leitura. Você
  pode consultar o histórico e gerar relatórios, mas não pode registrar novos lançamentos."
  + link "Regularizar assinatura".
- `trialing` com ≤ 3 dias para `trialEndsAt`: tom `Azul-soft`: "Seu teste grátis termina em
  {n} dias." + link "Escolher plano".
- Demais casos: nada.

**402:** `MutationCache.onError` no `queryClient` — `ApiError` com `code ===
'SUBSCRIPTION_INACTIVE'` invalida `queryKeys.subscription.all`, e o banner aparece na hora.
Os formulários já exibem a `message` da API (pt-BR).

## Arquivos

- `src/types/subscription.ts` (+ barrel) · `ErrorCode` ganha `SUBSCRIPTION_INACTIVE`,
  `SUBSCRIPTION_NOT_FOUND`, `PLAN_METHOD_NOT_ALLOWED`.
- `src/services/subscriptions.ts` (+ barrel) · `src/lib/query-keys.ts` (`subscription`).
- `src/lib/format.ts`: `formatCents`, `daysUntil`.
- `src/features/subscription/`
  - `plans.ts` (preços, rótulos, regras de CTA — puro, testável)
  - `subscription-status.ts` (badge + texto por situação — puro, testável)
  - `hooks/use-subscription.ts`, `hooks/use-payments.ts`, `hooks/use-subscription-mutations.ts`
  - `components/plan-tab.tsx`, `status-card.tsx`, `plan-card.tsx`, `payment-method-tab.tsx`,
    `invoices-tab.tsx`, `payment-status-badge.tsx`, `cancel-subscription-modal.tsx`,
    `subscription-banner.tsx`
  - `subscription-page.tsx`
- `src/app/router.tsx` (rota), `src/components/side-bar/side-bar.tsx` (item),
  `src/app/protected-layout.tsx` (banner), `src/app/query-client.ts` (402).

## Pendências fora deste repo

- Back: impedir um 2º checkout mensal com recorrência ativa (ou cancelar a anterior),
  porque hoje ele cria duas assinaturas na AbacatePay.
- Back: configurar `BILLING_RETURN_URL`/`BILLING_COMPLETION_URL` conforme a decisão 5.
- Wiki: escrever `page_subscription.md` e `api/subscriptions.md` a partir desta spec.

## Critérios de aceite

- `npm run lint`, `npm run test` e `npm run build` passam.
- Testes: `formatCents`/`daysUntil`, regras de `plans.ts` e `subscription-status.ts`, a
  página (abas, CTA por status, cancelar) e o banner.
- Sem hex hardcoded. Strings de UI em pt-BR. Commit:
  `feat: telas de assinatura (specs/subscription.md)`.
