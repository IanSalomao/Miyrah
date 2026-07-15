/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API. Quando ausente, o app usa `/v1`. */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
