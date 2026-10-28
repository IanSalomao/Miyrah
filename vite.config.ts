import { configDefaults, defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // SPA puro — fallback de history para deep links (/transactions etc.)
  appType: 'spa',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    fs: {
      // Permite o dev server servir os arquivos do pacote miyrah-design-system
      // (repo irmão, linkado via `file:` — fica fora da raiz do projeto).
      allow: [
        fileURLToPath(new URL('.', import.meta.url)),
        fileURLToPath(new URL('../miyrah-design-system', import.meta.url)),
      ],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Não varrer as worktrees dos agentes em .claude/ (cópias completas do repo)
    // nem a wiki/ (symlink para o vault, que alcança os specs do back-end)
    exclude: [...configDefaults.exclude, '**/.claude/**', '**/wiki/**'],
  },
})
