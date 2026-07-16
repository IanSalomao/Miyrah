// Schema Zod do formulário de categoria — wiki/api/categories.md.
import { z } from 'zod'

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/

export const categoryTypeSchema = z.enum(['income', 'expense'])

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da categoria.'),
  description: z.string().trim().optional(),
  type: categoryTypeSchema,
  color: z.string().trim().regex(HEX_COLOR, 'Informe uma cor hexadecimal válida (ex.: #22C55E).'),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
