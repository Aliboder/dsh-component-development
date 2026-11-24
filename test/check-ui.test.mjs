import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('../scripts/check-ui.mjs', import.meta.url))
const dir = mkdtempSync(join(tmpdir(), 'dsh-ui-check-'))

function run(args) {
  const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' })
  assert.equal(result.status === 0 || result.status === 1, true, result.stderr)
  return JSON.parse(result.stdout)
}

try {
  writeFileSync(join(dir, 'bad.css'), [
    '.btn {',
    '  color: #ffffff;',
    '  border: 1px solid var(--dsw-alias-border-l3);',
    '  border-radius: 10px;',
    '  font-weight: 700;',
    '}',
    'body[data-ds-dark-theme] .btn { color: white; }',
    '::-webkit-scrollbar { width: 8px; }',
  ].join('\n'))

  writeFileSync(join(dir, 'fixed.css'), [
    '/* dsh-ui file-role: content-fixed — test */',
    '.surface {',
    '  --dsw-alias-label-primary: var(--dsw-static-neutral-bluish-50);',
    '  --dsw-alias-border-l3: rgba(255, 255, 255, 0.16);',
    '}',
    '.ok { color: var(--dsw-alias-label-primary); border-radius: var(--dsw-radius-md); }',
  ].join('\n'))

  writeFileSync(join(dir, 'bad.js'), [
    "const a = React.createElement('button', { onClick: go })",
    "const b = React.createElement('div', { onClick: go })",
    "const c = React.createElement('input', { type: 'file' })",
    "const d = 'color: white; border: 1px solid var(--dsw-alias-border-l3)'",
    "const e = 'prefers-color-scheme: dark'",
  ].join('\n'))

  const result = run(['--root', dir, '--json'])
  const rules = new Set([...result.errors, ...result.warnings].map(issue => issue.rule))

  for (const expected of [
    'color/literal',
    'geometry/hairline',
    'geometry/radius-literal',
    'theme/selector',
    'scrollbar/custom',
    'control/raw',
    'control/clickable-div',
    'theme/selector',
    'geometry/hairline',
  ]) assert.equal(rules.has(expected), true, 'missing rule: ' + expected)

  const fixedIssues = [...result.errors, ...result.warnings].filter(issue => issue.file.endsWith('fixed.css'))
  assert.deepEqual(fixedIssues, [], 'content-fixed file must be exempt: ' + JSON.stringify(fixedIssues))

  const ignored = run(['--root', dir, '--json', '--ignore', 'bad.js'])
  assert.equal(ignored.errors.some(issue => issue.file.endsWith('bad.js')), false, '--ignore must skip the file')

  console.log('check-ui: all assertions passed')
} finally {
  rmSync(dir, { recursive: true, force: true })
}
