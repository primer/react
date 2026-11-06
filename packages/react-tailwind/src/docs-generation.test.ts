// @vitest-environment node
import {spawnSync} from 'node:child_process'
import {mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'

const generator = path.resolve(import.meta.dirname, '../script/generate-llms-txt.mjs')
let outputDirectory: string | undefined

afterEach(() => {
  if (outputDirectory) rmSync(outputDirectory, {recursive: true, force: true})
  outputDirectory = undefined
})

describe('generated llms documentation', () => {
  it('checks the index and all component files without modifying stale or extra files', () => {
    outputDirectory = mkdtempSync(path.join(tmpdir(), 'react-tailwind-llms-'))
    const run = (...args: string[]) =>
      spawnSync(process.execPath, [generator, '--output-dir', outputDirectory!, ...args], {encoding: 'utf8'})

    expect(run().status).toBe(0)
    expect(run('--check').status).toBe(0)
    expect(readFileSync(path.join(outputDirectory, 'llms/IconButton.md'), 'utf8')).toContain(
      '- `aria-label` (required): `string`',
    )

    const index = path.join(outputDirectory, 'llms.txt')
    const button = path.join(outputDirectory, 'llms/Button.md')
    const label = path.join(outputDirectory, 'llms/Label.md')
    const obsolete = path.join(outputDirectory, 'llms/Obsolete.md')
    writeFileSync(index, 'stale index')
    writeFileSync(button, 'stale component')
    unlinkSync(label)
    writeFileSync(obsolete, 'extra file')

    const result = run('--check')
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('llms.txt')
    expect(result.stderr).toContain('llms/Button.md')
    expect(result.stderr).toContain('llms/Label.md')
    expect(result.stderr).toContain('llms/Obsolete.md')
    expect(readFileSync(index, 'utf8')).toBe('stale index')
    expect(readFileSync(button, 'utf8')).toBe('stale component')

    expect(run().status).toBe(0)
    expect(readFileSync(obsolete, 'utf8')).toBe('extra file')
    expect(run('--check').status).toBe(1)
    unlinkSync(obsolete)
    expect(run('--check').status).toBe(0)
  })
})
