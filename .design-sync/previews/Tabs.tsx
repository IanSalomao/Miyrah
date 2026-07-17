import { Tabs, TabsList, TabsTrigger, TabsContent, Separator } from 'miyrah'

const wrap: React.CSSProperties = {
  padding: 24,
  background: 'var(--background)',
  minHeight: 260,
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  fontSize: 14,
}

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontWeight: 600 }

function Line({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <>
      <div style={rowStyle}>
        <span>{label}</span>
        <span style={{ ...mono, color }}>{value}</span>
      </div>
      <Separator />
    </>
  )
}

// Abas de filtro por tipo de transação (Todas / Entradas / Saídas).
export function TransactionFilter() {
  return (
    <div style={wrap}>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="income">Entradas</TabsTrigger>
          <TabsTrigger value="expense">Saídas</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Line label="Dízimo — Ana Beatriz" value="+ R$ 350,00" color="var(--income)" />
          <Line label="Aluguel do salão" value="− R$ 1.800,00" color="var(--expense)" />
          <Line label="Oferta — culto de domingo" value="+ R$ 920,00" color="var(--income)" />
        </TabsContent>
        <TabsContent value="income">
          <Line label="Dízimo — Ana Beatriz" value="+ R$ 350,00" color="var(--income)" />
          <Line label="Oferta — culto de domingo" value="+ R$ 920,00" color="var(--income)" />
        </TabsContent>
        <TabsContent value="expense">
          <Line label="Aluguel do salão" value="− R$ 1.800,00" color="var(--expense)" />
          <Line label="Conta de energia" value="− R$ 435,70" color="var(--expense)" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Abas de navegação nas configurações (aba Entradas selecionada).
export function SettingsNav() {
  return (
    <div style={wrap}>
      <Tabs defaultValue="income">
        <TabsList>
          <TabsTrigger value="income">Entradas</TabsTrigger>
          <TabsTrigger value="expense">Saídas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <Line label="Dízimos" value="12 categorias" />
          <Line label="Ofertas" value="4 categorias" />
          <Line label="Doações" value="3 categorias" />
        </TabsContent>
        <TabsContent value="expense">
          <Line label="Aluguel" value="1 categoria" />
        </TabsContent>
        <TabsContent value="all">
          <Line label="Total de categorias" value="20" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
