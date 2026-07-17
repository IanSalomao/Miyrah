// Prepara o CSS compilado do app para o design-sync.
//
// O Tailwind v4 só materializa os utilitários no CSS compilado (hasheado) do
// build da SPA (dist/assets/index-*.css). Esse CSS traz @font-face com urls
// absolutas `/assets/xxx.woff2` (caminho do dist servido na raiz), que o
// extractFonts do conversor não resolve. Os woff2/woff com esses nomes exatos
// existem em dist/assets/, então reescrevemos `/assets/` -> `./` e gravamos um
// arquivo estável (dist/assets/_ds_styles.css) para usar como cfg.cssEntry.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const assetsDir = join(process.cwd(), 'dist', 'assets')
const cssFiles = readdirSync(assetsDir).filter((f) => /^index-.*\.css$/.test(f))
if (!cssFiles.length) {
  console.error('prepare-css: nenhum dist/assets/index-*.css encontrado — rode `npm run build` antes')
  process.exit(1)
}
// Maior arquivo index-*.css = o bundle Tailwind completo
cssFiles.sort((a, b) => readFileSync(join(assetsDir, b)).length - readFileSync(join(assetsDir, a)).length)
const srcCss = cssFiles[0]
let css = readFileSync(join(assetsDir, srcCss), 'utf8')

// Reescreve url(/assets/...) -> url(./...) (aspas simples, duplas ou sem aspas)
const before = css
css = css.replace(/url\(\s*(['"]?)\/assets\//g, 'url($1./')
const rewrites = (before.match(/url\(\s*['"]?\/assets\//g) || []).length

const outFile = join(assetsDir, '_ds_styles.css')
writeFileSync(outFile, css)
console.error(`prepare-css: ${srcCss} -> _ds_styles.css (${rewrites} url(/assets/) reescritas)`)
