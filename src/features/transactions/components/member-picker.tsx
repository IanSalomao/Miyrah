// Picker de Membro (opcional) do formulário de transação —
// wiki/pages/page_transactions.md: "digitar no campo Membro" → lista via
// GET /v1/members (search).

import { useState } from 'react'
import { ChevronsUpDownIcon, XIcon } from 'lucide-react'
import { MemberAvatar } from '@/components/avatar/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useMembersSearch } from '../hooks/use-members-search'

export interface MemberOption {
  id: string
  name: string
}

interface MemberPickerProps {
  value: MemberOption | null
  onChange: (member: MemberOption | null) => void
  disabled?: boolean
}

export function MemberPicker({ value, onChange, disabled }: MemberPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useMembersSearch(search)
  const members = data?.items ?? []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className={cn('truncate', !value && 'text-muted-foreground')}>
            {value ? value.name : 'Nenhum membro selecionado'}
          </span>
          <span className="flex items-center gap-1">
            {value && (
              <XIcon
                className="size-4 text-muted-foreground hover:text-foreground"
                onClick={(event) => {
                  event.stopPropagation()
                  onChange(null)
                }}
              />
            )}
            <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-2" align="start">
        <Input
          autoFocus
          placeholder="Buscar membro..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Buscar membro"
        />
        <div className="mt-2 max-h-56 overflow-y-auto">
          {isLoading && <p className="p-2 text-sm text-muted-foreground">Buscando...</p>}
          {!isLoading && members.length === 0 && (
            <p className="p-2 text-sm text-muted-foreground">Nenhum membro encontrado.</p>
          )}
          {!isLoading &&
            members.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => {
                  onChange({ id: member.id, name: member.name })
                  setOpen(false)
                  setSearch('')
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted',
                  value?.id === member.id && 'bg-muted',
                )}
              >
                <MemberAvatar name={member.name} size="sm" />
                {member.name}
              </button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
