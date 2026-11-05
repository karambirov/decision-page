#!/usr/bin/env node
// Build a stageshow scene into one IIFE script and one stylesheet for a decision page.
//
//   node build-scene.mjs --scene <dir with index.tsx> --name <GlobalName> --out <dir>
//                        [--stageshow <stageshow skill dir>] [--replay "<button text>"]
//
// The scene is written like a stageshow example: `export default function Scene()` in
// index.tsx, importing the kit as '../../kit'. The script copies it into a temporary
// folder inside stageshow/examples (so the kit and React resolve from stageshow's own
// node_modules), adds a host with a replay button, builds with stageshow's Vite and
// removes the temporary folder. The page mounts it with
// <div class="demo-host" data-mount="<GlobalName>"></div>.
// The replay button speaks the page's language (main[data-lang], ru or en) unless --replay is given.
import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : fallback
}

const scene = arg('scene') && resolve(arg('scene'))
const name = arg('name')
const out = arg('out') && resolve(arg('out'))
const replay = arg('replay', null)
if (!scene || !name || !out) {
  console.error('usage: node build-scene.mjs --scene <dir> --name <GlobalName> --out <dir> [--stageshow <dir>]')
  process.exit(2)
}
if (!/^[A-Za-z_$][\w$]*$/.test(name)) {
  console.error(`--name must be a JavaScript identifier, got "${name}"`)
  process.exit(2)
}

// stageshow installed as a plugin (a dependency of the decision-page plugin) lives in the
// plugin cache, one folder per version; take the newest copy that is not marked for removal
function pluginCopies() {
  const cache = join(process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR || join(homedir(), '.claude/plugins'), 'cache')
  if (!existsSync(cache)) return []
  const found = []
  for (const market of readdirSync(cache)) {
    const dir = join(cache, market, 'stageshow')
    if (!existsSync(dir)) continue
    for (const version of readdirSync(dir)) {
      const path = join(dir, version)
      if (!existsSync(join(path, '.orphaned_at'))) found.push({ path, time: statSync(path).mtimeMs })
    }
  }
  return found.sort((a, b) => b.time - a.time).map((c) => c.path)
}

const candidates = [
  arg('stageshow'),
  process.env.STAGESHOW_DIR,
  join(homedir(), '.claude/skills/stageshow'),
  join(homedir(), '.agents/skills/stageshow'),
  ...pluginCopies(),
]
  .filter(Boolean)
  .map((p) => resolve(p))
  .filter((p) => existsSync(join(p, 'kit')))
// Prefer a copy whose packages are installed
const stageshow = candidates.find((p) => existsSync(join(p, 'node_modules/.bin/vite'))) || candidates[0]
if (!stageshow) {
  console.error('stageshow skill not found. It comes with the decision-page plugin (see the README), or pass --stageshow <dir>.')
  process.exit(1)
}
const vite = join(stageshow, 'node_modules/.bin/vite')
if (!existsSync(vite)) {
  console.error(`stageshow's packages are missing in ${stageshow}. Run: cd "${stageshow}" && npm ci (Node.js 20.19 or newer)`)
  process.exit(1)
}
if (!existsSync(join(scene, 'index.tsx'))) {
  console.error(`${scene}/index.tsx not found`)
  process.exit(1)
}

const tmp = join(stageshow, 'examples', `.decision-page-${name}-${process.pid}`)
rmSync(tmp, { recursive: true, force: true })
cpSync(scene, tmp, { recursive: true })

writeFileSync(
  join(tmp, 'standalone.tsx'),
  `import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Scene from './index'

const REPLAY: string | null = ${JSON.stringify(replay)}
const REPLAY_BY_LANG: Record<string, string> = { ru: 'Повторить сцену', en: 'Replay scene' }

// A once-played story remounts at its boundary when the reader asks for a replay
function Host({ replay }: { replay: string }) {
  const [run, setRun] = useState(0)
  return (
    <div className="scene-host">
      <Scene key={run} />
      <button type="button" className="scene-replay" onClick={() => setRun((n) => n + 1)}>
        {replay}
      </button>
    </div>
  )
}

export function mount(el: HTMLElement) {
  // The page engine writes the language it chose to main[data-lang] before it mounts scenes
  const lang = el.closest('[data-lang]')?.getAttribute('data-lang') ?? ''
  createRoot(el).render(
    <StrictMode>
      <Host replay={REPLAY ?? REPLAY_BY_LANG[lang] ?? REPLAY_BY_LANG.ru} />
    </StrictMode>,
  )
}
`,
)

writeFileSync(
  join(tmp, 'vite.config.mjs'),
  `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  root: ${JSON.stringify(stageshow)},
  plugins: [react()],
  define: { 'process.env.NODE_ENV': '"production"' },
  resolve: { dedupe: ['react', 'react-dom'] },
  logLevel: 'warn',
  build: {
    target: 'es2020',
    outDir: ${JSON.stringify(out)},
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: { entry: ${JSON.stringify(join(tmp, 'standalone.tsx'))}, formats: ['iife'], name: ${JSON.stringify(name)}, fileName: () => 'scene.js' },
  },
})
`,
)

mkdirSync(out, { recursive: true })
const r = spawnSync(vite, ['build', '--config', join(tmp, 'vite.config.mjs')], { cwd: stageshow, stdio: 'inherit' })
rmSync(tmp, { recursive: true, force: true })
if (r.status !== 0) process.exit(r.status ?? 1)

const files = readdirSync(out)
const css = files.filter((f) => f.endsWith('.css'))
console.log(`scene js:  ${join(out, 'scene.js')}`)
for (const f of css) console.log(`scene css: ${join(out, f)}`)
console.log(`mount:     <div class="demo-host" data-mount="${name}"></div>`)
