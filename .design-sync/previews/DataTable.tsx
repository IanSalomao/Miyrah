import { DataTable } from 'miyrah'
import { Pencil, Trash2, Inbox } from 'lucide-react'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
function signed(value: number) {
  const magnitude = brl.format(Math.abs(value))
  if (value > 0) return `+${magnitude}`
  if (value < 0) return `−${magnitude}`
  return magnitude
}

interface Transaction {
  id: string
  date: string
  description: string
  category: string
  value: number
}

const transactions: Transaction[] = [
  { id: '1', date: '14/07/2026', description: 'Dízimo — culto de domingo', category: 'Dízimos', value: 2450 },
  { id: '2', date: '13/07/2026', description: 'Oferta de gratidão', category: 'Ofertas', value: 830.5 },
  { id: '3', date: '11/07/2026', description: 'Aluguel do salão', category: 'Aluguel', value: -3200 },
  { id: '4', date: '10/07/2026', description: 'Doação para missões', category: 'Doações', value: 1500 },
  { id: '5', date: '08/07/2026', description: 'Conta de energia elétrica', category: 'Contas de consumo', value: -486.72 },
]

const columns = [
  { id: 'date', header: 'Data', cell: (r: Transaction) => r.date },
  { id: 'description', header: 'Descrição', cell: (r: Transaction) => r.description },
  {
    id: 'category',
    header: 'Categoria',
    cell: (r: Transaction) => r.category,
  },
  {
    id: 'value',
    header: 'Valor',
    numeric: true,
    cell: (r: Transaction) => (
      <span style={{ color: r.value < 0 ? 'var(--expense)' : 'var(--income)' }}>
        {signed(r.value)}
      </span>
    ),
  },
]

const rowActions = [
  { label: 'Editar', icon: Pencil, onClick: () => {} },
  { label: 'Excluir', icon: Trash2, onClick: () => {}, variant: 'destructive' as const },
]

// Tabela de transações com colunas tipadas, ações por linha e paginação embutida.
export function WithData() {
  return (
    <div style={wrap}>
      <DataTable
        columns={columns}
        data={transactions}
        getRowId={(r: Transaction) => r.id}
        rowActions={rowActions}
        emptyState={{ title: 'Nenhuma transação encontrada' }}
        pagination={{
          page: 1,
          limit: 20,
          total: 143,
          totalPages: 8,
          onPageChange: () => {},
          onLimitChange: () => {},
        }}
      />
    </div>
  )
}

// Estado vazio: ícone, mensagem e ação principal para criar o primeiro registro.
export function Empty() {
  return (
    <div style={wrap}>
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(r: Transaction) => r.id}
        emptyState={{
          icon: Inbox,
          title: 'Nenhuma transação encontrada',
          actionLabel: 'Nova transação',
          onAction: () => {},
        }}
      />
    </div>
  )
}
