// Painel de composição do relatório — os 4 grupos de blocos (checkbox) e, dentro
// do grupo Detalhe, a sub-opção "Incluir Membro" indentada e travada até "Lista de
// transações" ser marcada. Ver wiki/pages/page_reports.md. Sem cor de valor aqui:
// a tela não exibe dinheiro, então segue o monocromático azul do design_system.

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ReportSection } from '@/types'
import { MEMBER_PARENT_SECTION, SECTION_GROUPS } from '../sections'

interface SectionCheckboxProps {
  id: string
  label: string
  checked: boolean
  onToggle: () => void
  disabled?: boolean
  hint?: string
  indent?: boolean
}

// Linha de checkbox com rótulo associado por id/htmlFor — o rótulo é clicável e
// dá nome acessível ao checkbox (o Checkbox do Radix é um button, não um input).
function SectionCheckbox({
  id,
  label,
  checked,
  onToggle,
  disabled = false,
  hint,
  indent = false,
}: SectionCheckboxProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-md px-2 py-1.5',
        disabled && 'opacity-50',
        indent && 'ml-6',
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={() => onToggle()}
        className="mt-0.5"
      />
      <div className="flex flex-col gap-0.5 leading-tight">
        <Label
          htmlFor={id}
          className={cn(
            'font-normal text-foreground',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {label}
        </Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  )
}

interface SectionPanelProps {
  selected: ReportSection[]
  onToggleSection: (section: ReportSection) => void
  includeMember: boolean
  onIncludeMemberToggle: () => void
  disabled?: boolean
  error?: string
}

export function SectionPanel({
  selected,
  onToggleSection,
  includeMember,
  onIncludeMemberToggle,
  disabled = false,
  error,
}: SectionPanelProps) {
  const memberEnabled = selected.includes(MEMBER_PARENT_SECTION)

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <legend className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Blocos do relatório
        </legend>
        <p className="text-sm text-muted-foreground">
          Marque o que entra no PDF. Cada relatório é montado sob medida.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        {SECTION_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <h3 className="px-2 text-xs font-semibold tracking-wide text-foreground uppercase">
              {group.title}
            </h3>
            <div className="flex flex-col gap-0.5">
              {group.options.map((option) => (
                <div key={option.key} className="flex flex-col gap-0.5">
                  <SectionCheckbox
                    id={`section-${option.key}`}
                    label={option.label}
                    checked={selected.includes(option.key)}
                    onToggle={() => onToggleSection(option.key)}
                  />

                  {option.key === MEMBER_PARENT_SECTION && (
                    <SectionCheckbox
                      id="section-include-member"
                      label="Incluir membro"
                      checked={includeMember}
                      disabled={!memberEnabled}
                      onToggle={onIncludeMemberToggle}
                      indent
                      hint="Nome do doador × valor — pede senha"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </fieldset>
  )
}
