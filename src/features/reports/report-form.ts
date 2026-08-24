// Estado e regras do formulário de geração — wiki/pages/page_reports.md.
// Lógica pura (sem React) para ser testável isoladamente: alternância de blocos,
// validação do período e montagem do payload de POST /v1/reports.

import type { CreateReportPayload, ReportSection } from '@/types'
import { DEFAULT_SECTIONS, MEMBER_PARENT_SECTION } from './sections'

export interface ReportFormState {
  dateFrom: string
  dateTo: string
  categoryIds: string[]
  sections: ReportSection[]
  /** "Incluir Membro" — só é `true` após a confirmação de senha no pop-up. */
  includeMember: boolean
  /** Senha retida no estado após confirmar o pop-up; só trafega no envio. */
  currentPassword: string
}

export function createInitialReportForm(): ReportFormState {
  return {
    dateFrom: '',
    dateTo: '',
    categoryIds: [],
    sections: [...DEFAULT_SECTIONS],
    includeMember: false,
    currentPassword: '',
  }
}

/**
 * Alterna um bloco do painel. Desmarcar "Lista de transações" também desliga
 * "Incluir Membro" e descarta a senha retida (a sub-opção depende dela).
 */
export function toggleSection(state: ReportFormState, section: ReportSection): ReportFormState {
  const isActive = state.sections.includes(section)
  const sections = isActive
    ? state.sections.filter((item) => item !== section)
    : [...state.sections, section]

  if (section === MEMBER_PARENT_SECTION && isActive) {
    return { ...state, sections, includeMember: false, currentPassword: '' }
  }
  return { ...state, sections }
}

/** "Incluir Membro" só fica disponível quando "Lista de transações" está marcada. */
export function canIncludeMember(state: ReportFormState): boolean {
  return state.sections.includes(MEMBER_PARENT_SECTION)
}

export interface ReportFormErrors {
  period?: string
  sections?: string
}

/** Validação local antes do envio (o servidor revalida com os mesmos códigos). */
export function validateReportForm(state: ReportFormState): ReportFormErrors {
  const errors: ReportFormErrors = {}

  if (!state.dateFrom || !state.dateTo) {
    errors.period = 'Informe a data inicial e a data final do período.'
  } else if (state.dateFrom > state.dateTo) {
    errors.period = 'A data inicial não pode ser posterior à data final.'
  }

  if (state.sections.length === 0) {
    errors.sections = 'Selecione ao menos um bloco para o relatório.'
  }

  return errors
}

/** Monta o corpo de POST /v1/reports a partir do estado do formulário. */
export function buildCreateReportPayload(state: ReportFormState): CreateReportPayload {
  return {
    dateFrom: state.dateFrom,
    dateTo: state.dateTo,
    categoryIds: state.categoryIds.length > 0 ? state.categoryIds : undefined,
    sections: state.sections,
    includeMember: state.includeMember ? true : undefined,
    currentPassword: state.includeMember ? state.currentPassword : undefined,
  }
}
