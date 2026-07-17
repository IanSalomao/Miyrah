import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from 'miyrah'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
}

const mono: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  textAlign: 'right',
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
function signed(value: number) {
  const magnitude = brl.format(Math.abs(value))
  if (value > 0) return `+${magnitude}`
  if (value < 0) return `−${magnitude}`
  return magnitude
}

const rows = [
  { date: '14/07/2026', description: 'Dízimo — culto de domingo', category: 'Dízimos', value: 2450 },
  { date: '13/07/2026', description: 'Oferta de gratidão', category: 'Ofertas', value: 830.5 },
  { date: '11/07/2026', description: 'Aluguel do salão', category: 'Aluguel', value: -3200 },
  { date: '10/07/2026', description: 'Doação missões', category: 'Doações', value: 1500 },
  { date: '08/07/2026', description: 'Conta de energia', category: 'Contas de consumo', value: -486.72 },
]

// Extrato de transações: data, descrição, categoria e valor com sinal e cor semântica.
export function Transactions() {
  return (
    <div style={wrap}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.description}>
              <TableCell style={{ fontFamily: '"JetBrains Mono", monospace' }}>{r.date}</TableCell>
              <TableCell>{r.description}</TableCell>
              <TableCell style={{ color: 'var(--muted-foreground)' }}>{r.category}</TableCell>
              <TableCell
                style={{ ...mono, color: r.value < 0 ? 'var(--expense)' : 'var(--income)' }}
              >
                {signed(r.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Tabela com rodapé de totais (saldo do período).
export function WithTotals() {
  const total = rows.reduce((acc, r) => acc + r.value, 0)
  return (
    <div style={wrap}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead style={{ textAlign: 'right' }}>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.slice(0, 3).map((r) => (
            <TableRow key={r.description}>
              <TableCell>{r.description}</TableCell>
              <TableCell style={{ color: 'var(--muted-foreground)' }}>{r.category}</TableCell>
              <TableCell
                style={{ ...mono, color: r.value < 0 ? 'var(--expense)' : 'var(--income)' }}
              >
                {signed(r.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Saldo do período</TableCell>
            <TableCell
              style={{ ...mono, color: total < 0 ? 'var(--expense)' : 'var(--income)' }}
            >
              {signed(total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
