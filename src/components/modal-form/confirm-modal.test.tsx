import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmModal } from './confirm-modal'

describe('ConfirmModal', () => {
  it('sem frase de confirmação: botão destrutivo já vem habilitado', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmModal
        open
        onOpenChange={() => {}}
        title="Excluir membro"
        description="Esta ação não pode ser desfeita."
        onConfirm={onConfirm}
      />,
    )
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeEnabled()
  })

  it('com frase de confirmação: botão destrutivo só habilita quando a frase bate', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <ConfirmModal
        open
        onOpenChange={() => {}}
        title="Excluir conta"
        description="Ação irreversível."
        onConfirm={onConfirm}
        confirmationPhrase="EXCLUIR MINHA CONTA"
      />,
    )

    const confirmButton = screen.getByRole('button', { name: 'Excluir' })
    expect(confirmButton).toBeDisabled()

    const phraseInput = screen.getByLabelText('Digite "EXCLUIR MINHA CONTA" para confirmar')
    await user.type(phraseInput, 'excluir')
    expect(confirmButton).toBeDisabled()

    await user.clear(phraseInput)
    await user.type(phraseInput, 'EXCLUIR MINHA CONTA')
    expect(confirmButton).toBeEnabled()

    await user.click(confirmButton)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('estado loading bloqueia campos e mostra o botão em carregamento', () => {
    render(
      <ConfirmModal
        open
        onOpenChange={() => {}}
        title="Excluir conta"
        description="Ação irreversível."
        onConfirm={() => {}}
        confirmationPhrase="EXCLUIR MINHA CONTA"
        loading
      />,
    )
    expect(screen.getByLabelText('Digite "EXCLUIR MINHA CONTA" para confirmar')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Processando…' })).toBeDisabled()
  })

  it('limpa a frase digitada ao fechar e reabrir o modal', async () => {
    const user = userEvent.setup()

    function Wrapper() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Reabrir
          </button>
          <ConfirmModal
            open={open}
            onOpenChange={setOpen}
            title="Excluir conta"
            description="Ação irreversível."
            onConfirm={() => {}}
            confirmationPhrase="EXCLUIR"
          />
        </>
      )
    }

    render(<Wrapper />)
    const phraseInput = screen.getByLabelText('Digite "EXCLUIR" para confirmar')
    await user.type(phraseInput, 'EXCLUIR')
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    await user.click(screen.getByRole('button', { name: 'Reabrir' }))

    expect(screen.getByLabelText('Digite "EXCLUIR" para confirmar')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeDisabled()
  })
})
