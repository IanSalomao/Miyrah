// Campos do formulário de transação — compartilhados entre o modo edição
// (formulário único) e cada card do modo criação (lançamentos encadeados).
// Ver wiki/pages/page_transactions.md e wiki/design_system.md (valor em
// Dado/Utilitário, alinhado à direita, cor semântica).

import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { SegmentedControl } from './segmented-control'
import { MemberPicker, type MemberOption } from './member-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Category, Ministry, TransactionType } from '@/types'
import { transactionTypeOptions, type TransactionFormValues } from '../schemas'

interface TransactionFormFieldsProps {
  /** Prefixo único de `id`/`htmlFor` — necessário porque, no modo criação, há
   * vários cards (com os mesmos nomes de campo) montados ao mesmo tempo. */
  idPrefix: string
  control: Control<TransactionFormValues>
  register: UseFormRegister<TransactionFormValues>
  errors: FieldErrors<TransactionFormValues>
  watchedType: TransactionType
  onTypeChange: (type: TransactionType) => void
  categoryOptions: Category[]
  ministryOptions: Ministry[]
  member: MemberOption | null
  onMemberChange: (member: MemberOption | null) => void
}

export function TransactionFormFields({
  idPrefix,
  control,
  register,
  errors,
  watchedType,
  onTypeChange,
  categoryOptions,
  ministryOptions,
  member,
  onMemberChange,
}: TransactionFormFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label>Tipo</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <SegmentedControl
              aria-label="Tipo da transação"
              value={field.value}
              onChange={onTypeChange}
              options={transactionTypeOptions}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${idPrefix}-value`}>Valor</Label>
          <Input
            id={`${idPrefix}-value`}
            type="number"
            step="0.01"
            min="0.01"
            inputMode="decimal"
            className={cn(
              'text-right font-mono',
              watchedType === 'income' ? 'text-income' : 'text-expense',
            )}
            aria-invalid={Boolean(errors.value)}
            {...register('value')}
          />
          {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${idPrefix}-date`}>Data</Label>
          <Input
            id={`${idPrefix}-date`}
            type="date"
            aria-invalid={Boolean(errors.date)}
            {...register('date')}
          />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-category`}>Categoria</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id={`${idPrefix}-category`}
                className="w-full"
                aria-invalid={Boolean(errors.categoryId)}
              >
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span
                      aria-hidden="true"
                      className="inline-block size-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && (
          <p className="text-xs text-destructive">{errors.categoryId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-description`}>Descrição</Label>
        <Input id={`${idPrefix}-description`} {...register('description')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Membro (opcional)</Label>
        <MemberPicker value={member} onChange={onMemberChange} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-ministry`}>Ministério (opcional)</Label>
        <Controller
          control={control}
          name="ministryId"
          render={({ field }) => (
            <Select
              value={field.value || 'none'}
              onValueChange={(next) => field.onChange(next === 'none' ? '' : next)}
            >
              <SelectTrigger id={`${idPrefix}-ministry`} className="w-full">
                <SelectValue placeholder="Nenhum ministério" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {ministryOptions.map((ministry) => (
                  <SelectItem key={ministry.id} value={ministry.id}>
                    {ministry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </>
  )
}
