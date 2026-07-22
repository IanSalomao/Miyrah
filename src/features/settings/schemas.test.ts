import { describe, expect, it } from 'vitest'
import { changePasswordSchema, profileFormSchema, toUpdateAccountPayload } from './schemas'

const validProfile = {
  name: 'Igreja Batista Central',
  email: 'contato@ibcentral.org.br',
  phone: '(11) 3255-4700',
  cnpj: '12.345.678/0001-90',
  denomination: 'Batista',
}

describe('profileFormSchema', () => {
  it('aceita um payload válido', () => {
    expect(profileFormSchema.safeParse(validProfile).success).toBe(true)
  })

  it('exige o nome da igreja', () => {
    expect(profileFormSchema.safeParse({ ...validProfile, name: '' }).success).toBe(false)
  })

  it('exige um e-mail válido', () => {
    expect(profileFormSchema.safeParse({ ...validProfile, email: 'invalido' }).success).toBe(false)
  })

  it('cnpj é opcional', () => {
    expect(profileFormSchema.safeParse({ ...validProfile, cnpj: '' }).success).toBe(true)
    expect(
      profileFormSchema.safeParse({ ...validProfile, cnpj: undefined }).success,
    ).toBe(true)
  })

  it('rejeita cnpj fora do formato 00.000.000/0000-00', () => {
    expect(profileFormSchema.safeParse({ ...validProfile, cnpj: '12345678000190' }).success).toBe(
      false,
    )
  })

  it('aceita cnpj alfanumérico (formato 2026)', () => {
    expect(
      profileFormSchema.safeParse({ ...validProfile, cnpj: '12.ABC.345/01DE-35' }).success,
    ).toBe(true)
  })

  it('denominação é opcional', () => {
    expect(
      profileFormSchema.safeParse({ ...validProfile, denomination: undefined }).success,
    ).toBe(true)
  })
})

describe('toUpdateAccountPayload', () => {
  it('remove a máscara do telefone e mantém o cnpj formatado', () => {
    const payload = toUpdateAccountPayload(profileFormSchema.parse(validProfile))
    expect(payload.phone).toBe('1132554700')
    expect(payload.cnpj).toBe('12.345.678/0001-90')
  })

  it('converte campos opcionais vazios em null', () => {
    const payload = toUpdateAccountPayload(
      profileFormSchema.parse({ ...validProfile, phone: '', cnpj: '', denomination: '' }),
    )
    expect(payload.phone).toBeNull()
    expect(payload.cnpj).toBeNull()
    expect(payload.denomination).toBeNull()
  })
})

describe('changePasswordSchema', () => {
  const validPassword = {
    currentPassword: 'senhaAtual123',
    newPassword: 'novaSenhaSegura456',
    confirmNewPassword: 'novaSenhaSegura456',
  }

  it('aceita um payload válido', () => {
    expect(changePasswordSchema.safeParse(validPassword).success).toBe(true)
  })

  it('exige a senha atual', () => {
    expect(changePasswordSchema.safeParse({ ...validPassword, currentPassword: '' }).success).toBe(
      false,
    )
  })

  it('exige nova senha com no mínimo 8 caracteres', () => {
    expect(
      changePasswordSchema.safeParse({
        ...validPassword,
        newPassword: '123',
        confirmNewPassword: '123',
      }).success,
    ).toBe(false)
  })

  it('rejeita quando a confirmação não coincide com a nova senha', () => {
    const result = changePasswordSchema.safeParse({
      ...validPassword,
      confirmNewPassword: 'outraSenha',
    })
    expect(result.success).toBe(false)
  })
})
