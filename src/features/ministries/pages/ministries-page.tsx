// Tela /ministries — wiki/pages/page_ministries.md
// Barra de ferramentas com "Adicionar ministério" + grid de cards. Sem barra de
// filtros e sem paginação — a lista de ministérios de uma igreja é sempre completa.

import { useState } from 'react'
import { Church, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMinistries } from '../hooks/use-ministries'
import { MinistryCard } from '../components/ministry-card'
import { MinistryFormModal } from '../components/ministry-form-modal'
import { DeleteMinistryDialog } from '../components/delete-ministry-dialog'
import type { Ministry } from '@/types'

export function MinistriesPage() {
  const { data, isLoading, isError } = useMinistries()
  const [formModal, setFormModal] = useState<{ open: boolean; ministry: Ministry | null }>({
    open: false,
    ministry: null,
  })
  const [deleteTarget, setDeleteTarget] = useState<Ministry | null>(null)

  const ministries = data?.items ?? []

  function openCreateModal() {
    setFormModal({ open: true, ministry: null })
  }

  function openEditModal(ministry: Ministry) {
    setFormModal({ open: true, ministry })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Ministérios</h1>
        <Button onClick={openCreateModal}>
          <Plus className="size-4" />
          Adicionar ministério
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar os ministérios. Tente novamente.
          </p>
        </div>
      )}

      {!isLoading && !isError && ministries.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-12 text-center">
          <Church className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Nenhum ministério encontrado</p>
          <Button onClick={openCreateModal}>
            <Plus className="size-4" />
            Adicionar ministério
          </Button>
        </div>
      )}

      {!isLoading && !isError && ministries.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((ministry) => (
            <MinistryCard
              key={ministry.id}
              ministry={ministry}
              onEdit={() => openEditModal(ministry)}
              onDelete={() => setDeleteTarget(ministry)}
            />
          ))}
        </div>
      )}

      <MinistryFormModal
        open={formModal.open}
        ministry={formModal.ministry}
        onOpenChange={(open) => setFormModal((prev) => ({ ...prev, open }))}
      />

      <DeleteMinistryDialog
        ministry={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      />
    </div>
  )
}
