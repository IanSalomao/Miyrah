import { Button } from 'miyrah'
import { Plus, Trash2, Download, Search } from 'lucide-react'

const wrap: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
  padding: 24,
  background: 'var(--background)',
}

// Todas as variantes visuais do botão.
export function Variants() {
  return (
    <div style={wrap}>
      <Button variant="default">Salvar transação</Button>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="outline">Filtrar</Button>
      <Button variant="ghost">Ver detalhes</Button>
      <Button variant="destructive">Excluir</Button>
      <Button variant="link">Esqueci a senha</Button>
    </div>
  )
}

// Escala de tamanhos, do menor ao maior.
export function Sizes() {
  return (
    <div style={wrap}>
      <Button size="xs">Extra pequeno</Button>
      <Button size="sm">Pequeno</Button>
      <Button size="default">Padrão</Button>
      <Button size="lg">Grande</Button>
    </div>
  )
}

// Botões com ícone (ações comuns do app).
export function WithIcons() {
  return (
    <div style={wrap}>
      <Button variant="default">
        <Plus data-icon="inline-start" />
        Novo lançamento
      </Button>
      <Button variant="outline">
        <Download data-icon="inline-start" />
        Exportar relatório
      </Button>
      <Button variant="destructive">
        <Trash2 data-icon="inline-start" />
        Excluir membro
      </Button>
      <Button variant="secondary" size="icon" aria-label="Buscar">
        <Search />
      </Button>
    </div>
  )
}

// Estados desabilitados.
export function Disabled() {
  return (
    <div style={wrap}>
      <Button variant="default" disabled>
        Salvar transação
      </Button>
      <Button variant="outline" disabled>
        Filtrar
      </Button>
      <Button variant="destructive" disabled>
        Excluir
      </Button>
    </div>
  )
}
