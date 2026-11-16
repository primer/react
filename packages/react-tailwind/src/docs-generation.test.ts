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
  it('documents nested component parts with their own props and rendered elements', () => {
    const treeDocs: {
      subcomponents: Array<{name: string; props: Array<{name: string}>; passthrough?: {element: string}}>
    } = JSON.parse(readFileSync(path.resolve(import.meta.dirname, './components/TreeView/TreeView.docs.json'), 'utf8'))
    const subtree = treeDocs.subcomponents.find(part => part.name === 'TreeView.LinkTree.SubTree')
    expect(subtree?.passthrough?.element).toBe('div')
    expect(subtree?.props.map(prop => prop.name)).toEqual(expect.arrayContaining(['count', 'state']))

    const generated = readFileSync(path.resolve(import.meta.dirname, '../llms/TreeView.md'), 'utf8')
    expect(generated).toContain('## TreeView.LinkTree.SubTree')
    const subtreeSection = generated.split('## TreeView.LinkTree.SubTree\n')[1]?.split('\n## ')[0]
    expect(subtreeSection).toContain('Renders a [`<div>`]')
    expect(subtreeSection).toContain('`count`')
    expect(subtreeSection).toContain('`state`')
  })

  it('checks the index and all component files without modifying stale or extra files', () => {
    outputDirectory = mkdtempSync(path.join(tmpdir(), 'react-tailwind-llms-'))
    const run = (...args: string[]) =>
      spawnSync(process.execPath, [generator, '--output-dir', outputDirectory!, ...args], {encoding: 'utf8'})

    expect(run().status).toBe(0)
    expect(run('--check').status).toBe(0)
    const iconButton = readFileSync(path.join(outputDirectory, 'llms/IconButton.md'), 'utf8')
    expect(iconButton).toContain('requires an accessible name from either `aria-label` or `aria-labelledby`')
    expect(iconButton).toContain('- `aria-label`: `string`')
    expect(iconButton).toContain('- `aria-labelledby`: `string`')
    expect(iconButton).not.toContain('- `aria-label` (required)')
    expect(readFileSync(path.join(outputDirectory, 'llms/IconLinkButton.md'), 'utf8')).toContain(
      'requires an accessible name from either `aria-label` or `aria-labelledby`',
    )
    const selectPanelAlignment = readFileSync(
      path.resolve(import.meta.dirname, './components/SelectPanel/ALIGNMENT.md'),
      'utf8',
    )
    const selectPanelNotes = selectPanelAlignment
      .split('## Migration notes\n')[1]
      .split('\n')
      .filter(line => line.startsWith('- '))
    const generatedSelectPanel = readFileSync(path.join(outputDirectory, 'llms/SelectPanel.md'), 'utf8')
    expect(selectPanelNotes.length).toBeGreaterThan(1)
    for (const note of selectPanelNotes) expect(generatedSelectPanel).toContain(note)
    // Indented blocks belonging to a note, such as the inside-* placement table, must survive generation.
    expect(readFileSync(path.join(outputDirectory, 'llms/ActionMenu.md'), 'utf8')).toContain(
      '| `inside-bottom` | `bottom` | `({positioner}) => -positioner.height - 8` | `0` |',
    )
    expect(readFileSync(path.join(outputDirectory, 'llms.txt'), 'utf8')).toContain(
      'does not generate arbitrary app-owned Tailwind classes',
    )
    expect(readFileSync(path.join(outputDirectory, 'llms.txt'), 'utf8')).toContain(
      'Package-owned utilities use the `primer:` prefix',
    )
    expect(readFileSync(path.join(outputDirectory, 'llms/Button.md'), 'utf8')).toContain(
      'Use `submit` to submit a form.',
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
  }, 60_000)
})
