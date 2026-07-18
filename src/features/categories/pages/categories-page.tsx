// Tela /categories — wiki/pages/page_categories.md.
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { FilterTabs, type FilterTabOption } from '@/components/tabs/filter-tabs'
import { Pagination } from '@/components/pagination/pagination'
import { Button } from '@/components/ui/button'
import { useCategories } from '../hooks/use-categories'
import { CategoryTable } from '../components/category-table'
import { CategoryFormModal } from '../components/category-form-modal'
import { CategoryDeleteModal } from '../components/category-delete-modal'
import type { Category, TransactionType } from '@/types'

type CategoryTab = 'all' | TransactionType

const TAB_OPTIONS: FilterTabOption<CategoryTab>[] = [
  { value: 'all', label: 'Todas' },
  { value: 'income', label: 'Entradas' },
  { value: 'expense', label: 'Saídas' },
]

const DEFAULT_LIMIT = 20

interface FormModalState {
  open: boolean
  category: Category | null
}

interface DeleteModalState {
  open: boolean
  category: Category | null
}

export function CategoriesPage() {
  const [tab, setTab] = useState<CategoryTab>('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_LIMIT)
  const [formModal, setFormModal] = useState<FormModalState>({ open: false, category: null })
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    open: false,
    category: null,
  })
  // Incrementado a cada abertura (criar/editar) — força remontagem do modal de formulário
  // para garantir estado limpo (campos, erros) sem precisar resetar via efeito.
  const [formKey, setFormKey] = useState(0)

  const { data, isLoading, isError, refetch } = useCategories({
    type: tab === 'all' ? undefined : tab,
    page,
    limit,
  })

  function handleTabChange(next: CategoryTab) {
    setTab(next)
    setPage(1)
  }

  function handleLimitChange(next: number) {
    setLimit(next)
    setPage(1)
  }

  function handleAdd() {
    setFormKey((key) => key + 1)
    setFormModal({ open: true, category: null })
  }

  function handleEdit(category: Category) {
    setFormKey((key) => key + 1)
    setFormModal({ open: true, category })
  }

  function handleDelete(category: Category) {
    setDeleteModal({ open: true, category })
  }

  // Ao criar, o tipo segue a aba ativa (fallback "income" na aba "Todas").
  const defaultTypeForCreate: TransactionType = tab === 'expense' ? 'expense' : 'income'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Categorias de transações
        </h1>
        <p className="text-sm text-muted-foreground">
          Cadastre e organize as categorias usadas para classificar entradas e saídas.
        </p>
      </div>

      <FilterTabs options={TAB_OPTIONS} value={tab} onValueChange={handleTabChange} />

      <div className="flex justify-end">
        <Button type="button" onClick={handleAdd}>
          <Plus className="size-4" />
          Adicionar categoria
        </Button>
      </div>

      <CategoryTable
        categories={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {data && (
        <Pagination
          page={data.meta.page}
          limit={data.meta.limit}
          total={data.meta.total}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
        />
      )}

      <CategoryFormModal
        key={formKey}
        open={formModal.open}
        onOpenChange={(open) => setFormModal((prev) => ({ ...prev, open }))}
        category={formModal.category}
        defaultType={formModal.category?.type ?? defaultTypeForCreate}
        onNotFound={() => refetch()}
      />

      <CategoryDeleteModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        category={deleteModal.category}
        onDeleted={() => refetch()}
      />
    </div>
  )
}
