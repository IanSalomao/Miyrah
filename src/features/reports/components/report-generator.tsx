// Seção "Gerar relatório" — sempre visível no topo da página (não em modal).
// Período (obrigatório) + categorias (opcional, múltipla) + painel de blocos +
// botão primário. Ver wiki/pages/page_reports.md. Card em Superfície com sombra sm
// (design_system.md).

import { FileDown } from 'lucide-react'
import { CategoryFilter } from '@/components/filter-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Category, ReportSection } from '@/types'
import type { ReportFormErrors, ReportFormState } from '../report-form'
import { SectionPanel } from './section-panel'

interface ReportGeneratorProps {
  form: ReportFormState
  errors: ReportFormErrors
  categories: Category[]
  isGenerating: boolean
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onCategoryIdsChange: (ids: string[]) => void
  onToggleSection: (section: ReportSection) => void
  onIncludeMemberToggle: () => void
  onGenerate: () => void
}

function sectionsLabel(count: number): string {
  return `${count} ${count === 1 ? 'bloco selecionado' : 'blocos selecionados'}`
}

export function ReportGenerator({
  form,
  errors,
  categories,
  isGenerating,
  onDateFromChange,
  onDateToChange,
  onCategoryIdsChange,
  onToggleSection,
  onIncludeMemberToggle,
  onGenerate,
}: ReportGeneratorProps) {
  const periodInvalid = Boolean(errors.period)

  return (
    <section className="flex flex-col rounded-lg border border-border bg-card shadow-sm">
      <header className="border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight">Gerar relatório</h2>
        <p className="text-sm text-muted-foreground">
          Escolha o período, filtre categorias e marque os blocos que entram no PDF.
        </p>
      </header>

      <div className="flex flex-col gap-6 px-5 py-5">
        {/* Período + categorias */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Período
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Label htmlFor="report-date-from" className="sr-only">
                Data inicial
              </Label>
              <Input
                id="report-date-from"
                type="date"
                value={form.dateFrom}
                max={form.dateTo || undefined}
                onChange={(event) => onDateFromChange(event.target.value)}
                aria-invalid={periodInvalid}
                className={cn('w-40', periodInvalid && 'border-destructive')}
              />
              <span className="text-sm text-muted-foreground">até</span>
              <Label htmlFor="report-date-to" className="sr-only">
                Data final
              </Label>
              <Input
                id="report-date-to"
                type="date"
                value={form.dateTo}
                min={form.dateFrom || undefined}
                onChange={(event) => onDateToChange(event.target.value)}
                aria-invalid={periodInvalid}
                className={cn('w-40', periodInvalid && 'border-destructive')}
              />
            </div>
            {errors.period && <p className="text-sm text-destructive">{errors.period}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Categorias
            </span>
            <CategoryFilter
              categories={categories}
              selectedIds={form.categoryIds}
              onChange={onCategoryIdsChange}
            />
          </div>
        </div>

        <Separator />

        <SectionPanel
          selected={form.sections}
          onToggleSection={onToggleSection}
          includeMember={form.includeMember}
          onIncludeMemberToggle={onIncludeMemberToggle}
          disabled={isGenerating}
          error={errors.sections}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{sectionsLabel(form.sections.length)}</p>
          <Button type="button" onClick={onGenerate} disabled={isGenerating}>
            <FileDown aria-hidden />
            {isGenerating ? 'Gerando…' : 'Gerar novo relatório'}
          </Button>
        </div>
      </div>
    </section>
  )
}
