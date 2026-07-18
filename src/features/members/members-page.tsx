// page_members.md — CRUD de membros com busca e paginação.

import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { MemberAvatar } from '@/components/avatar/avatar'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn, type DataTableRowAction } from '@/components/data-table/data-table'
import { FilterBar, SearchFilter } from '@/components/filter-bar'
import { formatDate, maskPhone } from '@/lib/format'
import type { Member } from '@/types'
import { useMembers } from './hooks/use-members'
import { MemberFormModal } from './components/member-form-modal'
import { MemberDeleteModal } from './components/member-delete-modal'

const DEFAULT_LIMIT = 20

export function MembersPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [deletingMember, setDeletingMember] = useState<Member | null>(null)

  // Debounce simples da busca — evita uma requisição por tecla digitada.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const query = { search: search || undefined, page, limit }
  const { data, isLoading, isError, refetch } = useMembers(query)

  const members = data?.items ?? []
  const meta = data?.meta ?? { page, limit, total: 0, totalPages: 1 }

  const columns: DataTableColumn<Member>[] = [
    {
      id: 'member',
      header: 'Membro',
      cell: (member) => (
        <div className="flex items-center gap-3">
          <MemberAvatar name={member.name} />
          <span className="font-medium">{member.name}</span>
        </div>
      ),
    },
    {
      id: 'birthDate',
      header: 'Data de Nascimento',
      cell: (member) => (
        <span className="font-mono text-sm">
          {member.birthDate ? formatDate(member.birthDate) : '—'}
        </span>
      ),
    },
    {
      id: 'baptismDate',
      header: 'Data de Batismo',
      cell: (member) => (
        <span className="font-mono text-sm">
          {member.baptismDate ? formatDate(member.baptismDate) : '—'}
        </span>
      ),
    },
    {
      id: 'email',
      header: 'Email',
      cell: (member) => member.email ?? '—',
    },
    {
      id: 'phone',
      header: 'Telefone',
      cell: (member) => (
        <span className="font-mono text-sm">{member.phone ? maskPhone(member.phone) : '—'}</span>
      ),
    },
  ]

  const rowActions: DataTableRowAction<Member>[] = [
    {
      label: 'Editar',
      icon: Pencil,
      onClick: (member) => setEditingMember(member),
    },
    {
      label: 'Excluir',
      icon: Trash2,
      variant: 'destructive',
      onClick: (member) => setDeletingMember(member),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Membros</h1>
        <p className="text-sm text-muted-foreground">Cadastro e consulta dos membros da igreja.</p>
      </div>

      <FilterBar>
        <SearchFilter
          value={searchInput}
          onChange={setSearchInput}
          placeholder="Buscar por nome"
        />
        <Button type="button" className="ml-auto" onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          Adicionar membro
        </Button>
      </FilterBar>

      <DataTable
        columns={columns}
        data={members}
        getRowId={(member) => member.id}
        isLoading={isLoading}
        error={isError ? 'Não foi possível carregar os membros.' : null}
        onRetry={() => void refetch()}
        rowActions={rowActions}
        emptyState={{
          icon: Users,
          title: 'Nenhum membro encontrado',
          actionLabel: 'Adicionar membro',
          onAction: () => setIsCreateOpen(true),
        }}
        pagination={{
          page: meta.page,
          limit: meta.limit,
          total: meta.total,
          totalPages: meta.totalPages,
          onPageChange: setPage,
          onLimitChange: (newLimit) => {
            setLimit(newLimit)
            setPage(1)
          },
        }}
      />

      <MemberFormModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <MemberFormModal
        open={Boolean(editingMember)}
        onOpenChange={(open) => {
          if (!open) setEditingMember(null)
        }}
        member={editingMember}
      />
      <MemberDeleteModal
        member={deletingMember}
        onOpenChange={(open) => {
          if (!open) setDeletingMember(null)
        }}
      />
    </div>
  )
}
