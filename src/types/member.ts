// Membros — wiki/api/members.md, wiki/database/church_members.md

export interface Member {
  id: string
  name: string
  birthDate: string | null // YYYY-MM-DD
  baptismDate: string | null // YYYY-MM-DD
  email: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
}

/** Referência aninhada de membro (em transações). Mantém o nome mesmo se excluído. */
export interface MemberRef {
  id: string
  name: string
  deleted: boolean
}

export interface CreateMemberPayload {
  name: string
  birthDate?: string | null
  baptismDate?: string | null
  email?: string | null
  phone?: string | null
}

export type UpdateMemberPayload = Partial<CreateMemberPayload>

export interface MembersQuery {
  search?: string
  page?: number
  limit?: number
}
