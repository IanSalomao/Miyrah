import { AuthLayout } from 'miyrah'

const wrap: React.CSSProperties = {
  width: 640,
  minHeight: 560,
  background: 'var(--background)',
}

// Moldura das telas públicas: marca "Miyrah" + card central.
// O <Outlet> fica vazio no preview (o conteúdo da página viria do router).
export function Default() {
  return (
    <div style={wrap}>
      <AuthLayout />
    </div>
  )
}
