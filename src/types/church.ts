// Conta/Igreja (tenant) — wiki/api/account.md, wiki/database/church.md

export interface Church {
  id: string
  name: string
  email: string
  phone: string | null
  cnpj: string | null
  denomination: string | null
  createdAt: string
  updatedAt: string
}

/** cnpj e denomination só são definidos aqui (não no cadastro). */
export interface UpdateAccountPayload {
  name?: string
  email?: string
  phone?: string | null
  cnpj?: string | null
  denomination?: string | null
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface DeleteAccountPayload {
  currentPassword: string
  confirmationPhrase: string
}
