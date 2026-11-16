import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// GitHub Pages の配信元。見本は <SITE_URL>/<path>/ に置く
const SITE_URL = 'https://mozumasu.github.io/swiss-slidev'
const REPO_URL = 'https://github.com/mozumasu/swiss-slidev'
const BASE_PATH = new URL(SITE_URL).pathname.replace(/\/$/, '') // "/swiss-slidev"

// テーマ・アドオンの見本 (example.md)。一覧ページにこの順で並べる
const EXAMPLES = [
  { dir: 'packages/slidev-theme-swiss', path: 'theme', kind: 'Theme' },
  { dir: 'packages/slidev-addon-swiss', path: 'addon', kind: 'Addon' },
].map((x) => {
  const pkg = JSON.parse(readFileSync(`${x.dir}/package.json`, 'utf8'))
  return { ...x, name: pkg.name, description: pkg.description ?? '' }
})

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' })[c])
}
const metaAttr = t => (t.property ? `property="${t.property}"` : `name="${t.name}"`)

// og:image / og:url は絶対 URL でないとクローラが解決しないが、Slidev の seoMeta は
// --base を付けないので、ビルド後の index.html に足す。既にあるタグは中身を差し替える
function injectMeta(htmlPath, tags) {
  let html = readFileSync(htmlPath, 'utf8')
  const missing = []
  for (const t of tags) {
    const tag = `<meta ${metaAttr(t)} content="${escapeHtml(t.content)}">`
    const re = new RegExp(`<meta ${metaAttr(t)} content="[^"]*">`)
    if (re.test(html))
      html = html.replace(re, tag)
    else
      missing.push(tag)
  }
  writeFileSync(htmlPath, html.replace('</head>', `${missing.join('\n')}\n</head>`))
}

// ── 1. 見本をビルドして dist/<path> に集める ──────
rmSync('dist', { recursive: true, force: true })
mkdirSync('dist', { recursive: true })
for (const x of EXAMPLES) {
  console.log(`\n=== build: ${x.dir}/example.md -> ${BASE_PATH}/${x.path}/ ===`)
  const out = `dist/${x.path}`
  // slidev はパッケージのディレクトリで動くので、出力先は絶対パスで渡す
  const slidev = (cmd, ...args) =>
    execFileSync('pnpm', ['--filter', `./${x.dir}`, 'exec', 'slidev', cmd, 'example.md', ...args], { stdio: 'inherit' })
  slidev('build', '--base', `${BASE_PATH}/${x.path}/`, '--out', resolve(out))
  rmSync(`${out}/_redirects`, { force: true }) // Netlify 用なので不要

  // 一覧のサムネイルと og:image を兼ねて 1 ページ目を PNG に書き出す。
  // scale 1.2 で 1200x675 になり、OGP が推奨する 1200 幅に揃う
  const exportDir = `${out}/.cover-export`
  slidev('export', '--format', 'png', '--range', '1', '--scale', '1.2', '--output', resolve(exportDir))
  // 出力名は Slidev のバージョンで 1.png / 01.png が揺れる
  const exported = readdirSync(exportDir).find(f => f.endsWith('.png'))
  renameSync(`${exportDir}/${exported}`, `${out}/cover.png`)
  rmSync(exportDir, { recursive: true, force: true })

  const url = `${SITE_URL}/${x.path}/`
  injectMeta(`${out}/index.html`, [
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    { property: 'og:image', content: `${url}cover.png` },
    { property: 'og:title', content: `${x.name} の見本` },
    { property: 'og:description', content: x.description },
    { name: 'description', content: x.description },
    { name: 'twitter:card', content: 'summary_large_image' },
  ])
}

// ── 2. ページの直リンク ───────────────────────
// GitHub Pages は SPA のフォールバックが無く、/theme/5 のような直リンクが 404 になる。
// 404.html で見本の index.html に飛ばし、元のパスは sessionStorage に退避して
// Slidev のルーターが読む前に history.replaceState で戻す
writeFileSync(
  'dist/404.html',
  `<!doctype html>
<meta charset="utf-8">
<title>Redirecting…</title>
<script>
  const decks = ${JSON.stringify(EXAMPLES.map(x => x.path))};
  const base = ${JSON.stringify(`${BASE_PATH}/`)};
  const rest = location.pathname.slice(base.length);
  const deck = decks.find(d => rest === d || rest.startsWith(d + "/"));
  if (deck) {
    sessionStorage.setItem("swiss-redirect", location.pathname + location.search + location.hash);
    location.replace(base + deck + "/");
  } else {
    location.replace(base);
  }
</script>
`,
)
const restore = `<script>(() => { const r = sessionStorage.getItem("swiss-redirect"); if (r) { sessionStorage.removeItem("swiss-redirect"); history.replaceState(null, "", r); } })()</script>`
for (const x of EXAMPLES) {
  const p = `dist/${x.path}/index.html`
  writeFileSync(p, readFileSync(p, 'utf8').replace('<head>', `<head>\n${restore}`))
}

// ── 3. 一覧ページ ───────────────────────────
// テーマと同じく、紙・墨・赤の 3 色と罫線で組む。角丸・影・グラデーションは使わない
const items = EXAMPLES.map((x, i) => `<li>
  <a href="${escapeHtml(x.path)}/">
    <img src="${escapeHtml(x.path)}/cover.png" alt="${escapeHtml(x.name)} の 1 枚目" width="1200" height="675" loading="lazy">
    <span class="label">${String(i + 1).padStart(2, '0')} — ${escapeHtml(x.kind)}</span>
    <span class="name">${escapeHtml(x.name)}</span>
    <span class="desc">${escapeHtml(x.description)}</span>
  </a>
  <a class="src" href="${REPO_URL}/tree/main/${escapeHtml(x.dir)}">Source</a>
</li>`).join('\n')

writeFileSync(
  'dist/index.html',
  `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>swiss-slidev</title>
<meta name="description" content="スイススタイルの Slidev テーマとアドオンの見本">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}/">
<meta property="og:title" content="swiss-slidev">
<meta property="og:description" content="スイススタイルの Slidev テーマとアドオンの見本">
<meta property="og:image" content="${SITE_URL}/${EXAMPLES[0].path}/cover.png">
<meta name="twitter:card" content="summary_large_image">
<style>
  :root { color-scheme: light; --red: #e30613; --ink: #111; --muted: #5a5a5a; --paper: #f3f1ec; --line-soft: #d4d1ca; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 48px 16px 64px; font-family: Inter, "Noto Sans JP", system-ui, sans-serif; color: var(--ink); background: var(--paper); }
  main { max-width: 1120px; margin: 0 auto; }
  header { border-top: 8px solid var(--ink); padding-top: 16px; display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; align-items: end; }
  h1 { grid-column: span 8; margin: 0; font-size: clamp(2.4rem, 7vw, 5rem); line-height: 1; letter-spacing: -0.02em; font-weight: 800; }
  h1 span { color: var(--red); }
  header p { grid-column: span 4; margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.6; }
  ul { list-style: none; padding: 0; margin: 48px 0 0; display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr)); }
  li { border-top: 4px solid var(--ink); padding-top: 12px; display: flex; flex-direction: column; gap: 8px; }
  li > a:first-child { display: flex; flex-direction: column; gap: 8px; color: inherit; text-decoration: none; }
  img { width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; display: block; border: 1px solid var(--line-soft); background: #fff; }
  .label { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--red); font-weight: 700; }
  .name { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.02em; }
  li > a:first-child:hover .name { color: var(--red); }
  .desc { color: var(--muted); font-size: 0.9rem; line-height: 1.6; }
  .src { align-self: flex-start; font-size: 0.8rem; color: var(--ink); }
  footer { margin-top: 64px; border-top: 1px solid var(--ink); padding-top: 12px; font-size: 0.8rem; color: var(--muted); }
  footer a { color: inherit; }
  @media (max-width: 640px) { h1, header p { grid-column: span 12; } }
</style>
</head>
<body>
<main>
<header>
  <h1>swiss<span>-</span>slidev</h1>
  <p>国際タイポグラフィ様式 (スイススタイル) に寄せた Slidev のテーマとアドオンです。見本を開くと、レイアウトとコンポーネントを 1 枚ずつ確かめられます。</p>
</header>
<ul>
${items}
</ul>
<footer><a href="${REPO_URL}">${REPO_URL.replace('https://', '')}</a></footer>
</main>
</body>
</html>
`,
)
console.log(`\ndist/index.html を生成 (${EXAMPLES.length} 件)`)
