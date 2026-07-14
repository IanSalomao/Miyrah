// Banco em memória do MSW — seed realista em pt-BR para os domínios CRUD
// (church, members, ministries, categories, transactions, reports).
// Dashboard e Relatórios usam valores estáticos nos handlers (decisão do projeto),
// então não dependem deste seed para agregação.

import type { TransactionType } from '@/types'

// ---- Tipos internos (registros com campos de infraestrutura) --------------

export interface ChurchRecord {
  id: string
  name: string
  email: string
  password: string
  phone: string | null
  cnpj: string | null
  denomination: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface MemberRecord {
  id: string
  name: string
  birthDate: string | null
  baptismDate: string | null
  email: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface MinistryRecord {
  id: string
  name: string
  description: string | null
  responsibleId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CategoryRecord {
  id: string
  name: string
  description: string | null
  type: TransactionType
  color: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface TransactionRecord {
  id: string
  type: TransactionType
  value: number // COM sinal (positivo = entrada, negativo = saída)
  date: string // YYYY-MM-DD
  description: string | null
  categoryId: string
  memberId: string | null
  ministryId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ReportRecord {
  id: string
  generatedAt: string
}

export interface Db {
  church: ChurchRecord
  members: MemberRecord[]
  ministries: MinistryRecord[]
  categories: CategoryRecord[]
  transactions: TransactionRecord[]
  reports: ReportRecord[]
}

// ---- Utilidades -----------------------------------------------------------

/** PRNG determinístico (mulberry32) — dados estáveis entre execuções. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const isoDateTime = (d: Date): string => d.toISOString()

const pad = (n: number, len = 2) => String(n).padStart(len, '0')

// ---- Seed -----------------------------------------------------------------

/** Credenciais de desenvolvimento (login na tela /login). */
export const DEV_CREDENTIALS = {
  email: 'contato@igrejacentral.com.br',
  password: 'senhaSegura123',
}

const MEMBER_NAMES = [
  'João da Silva',
  'Maria Oliveira',
  'Pedro Santos',
  'Ana Souza',
  'Lucas Pereira',
  'Mariana Costa',
  'Paulo Rodrigues',
  'Juliana Almeida',
  'Carlos Ferreira',
  'Fernanda Lima',
  'Rafael Gomes',
  'Beatriz Ribeiro',
  'Marcos Carvalho',
  'Patrícia Martins',
  'Gabriel Araújo',
  'Camila Barbosa',
  'Rodrigo Nascimento',
  'Larissa Rocha',
  'Tiago Cardoso',
  'Vanessa Moreira',
  'Bruno Teixeira',
  'Aline Correia',
  'Felipe Dias',
  'Débora Freitas',
]

interface CategorySeed {
  name: string
  type: TransactionType
  color: string
}

const CATEGORY_SEEDS: CategorySeed[] = [
  { name: 'Dízimos', type: 'income', color: '#1E7A46' },
  { name: 'Ofertas', type: 'income', color: '#2E9E5B' },
  { name: 'Doações', type: 'income', color: '#3FB870' },
  { name: 'Campanhas', type: 'income', color: '#6FCF97' },
  { name: 'Aluguel', type: 'expense', color: '#A6342A' },
  { name: 'Energia elétrica', type: 'expense', color: '#C0453A' },
  { name: 'Água', type: 'expense', color: '#D66A60' },
  { name: 'Salários', type: 'expense', color: '#8A2A22' },
  { name: 'Manutenção', type: 'expense', color: '#B5651D' },
  { name: 'Missões', type: 'expense', color: '#7D5BA6' },
]

const MINISTRY_SEEDS: { name: string; description: string | null }[] = [
  { name: 'Louvor', description: 'Equipe de música e adoração' },
  { name: 'Infantil', description: 'Ministério das crianças' },
  { name: 'Jovens', description: 'Ministério de jovens e adolescentes' },
  { name: 'Ação Social', description: 'Assistência à comunidade' },
  { name: 'Diaconato', description: null },
  { name: 'Missões', description: 'Apoio a missionários' },
]

function buildSeed(): Db {
  const rand = mulberry32(20260713)
  const now = new Date()

  const church: ChurchRecord = {
    id: 'church-01',
    name: 'Igreja Batista Central',
    email: DEV_CREDENTIALS.email,
    password: DEV_CREDENTIALS.password,
    phone: '11999990000',
    cnpj: '12.345.678/0001-90',
    denomination: 'Batista',
    createdAt: isoDateTime(new Date(now.getFullYear() - 1, 0, 15)),
    updatedAt: isoDateTime(now),
    deletedAt: null,
  }

  const members: MemberRecord[] = MEMBER_NAMES.map((name, i) => {
    const createdAt = isoDateTime(new Date(now.getFullYear() - 1, i % 12, 5))
    return {
      id: `member-${pad(i + 1)}`,
      name,
      birthDate: `${1970 + (i % 35)}-${pad((i % 12) + 1)}-${pad((i % 27) + 1)}`,
      baptismDate: i % 3 === 0 ? `${2015 + (i % 8)}-${pad((i % 12) + 1)}-15` : null,
      email: i % 2 === 0 ? `${name.split(' ')[0].toLowerCase()}@email.com` : null,
      phone: i % 2 === 1 ? `1198${pad(i, 3)}${pad(i * 7, 4).slice(0, 4)}` : null,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    }
  })

  const ministries: MinistryRecord[] = MINISTRY_SEEDS.map((m, i) => {
    const createdAt = isoDateTime(new Date(now.getFullYear() - 1, i, 10))
    return {
      id: `ministry-${pad(i + 1)}`,
      name: m.name,
      description: m.description,
      // Alguns ministérios têm responsável, outros não.
      responsibleId: i % 2 === 0 ? members[i]?.id ?? null : null,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    }
  })

  const categories: CategoryRecord[] = CATEGORY_SEEDS.map((c, i) => {
    const createdAt = isoDateTime(new Date(now.getFullYear() - 1, 0, 20))
    return {
      id: `category-${pad(i + 1)}`,
      name: c.name,
      description: null,
      type: c.type,
      color: c.color,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    }
  })

  const incomeCategories = categories.filter((c) => c.type === 'income')
  const expenseCategories = categories.filter((c) => c.type === 'expense')

  const transactions: TransactionRecord[] = []
  let txCounter = 0

  // Gera transações para os últimos 6 meses (inclui o mês atual).
  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
    const ref = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
    const year = ref.getFullYear()
    const month = ref.getMonth()

    const incomeCount = 6 + Math.floor(rand() * 4)
    const expenseCount = 5 + Math.floor(rand() * 4)

    for (let i = 0; i < incomeCount; i++) {
      const cat = incomeCategories[Math.floor(rand() * incomeCategories.length)]
      const day = 1 + Math.floor(rand() * 27)
      const amount = Math.round((50 + rand() * 2000) * 100) / 100
      const withMember = rand() > 0.4
      txCounter++
      const createdAt = isoDateTime(new Date(year, month, day, 9, 0))
      transactions.push({
        id: `transaction-${pad(txCounter, 4)}`,
        type: 'income',
        value: amount, // entrada = positivo
        date: `${year}-${pad(month + 1)}-${pad(day)}`,
        description: cat.name === 'Dízimos' ? 'Dízimo do mês' : `${cat.name}`,
        categoryId: cat.id,
        memberId: withMember ? members[Math.floor(rand() * members.length)].id : null,
        ministryId: rand() > 0.7 ? ministries[Math.floor(rand() * ministries.length)].id : null,
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
      })
    }

    for (let i = 0; i < expenseCount; i++) {
      const cat = expenseCategories[Math.floor(rand() * expenseCategories.length)]
      const day = 1 + Math.floor(rand() * 27)
      const amount = Math.round((80 + rand() * 3000) * 100) / 100
      txCounter++
      const createdAt = isoDateTime(new Date(year, month, day, 14, 0))
      transactions.push({
        id: `transaction-${pad(txCounter, 4)}`,
        type: 'expense',
        value: -amount, // saída = negativo
        date: `${year}-${pad(month + 1)}-${pad(day)}`,
        description: cat.name,
        categoryId: cat.id,
        memberId: null,
        ministryId: rand() > 0.6 ? ministries[Math.floor(rand() * ministries.length)].id : null,
        createdAt,
        updatedAt: createdAt,
        deletedAt: null,
      })
    }
  }

  const reports: ReportRecord[] = Array.from({ length: 3 }, (_, i) => ({
    id: `report-${pad(i + 1)}`,
    generatedAt: isoDateTime(new Date(now.getFullYear(), now.getMonth() - i, 2, 10, 30)),
  }))

  return { church, members, ministries, categories, transactions, reports }
}

// Store mutável usado pelos handlers. `resetDb()` restaura o seed (útil em testes).
export let db: Db = buildSeed()

export function resetDb(): void {
  db = buildSeed()
}
