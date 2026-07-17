import { SideBar } from 'miyrah'

const wrap: React.CSSProperties = {
  display: 'flex',
  height: 620,
  background: 'var(--background)',
}

// Navegação lateral completa: marca, itens (Início, Dashboard, Transações,
// Membros, Ministérios, Categorias, Relatórios, Configurações) e "Sair".
// O item ativo reflete a rota inicial do provider (/dashboard).
//
// OBS.: o SideBar chama useAuth() e lança fora de <AuthProvider>. O provider
// global dos previews (.design-sync/provider.tsx) só injeta Router + Query, então
// esta célula renderiza em branco. Não dá para corrigir só pelo preview: envolver
// aqui num AuthContext.Provider importado cria uma segunda instância de contexto
// (o bundle já traz a sua), que o useAuth do bundle não enxerga. Precisa de fix do
// orquestrador — ver .design-sync/learnings/wave-charts.md.
export function Default() {
  return (
    <div style={wrap}>
      <SideBar />
    </div>
  )
}
