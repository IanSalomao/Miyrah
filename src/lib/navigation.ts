// Navegação para fora da SPA (ex.: checkout hospedado do gateway de pagamento).
// Isolado num módulo próprio para os testes poderem substituir o redirecionamento.

export function redirectToExternal(url: string): void {
  window.location.assign(url)
}
