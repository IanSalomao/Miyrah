// Vitrine decorativa do painel direito das telas de autenticação (templates/auth — Claude Design).
// Transcrição literal do mockup do design (canvas fixo de 940x940, cores em hex, posições em px):
// é uma composição puramente ilustrativa — não precisa ser responsiva nem usar os tokens do tema,
// só precisa ficar idêntica ao design. Some abaixo do breakpoint xl (ver auth-layout.tsx).
// Dados fictícios, sem chamada à API — por isso o container raiz é `aria-hidden`.
// Cards entram com animação escalonada (ordem embaralhada via `delay`) e ampliam 10% no hover
// (classe `auth-showcase-card`, keyframes em src/index.css).
import type { CSSProperties, ReactNode } from 'react'

const RECENT_TRANSACTIONS = [
  { label: 'Dízimo — Culto de domingo', when: 'Hoje, 09:15', amount: 'R$ 350,00', kind: 'income' as const },
  { label: 'Oferta de Gratidão', when: 'Hoje, 08:42', amount: 'R$ 120,00', kind: 'income' as const },
  { label: 'Pagamento conta de luz', when: 'Ontem, 14:30', amount: '− R$ 450,00', kind: 'expense' as const },
]

const CATEGORY_BREAKDOWN = [
  { label: 'Ministérios', color: '#1472e6', value: '40%' },
  { label: 'Administrativo', color: '#5b9df9', value: '25%' },
  { label: 'Estrutura', color: '#a78bfa', value: '20%' },
  { label: 'Outros', color: '#7c3aed', value: '15%' },
]

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']

/**
 * Wrapper de cada card/ícone da vitrine: aplica a animação de entrada escalonada
 * (`delay`, em ms) e o hover de escala 10% + z-index elevado, via a classe
 * `auth-showcase-card` (keyframes e regra `:hover` em src/index.css). O z-index
 * base de empilhamento vem de `z`; no hover ele sobe para ficar acima dos demais.
 */
function ShowcaseElement({
  z,
  delay,
  style,
  children,
}: {
  z: number
  delay: number
  style: CSSProperties
  children: ReactNode
}) {
  return (
    <div
      className="auth-showcase-card"
      style={
        {
          ...style,
          '--as-z': z,
          '--as-delay': `${delay}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  )
}

function HeartBadge({ left, top, z, delay }: { left: number; top: number; z: number; delay: number }) {
  return (
    <ShowcaseElement
      z={z}
      delay={delay}
      style={{
        position: 'absolute',
        left,
        top,
        width: 42,
        height: 42,
        borderRadius: 13,
        background: '#1472e6',
        boxShadow: '0 10px 22px -6px rgba(20,114,230,.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5 8.7 5 10.5 6.5 12 8.5 13.5 6.5 15.3 5 17.5 5 21 5 23.5 8.5 21.5 12.5 19 16.65 12 21 12 21z" />
      </svg>
    </ShowcaseElement>
  )
}

/** Painel decorativo com a "vitrine" do produto — usado só pelo AuthLayout, telas amplas (xl+). */
export function AuthShowcase() {
  return (
    <div
      aria-hidden="true"
      className="relative flex size-full items-center justify-center overflow-hidden bg-linear-to-br from-background via-background to-accent p-2 2xl:p-5"
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', minWidth: 0 }}>
        {/* textura de pontos decorativa */}
        <div
          style={{
            position: 'absolute',
            right: 24,
            bottom: 24,
            width: 220,
            height: 180,
            backgroundImage: 'radial-gradient(#c7d6f0 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px',
            opacity: 0.5,
          }}
        />
        {/* curvas decorativas */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          preserveAspectRatio="none"
          viewBox="0 0 900 940"
          fill="none"
        >
          <path
            d="M180 260 C 360 320 420 480 560 460 C 700 440 760 620 620 720"
            stroke="#ffffff"
            strokeWidth={10}
            strokeLinecap="round"
            opacity={0.8}
          />
          <path
            d="M120 560 C 280 560 340 700 540 680"
            stroke="#ffffff"
            strokeWidth={10}
            strokeLinecap="round"
            opacity={0.7}
          />
        </svg>

        <div
          className="auth-showcase-canvas"
          style={{ position: 'relative', width: 940, height: 940, margin: '0 auto 0' }}
        >
          {/* Card: depoimento superior (Juliana) */}
          <ShowcaseElement
            z={5}
            delay={140}
            style={{
              position: 'absolute',
              left: 24,
              top: 70,
              width: 352,
              background: '#fff',
              border: '1px solid #eef1f6',
              borderRadius: 20,
              boxShadow: '0 24px 50px -24px rgba(20,50,100,.22)',
              padding: '18px 20px',
              display: 'flex',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                flexShrink: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#f0b7a0,#d98b74)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              JM
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: '#48566a', fontWeight: 500 }}>
                Desde que começamos a usar o Miyrah, nossa gestão financeira ficou muito mais transparente e
                organizada.
              </p>
              <p style={{ margin: '10px 0 0', fontSize: 14, fontWeight: 700, color: '#1472e6' }}>Juliana M.</p>
              <p style={{ margin: '1px 0 0', fontSize: 12.5, color: '#9aa7b8', fontWeight: 500 }}>Tesoureira</p>
            </div>
          </ShowcaseElement>
          <HeartBadge left={344} top={44} z={6} delay={350} />

          {/* Card: fluxo de caixa */}
          <ShowcaseElement
            z={4}
            delay={0}
            style={{
              position: 'absolute',
              left: 430,
              top: 28,
              width: 478,
              background: '#fff',
              border: '1px solid #eef1f6',
              borderRadius: 20,
              boxShadow: '0 24px 50px -24px rgba(20,50,100,.2)',
              padding: '20px 22px',
            }}
          >
            <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#1c2b45' }}>Fluxo de caixa</p>
            <div style={{ position: 'relative' }}>
              <svg width="100%" viewBox="0 0 440 160" fill="none" style={{ display: 'block' }}>
                <g stroke="#eef1f6" strokeWidth={1}>
                  <line x1={0} y1={30} x2={440} y2={30} />
                  <line x1={0} y1={70} x2={440} y2={70} />
                  <line x1={0} y1={110} x2={440} y2={110} />
                </g>
                <polyline
                  points="10,120 70,132 130,116 190,128 250,118 310,132 370,122 425,138"
                  fill="none"
                  stroke="#22a06b"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="10,96 70,74 130,86 190,58 250,70 310,48 370,60 425,44"
                  fill="none"
                  stroke="#1472e6"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx={70} cy={74} r={3.5} fill="#1472e6" />
                <circle cx={190} cy={58} r={3.5} fill="#1472e6" />
                <circle cx={310} cy={48} r={3.5} fill="#1472e6" />
                <circle cx={425} cy={44} r={4} fill="#1472e6" />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  right: 6,
                  top: 26,
                  background: '#1472e6',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '5px 10px',
                  borderRadius: 20,
                  boxShadow: '0 8px 16px -4px rgba(20,114,230,.5)',
                }}
              >
                + R$ 15.555,00
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 6,
                  fontSize: 11.5,
                  color: '#9aa7b8',
                  fontWeight: 600,
                  padding: '0 6px',
                }}
              >
                {MONTHS.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </ShowcaseElement>

          {/* Card: resumo financeiro (central, maior) */}
          <ShowcaseElement
            z={7}
            delay={280}
            style={{
              position: 'absolute',
              left: 60,
              top: 236,
              width: 500,
              background: '#fff',
              border: '1px solid #eef1f6',
              borderRadius: 22,
              boxShadow: '0 30px 60px -26px rgba(20,50,100,.26)',
              padding: '24px 26px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#1c2b45' }}>Resumo financeiro</p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: '1px solid #e2e8f0',
                  borderRadius: 9,
                  padding: '6px 11px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: '#48566a',
                }}
              >
                Este mês
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8b98a9"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 22 }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#8b98a9', fontWeight: 600 }}>Entradas</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <span
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#1f9d5f',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    R$ 24.530,00
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#1f9d5f',
                      background: '#e6f6ee',
                      padding: '3px 7px',
                      borderRadius: 6,
                    }}
                  >
                    ↑ 12,5%
                  </span>
                </div>
                <svg width="100%" viewBox="0 0 190 64" style={{ marginTop: 14, display: 'block' }}>
                  <defs>
                    <linearGradient id="authShowcaseGradIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#1f9d5f" stopOpacity={0.22} />
                      <stop offset="1" stopColor="#1f9d5f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,52 L28,48 L56,50 L84,36 L112,40 L140,24 L190,14 L190,64 L0,64 Z"
                    fill="url(#authShowcaseGradIncome)"
                  />
                  <polyline
                    points="0,52 28,48 56,50 84,36 112,40 140,24 190,14"
                    fill="none"
                    stroke="#1f9d5f"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div style={{ width: 1, background: '#eef1f6' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#8b98a9', fontWeight: 600 }}>Saídas</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <span
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#e0524d',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    R$ 8.975,00
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#e0524d',
                      background: '#fceceb',
                      padding: '3px 7px',
                      borderRadius: 6,
                    }}
                  >
                    ↓ 8,3%
                  </span>
                </div>
                <svg width="100%" viewBox="0 0 190 64" style={{ marginTop: 14, display: 'block' }}>
                  <defs>
                    <linearGradient id="authShowcaseGradExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#e0524d" stopOpacity={0.2} />
                      <stop offset="1" stopColor="#e0524d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 L28,44 L56,34 L84,46 L112,38 L140,26 L190,18 L190,64 L0,64 Z"
                    fill="url(#authShowcaseGradExpense)"
                  />
                  <polyline
                    points="0,40 28,44 56,34 84,46 112,38 140,26 190,18"
                    fill="none"
                    stroke="#e0524d"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </ShowcaseElement>

          {/* Card: despesas por categoria */}
          <ShowcaseElement
            z={6}
            delay={490}
            style={{
              position: 'absolute',
              left: 587,
              top: 327,
              width: 322,
              background: '#fff',
              border: '1px solid #eef1f6',
              borderRadius: 20,
              boxShadow: '0 26px 54px -24px rgba(20,50,100,.22)',
              padding: '20px 22px',
            }}
          >
            <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1c2b45' }}>
              Despesas por categoria
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <svg width="118" height="118" viewBox="0 0 160 160" style={{ flexShrink: 0 }}>
                <g fill="none" strokeWidth={24}>
                  <circle
                    cx={80}
                    cy={80}
                    r={60}
                    stroke="#1472e6"
                    strokeDasharray="150.8 226.4"
                    transform="rotate(-90 80 80)"
                  />
                  <circle
                    cx={80}
                    cy={80}
                    r={60}
                    stroke="#5b9df9"
                    strokeDasharray="94.2 283"
                    transform="rotate(54 80 80)"
                  />
                  <circle
                    cx={80}
                    cy={80}
                    r={60}
                    stroke="#a78bfa"
                    strokeDasharray="75.4 301.8"
                    transform="rotate(144 80 80)"
                  />
                  <circle
                    cx={80}
                    cy={80}
                    r={60}
                    stroke="#7c3aed"
                    strokeDasharray="56.5 320.7"
                    transform="rotate(216 80 80)"
                  />
                </g>
              </svg>
              <div style={{ flex: 1, display: 'grid', gap: 11 }}>
                {CATEGORY_BREAKDOWN.map((item) => (
                  <div
                    key={item.label}
                    style={{ display: 'flex', alignItems: 'center', fontSize: 12.5, fontWeight: 600, color: '#48566a' }}
                  >
                    <span
                      style={{ width: 9, height: 9, borderRadius: '50%', background: item.color, marginRight: 8 }}
                    />
                    {item.label}
                    <span style={{ marginLeft: 'auto', color: '#1c2b45', fontWeight: 700 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ShowcaseElement>

          {/* Card: saldo atual */}
          <ShowcaseElement
            z={8}
            delay={70}
            style={{
              position: 'absolute',
              left: 3,
              top: 519,
              width: 'auto',
              background: '#fff',
              border: '1px solid #eef1f6',
              borderRadius: 20,
              boxShadow: '0 26px 54px -24px rgba(20,50,100,.24)',
              padding: 22,
              height: 'auto',
            }}
          >
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1c2b45' }}>Saldo atual</p>
            <p
              style={{
                margin: '12px 0 0',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 27,
                fontWeight: 800,
                color: '#1472e6',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-.01em',
              }}
            >
              R$ 15.555,00
            </p>
          </ShowcaseElement>

          {/* Card: depoimento inferior (André) */}
          <ShowcaseElement
            z={7}
            delay={630}
            style={{
              position: 'absolute',
              left: 520,
              top: 706,
              width: 388,
              background: '#fff',
              border: '1px solid #eef1f6',
              borderRadius: 20,
              boxShadow: '0 24px 50px -24px rgba(20,50,100,.22)',
              padding: '18px 20px',
              display: 'flex',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                flexShrink: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#7fa8d8,#4d79b0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              AS
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.5, color: '#48566a', fontWeight: 500 }}>
                Relatórios claros, gráficos úteis e tudo em um só lugar. O Miyrah transformou a forma como cuidamos
                dos recursos da nossa igreja.
              </p>
              <p style={{ margin: '10px 0 0', fontSize: 14, fontWeight: 700, color: '#1472e6' }}>André S.</p>
              <p style={{ margin: '1px 0 0', fontSize: 12.5, color: '#9aa7b8', fontWeight: 500 }}>Pastor</p>
            </div>
          </ShowcaseElement>
          <HeartBadge left={868} top={684} z={7} delay={770} />

          {/* Card: entradas vs saídas */}
          <ShowcaseElement
            z={6}
            delay={210}
            style={{
              position: 'absolute',
              left: 321,
              top: 453,
              width: 372,
              background: '#fff',
              border: '1px solid #eef1f6',
              borderRadius: 20,
              boxShadow: '0 24px 50px -24px rgba(20,50,100,.2)',
              padding: '20px 22px',
            }}
          >
            <p style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#1c2b45' }}>Entradas vs Saídas</p>
            <div style={{ display: 'flex', gap: 18, fontSize: 11.5, fontWeight: 600, color: '#48566a', marginBottom: 14 }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: '#1f9d5f', marginRight: 6 }} />
                Entradas
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: '#e0524d', marginRight: 6 }} />
                Saídas
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <svg width="100%" viewBox="0 0 340 130" style={{ display: 'block' }}>
                <g>
                  <rect x={14} y={60} width={11} height={60} rx={3} fill="#1f9d5f" />
                  <rect x={27} y={82} width={11} height={38} rx={3} fill="#e0524d" />
                  <rect x={60} y={48} width={11} height={72} rx={3} fill="#1f9d5f" />
                  <rect x={73} y={76} width={11} height={44} rx={3} fill="#e0524d" />
                  <rect x={106} y={66} width={11} height={54} rx={3} fill="#1f9d5f" />
                  <rect x={119} y={88} width={11} height={32} rx={3} fill="#e0524d" />
                  <rect x={152} y={40} width={11} height={80} rx={3} fill="#1f9d5f" />
                  <rect x={165} y={70} width={11} height={50} rx={3} fill="#e0524d" />
                  <rect x={198} y={54} width={11} height={66} rx={3} fill="#1f9d5f" />
                  <rect x={211} y={84} width={11} height={36} rx={3} fill="#e0524d" />
                  <rect x={244} y={34} width={11} height={86} rx={3} fill="#1f9d5f" />
                  <rect x={257} y={72} width={11} height={48} rx={3} fill="#e0524d" />
                  <rect x={290} y={58} width={11} height={62} rx={3} fill="#1f9d5f" />
                  <rect x={303} y={90} width={11} height={30} rx={3} fill="#e0524d" />
                </g>
              </svg>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 6,
                  fontSize: 11,
                  color: '#9aa7b8',
                  fontWeight: 600,
                  padding: '0 4px',
                }}
              >
                {MONTHS.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
              {/* tooltip Junho */}
              <div
                style={{
                  position: 'absolute',
                  top: 25,
                  left: 229,
                  background: '#fff',
                  border: '1px solid #eef1f6',
                  borderRadius: 12,
                  boxShadow: '0 14px 30px -12px rgba(20,50,100,.3)',
                  padding: '11px 13px',
                  fontSize: 11.5,
                  width: 132,
                  zIndex: 2,
                }}
              >
                <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#1c2b45' }}>Junho</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#48566a', fontWeight: 600 }}>
                  <span>Entradas</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', color: '#1f9d5f' }}>R$ 18.720</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 5,
                    color: '#48566a',
                    fontWeight: 600,
                  }}
                >
                  <span>Saídas</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', color: '#e0524d' }}>R$ 7.210</span>
                </div>
              </div>
            </div>
          </ShowcaseElement>

          {/* Card: transações recentes */}
          <ShowcaseElement
            z={7}
            delay={560}
            style={{
              position: 'absolute',
              left: 40,
              top: 620,
              width: 334,
              background: '#fff',
              border: '1px solid #eef1f6',
              borderRadius: 20,
              boxShadow: '0 26px 54px -24px rgba(20,50,100,.22)',
              padding: '20px 22px',
            }}
          >
            <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#1c2b45' }}>Transações recentes</p>
            <div style={{ display: 'grid', gap: 16 }}>
              {RECENT_TRANSACTIONS.map((transaction) => (
                <div key={transaction.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: transaction.kind === 'income' ? '#e6f6ee' : '#fceceb',
                      color: transaction.kind === 'income' ? '#1f9d5f' : '#e0524d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {transaction.kind === 'income' ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 5v14" />
                        <path d="M19 12l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: '#1c2b45' }}>
                      {transaction.label}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#9aa7b8', fontWeight: 500 }}>
                      {transaction.when}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: 13,
                      fontWeight: 700,
                      color: transaction.kind === 'income' ? '#1f9d5f' : '#e0524d',
                    }}
                  >
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
            <p style={{ margin: '18px 0 0', textAlign: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1472e6' }}>Ver todas as transações</span>
            </p>
          </ShowcaseElement>

          {/* ícone flutuante: gráfico de barras */}
          <ShowcaseElement
            z={8}
            delay={420}
            style={{
              position: 'absolute',
              left: 726,
              top: 534,
              width: 48,
              height: 48,
              borderRadius: 15,
              background: '#1472e6',
              boxShadow: '0 14px 28px -8px rgba(20,114,230,.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
              <rect x={4} y={12} width={4} height={8} rx={1} />
              <rect x={10} y={7} width={4} height={13} rx={1} />
              <rect x={16} y={4} width={4} height={16} rx={1} />
            </svg>
          </ShowcaseElement>

          {/* ícone flutuante: fatia de gráfico de pizza, à esquerda do resumo */}
          <ShowcaseElement
            z={7}
            delay={700}
            style={{
              position: 'absolute',
              left: 24,
              top: 421,
              width: 56,
              height: 56,
              borderRadius: 16,
              background: '#eaf1fb',
              border: '1px solid #dbe7fb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#1472e6">
              <path d="M13 2v9h9a9 9 0 1 0-9-9z" opacity={0.5} />
              <path d="M11 4a9 9 0 1 0 9 9h-9V4z" />
            </svg>
          </ShowcaseElement>
        </div>
      </div>
    </div>
  )
}
