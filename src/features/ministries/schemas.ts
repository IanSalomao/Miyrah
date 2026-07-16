// Schema do formulário de ministério — wiki/api/ministries.md, wiki/pages/page_ministries.md
import { z } from 'zod'

export const ministryFormSchema = z.object({
  name: z.string().trim().min(1, 'O nome é obrigatório.'),
  description: z.string().trim().optional(),
  // `null` remove o responsável (PATCH); `undefined`/ausente = não altera.
  responsibleId: z.string().uuid().nullable().optional(),
})

export type MinistryFormValues = z.infer<typeof ministryFormSchema>
