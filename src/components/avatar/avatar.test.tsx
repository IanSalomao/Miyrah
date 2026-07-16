import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemberAvatar } from './avatar'

describe('MemberAvatar', () => {
  it('deriva as iniciais do primeiro e último nome', () => {
    render(<MemberAvatar name="João da Silva" />)
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('deriva iniciais de nome único', () => {
    render(<MemberAvatar name="Maria" />)
    expect(screen.getByText('MA')).toBeInTheDocument()
  })

  it('estado default expõe o nome via aria-label', () => {
    render(<MemberAvatar name="João da Silva" />)
    expect(screen.getByLabelText('João da Silva')).toBeInTheDocument()
  })

  it('estado "vínculo excluído" mantém as iniciais com indicação visual', () => {
    render(<MemberAvatar name="João da Silva" deleted />)
    expect(screen.getByText('JS')).toBeInTheDocument()
    const avatar = screen.getByLabelText('João da Silva (excluído)')
    expect(avatar).toHaveClass('grayscale')
  })
})
