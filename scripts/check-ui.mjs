#!/usr/bin/env node
/**
 * dsh-official-ui static checks.
 *
 * Scans a plugin's client source for UI rules that make it drift from the
 * DSH shell: self-drawn controls, colour literals, theme branches, wrong
 * hairlines, custom scrollbars, off-scale radii and over-weight type.
 *
 * Usage:
 *   node scripts/check-ui.mjs [--root <dir>] [--json] [--strict] [--help]
 *
 * Exit codes: 0 clean, 1 errors, 2 warnings under --strict.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'

const HELP = `
dsh-official-ui check-ui

  --root <dir>    目录，默认 src/client → src → 当前目录
  --ignore <glob>  跳过文件，可重复；也可写在 .dsh-ui-check.json 的 ignore
  --json          机器可读输出
  --strict        有 warning 也返回非 0
  --help          显示帮助

忽略：node_modules、.git、dist、build、out、coverage、*.min.*、*.map。
行内写 /* dsh-ui-allow */ 可跳过该行。
文件头写 /* dsh-ui file-role: content-fixed */ 可放行颜色字面量（内容固定配色）。
.dsh-ui-check.json 示例：{ "ignore": ["styles/theme.js"], "contentFixed": ["styles/art/**"] }
`

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', 'coverage', '.next', '.cache', '.turbo'])
const CODE_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'])
const STYLE_EXT = new Set(['.css', '.scss', '.less'])

function parseArgs(argv) {
  const opts = { root: '', json: false, strict: false, ignore: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') opts.help = true
    else if (arg === '--json') opts.json = true
    else if (arg === '--strict') opts.strict = true
    else if (arg === '--root') opts.root = argv[++i] ?? ''
    else if (arg.startsWith('--root=')) opts.root = arg.slice(7)
    else if (arg === '--ignore') opts.ignore.push(argv[++i] ?? '')
    else if (arg.startsWith('--ignore=')) opts.ignore.push(arg.slice(9))
    else if (!arg.startsWith('-') && !opts.root) opts.root = arg
  }
  return opts
}

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*')
  return new RegExp('^' + escaped + '$')
}

function loadConfig(cwd) {
  const config = { ignore: [], contentFixed: [] }
  try {
    const raw = readFileSync(join(cwd, '.dsh-ui-check.json'), 'utf8')
    const json = JSON.parse(raw)
    if (Array.isArray(json.ignore)) config.ignore.push(...json.ignore)
    if (Array.isArray(json.contentFixed)) config.contentFixed.push(...json.contentFixed)
  } catch { /* no config */ }
  return config
}

function matchesAny(patterns, relativePath) {
  const normalized = relativePath.replace(/\\/g, '/')
  const basename = normalized.split('/').pop() ?? normalized
  return patterns.some((pattern) => {
    try {
      const match = globToRegExp(pattern)
      return match.test(normalized) || (!pattern.includes('/') && match.test(basename))
    } catch { return normalized.includes(pattern) }
  })
}

function pickRoot(given) {
  if (given) return resolve(given)
  const cwd = process.cwd()
  for (const candidate of ['src/client', 'src']) {
    try {
      if (statSync(join(cwd, candidate)).isDirectory()) return join(cwd, candidate)
    } catch { /* try next */ }
  }
  return cwd
}

function walk(dir, files = [], ignore = []) {
  let entries
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return files }
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.') continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      walk(path, files, ignore)
      continue
    }
    if (!entry.isFile()) continue
    if (entry.name === 'check-ui.mjs') continue
    const ext = extname(entry.name).toLowerCase()
    if (!CODE_EXT.has(ext) && !STYLE_EXT.has(ext)) continue
    if (/\.min\./.test(entry.name) || entry.name.endsWith('.map')) continue
    if (ignore.length > 0 && matchesAny(ignore, relative(process.cwd(), path))) continue
    try { if (statSync(path).size > 2 * 1024 * 1024) continue } catch { continue }
    files.push(path)
  }
  return files
}

function stripCssComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
}

function isContentFixed(header) {
  return /dsh-ui\s+file-role:\s*content-fixed/i.test(header)
}

function isAllowed(line) {
  return /dsh-ui-allow/.test(line)
}

function scanCssFile(file, text, contentFixed = []) {
  const issues = []
  const header = text.split('\n').slice(0, 8).join('\n')
  const fixed = isContentFixed(header) || matchesAny(contentFixed, relative(process.cwd(), file))
  const lines = stripCssComments(text).split('\n')
  const add = (line, rule, severity, message) => issues.push({ file, line, rule, severity, message })

  lines.forEach((raw, index) => {
    const lineNo = index + 1
    if (isAllowed(raw)) return
    const line = raw.trim()
    if (!line) return

    if (/::-webkit-scrollbar/.test(line)) {
      add(lineNo, 'scrollbar/custom', 'error', '自定义滚动条；改用共享滚动条样式')
      return
    }

    if (/data-ds-dark-theme|prefers-color-scheme/.test(line)) {
      add(lineNo, 'theme/selector', 'error', '插件 CSS 不写主题选择器；改用 --dsw-alias-* token')
      return
    }

    if (!fixed) {
      if (/#[0-9a-fA-F]{3,8}\b/.test(line) && !/url\(/.test(line)) {
        add(lineNo, 'color/literal', 'error', '颜色字面量；改用 var(--dsw-alias-*)')
      }
      if (/\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\(/i.test(line) && !/rgba?\([^)]*,\s*0\s*\)/.test(line)) {
        add(lineNo, 'color/literal', 'error', '颜色函数字面量；改用 var(--dsw-alias-*)')
      }
      if (/:\s*[^;{}]*\b(?:white|black)\b/.test(line)) {
        add(lineNo, 'color/literal', 'error', 'white/black 字面量；改用 var(--dsw-alias-*)')
      }
      if (/--dsw-static-/.test(line)) {
        add(lineNo, 'color/static-token', 'warn', '功能样式引用静态色板；只允许 content-fixed 文件')
      }
    }

    if (/border(?:-[a-z]+)?\s*:[^;]*\b1px\b[^;]*--dsw-alias-border/.test(line)) {
      add(lineNo, 'geometry/hairline', 'error', '中性边框用了 1px；改为 0.5px 或 var(--dsh-hairline-width)')
    }

    const radius = line.match(/border-radius\s*:\s*([^;]+)/)
    if (radius && !/var\(|\b0\b|50%|999px/.test(radius[1])) {
      add(lineNo, 'geometry/radius-literal', 'warn', '圆角字面量；改用 --dsw-radius-*')
    }

    if (/font-family\s*:\s*[^;]*[a-zA-Z]/.test(line) && !/var\(--/.test(line) && !/inherit/.test(line)) {
      add(lineNo, 'type/font-family', 'warn', '不要写字体栈；用主题字体变量或继承')
    }

    if (/font-weight\s*:\s*(?:[6-9]00|bold)\b/.test(line)) {
      add(lineNo, 'type/weight', 'warn', '功能样式字重应 ≤500')
    }

    if (/outline\s*:\s*none\b/.test(line)) {
      add(lineNo, 'focus/outline-none', 'warn', '不要直接去掉焦点轮廓；用 --dsw-focus-ring-* 提供替代')
    }
  })
  return issues
}

function scanCodeFile(file, text, contentFixed = []) {
  const issues = []
  const lines = text.split('\n')
  const fixed = isContentFixed(lines.slice(0, 8).join('\n')) || matchesAny(contentFixed, relative(process.cwd(), file))
  const add = (line, rule, severity, message) => issues.push({ file, line, rule, severity, message })

  lines.forEach((raw, index) => {
    const lineNo = index + 1
    if (isAllowed(raw)) return
    const line = raw.trim()
    if (!line) return

    if (!fixed) {
      const colorish = /color|background|border|shadow|fill|stroke|style|var\(--/i.test(line)
      if (colorish && /#[0-9a-fA-F]{3,8}\b/.test(line) && !/url\(|\b(href|src|id|aria-[a-z]+)=/.test(line)) {
        add(lineNo, 'color/literal', 'error', '代码里出现颜色字面量；改用 token/CSS 变量')
      }
      if (/\b(?:rgb|rgba|hsl|hsla)\(/i.test(line) && !/rgba?\([^)]*,\s*0\s*\)/.test(line)) {
        add(lineNo, 'color/literal', 'error', '代码里出现颜色函数；改用 token/CSS 变量')
      }
      if (colorish && /:\s*[^;{}]*\b(?:white|black)\b/.test(line)) {
        add(lineNo, 'color/literal', 'error', '代码/内联样式里出现 white/black；改用 token')
      }
    }

    if (/data-ds-dark-theme|prefers-color-scheme/.test(line)) {
      add(lineNo, 'theme/selector', 'warn', '不要在 JS/CSS-in-JS 里分支主题；让 --dsw-alias-* 解析；确需例外时加 dsh-ui-allow')
    }
    if (/\b1px\b[^;]*--dsw-alias-border/.test(line)) {
      add(lineNo, 'geometry/hairline', 'error', '中性边框用了 1px；改为 0.5px 或 var(--dsh-hairline-width)')
    }

    const rawTagged = /<(button|select|textarea|dialog|option)\b/.test(line)
    const rawCreated = /createElement\(\s*['"](button|select|textarea|dialog|option)['"]/.test(line)
    if (rawTagged || rawCreated) {
      add(lineNo, 'control/raw', 'warn', '自绘原生控件；改用 ui-primitives（必要时加 dsh-ui-allow 说明）')
    }
    if (/(?:<div|createElement\(\s*['"]div['"])[^\n]*onClick/.test(line)) {
      add(lineNo, 'control/clickable-div', 'warn', '可点击 div 不是按钮；用 ui.Button 保留键盘与语义')
    }
    if (/role\s*=\s*['"]button['"]/.test(line)) {
      add(lineNo, 'control/role-button', 'warn', '用 ui.Button 代替 role="button" 的容器')
    }
    const inputTagged = /<input\b/.test(line)
    const inputCreated = /createElement\(\s*['"]input['"]/.test(line)
    if ((inputTagged || inputCreated) && !/type\s*[:=]\s*['"]file['"]/.test(line)) {
      add(lineNo, 'control/raw', 'warn', '自绘 input；改用 ui.Input（文件选择等原生输入可加 dsh-ui-allow）')
    }
  })
  return issues
}

function main() {
  const opts = parseArgs(process.argv.slice(2))
  if (opts.help) { process.stdout.write(HELP); return 0 }

  const root = pickRoot(opts.root)
  const config = loadConfig(process.cwd())
  const ignore = [...config.ignore, ...opts.ignore].filter(Boolean)
  const files = walk(root, [], ignore)
  const all = []
  const started = Date.now()

  for (const file of files) {
    let text = ''
    try { text = readFileSync(file, 'utf8') } catch { continue }
    const ext = extname(file).toLowerCase()
    if (STYLE_EXT.has(ext)) all.push(...scanCssFile(file, text, config.contentFixed))
    else all.push(...scanCodeFile(file, text, config.contentFixed))
  }

  const errors = all.filter(i => i.severity === 'error')
  const warnings = all.filter(i => i.severity === 'warn')
  const ms = Date.now() - started

  if (opts.json) {
    process.stdout.write(JSON.stringify({ root, files: files.length, errors, warnings, ms }, null, 2) + '\n')
  } else {
    const byFile = new Map()
    for (const issue of all) {
      if (!byFile.has(issue.file)) byFile.set(issue.file, [])
      byFile.get(issue.file).push(issue)
    }
    for (const [file, issues] of byFile) {
      process.stdout.write(relative(process.cwd(), file) + '\n')
      for (const issue of issues) {
        const sev = issue.severity === 'error' ? 'error' : 'warn '
        process.stdout.write(`  ${String(issue.line).padStart(4)}  ${sev}  ${issue.rule}  ${issue.message}\n`)
      }
    }
    if (all.length === 0) process.stdout.write('OK  no UI drift found\n')
    process.stdout.write(`\n${errors.length} error(s), ${warnings.length} warning(s) · ${files.length} file(s) · ${ms}ms\n`)
    if (errors.length > 20) {
      process.stdout.write('提示：先用 --root <本次改动目录>，或在 .dsh-ui-check.json 的 ignore 中排除历史文件，逐步收敛。\n')
    }
  }

  if (errors.length > 0) return 1
  if (opts.strict && warnings.length > 0) return 2
  return 0
}

process.exitCode = main()
