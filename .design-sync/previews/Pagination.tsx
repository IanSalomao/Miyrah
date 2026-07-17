import { Pagination } from 'miyrah'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  maxWidth: 640,
}

const noop = () => {}

// Primeira página: "Anterior" desabilitado, com seletor de itens por página.
export function FirstPage() {
  return (
    <div style={wrap}>
      <Pagination
        page={1}
        limit={20}
        total={143}
        totalPages={8}
        onPageChange={noop}
        onLimitChange={noop}
      />
    </div>
  )
}

// Página intermediária: ambos os botões habilitados.
export function MiddlePage() {
  return (
    <div style={wrap}>
      <Pagination
        page={4}
        limit={20}
        total={143}
        totalPages={8}
        onPageChange={noop}
        onLimitChange={noop}
      />
    </div>
  )
}

// Última página, sem seletor de limite (apenas contagem de registros).
export function LastPage() {
  return (
    <div style={wrap}>
      <Pagination page={8} limit={20} total={143} totalPages={8} onPageChange={noop} />
    </div>
  )
}
