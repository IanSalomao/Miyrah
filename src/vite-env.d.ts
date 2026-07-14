/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL da API real. Quando ausente, o app usa `/v1` (interceptado pelo MSW em dev). */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
