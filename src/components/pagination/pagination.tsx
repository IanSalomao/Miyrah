import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const DEFAULT_LIMIT_OPTIONS = [10, 20, 50, 100]

export interface PaginationProps {
  /** Página atual (1-based) — espelha o parâmetro `page` da API. */
  page: number
  /** Itens por página — espelha o parâmetro `limit` da API (padrão 20, máx. 100). */
  limit: number
  /** Total de itens (todas as páginas). */
  total: number
  /** Total de páginas — vem do meta de paginação da API. */
  totalPages: number
  onPageChange: (page: number) => void
  /** Omitido quando a tela não permite alterar a quantidade por página. */
  onLimitChange?: (limit: number) => void
  limitOptions?: number[]
  className?: string
}

/**
 * Controle de navegação entre páginas de uma listagem, com seletor de
 * itens por página. Ver wiki/components/component_pagination.md.
 */
export function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  className,
}: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 1)
  const isFirstPage = page <= 1
  const isLastPage = page >= safeTotalPages

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {onLimitChange ? (
          <>
            <span>Itens por página</span>
            <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
              <SelectTrigger size="sm" className="w-[76px]" aria-label="Itens por página">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <span>
            {total} {total === 1 ? 'registro' : 'registros'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>
          Página <span className="font-mono text-foreground">{page}</span> de{' '}
          <span className="font-mono text-foreground">{safeTotalPages}</span>
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFirstPage}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-3.5" />
            Anterior
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLastPage}
            onClick={() => onPageChange(page + 1)}
            aria-label="Próxima página"
          >
            Próximo
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
