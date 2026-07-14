// Ministérios — wiki/api/ministries.md, wiki/database/church_ministries.md
// Obs.: a listagem de ministérios NÃO é paginada (retorna items sem meta).

export interface MinistryResponsible {
  id: string
  name: string
}

export interface Ministry {
  id: string
  name: string
  description: string | null
  responsible: MinistryResponsible | null
  createdAt: string
  updatedAt: string
}

/** Referência aninhada de ministério (em transações). */
export interface MinistryRef {
  id: string
  name: string
  deleted: boolean
}

export interface CreateMinistryPayload {
  name: string
  description?: string | null
  responsibleId?: string | null
}

export interface UpdateMinistryPayload {
  name?: string
  description?: string | null
  responsibleId?: string | null // null remove o responsável
}
