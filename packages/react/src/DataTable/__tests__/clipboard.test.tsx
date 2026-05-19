import {describe, expect, it, test, vi, beforeEach, afterEach} from 'vitest'
import userEvent from '@testing-library/user-event'
import {render, screen, waitFor} from '@testing-library/react'
import {Table} from '../../DataTable'
import type {Column} from '../column'
import {createColumnHelper} from '../column'
import {escapeMarkdownCell, getExportableCellValue, rowsToMarkdown, writeTextToClipboard} from '../clipboard'
import type {UniqueRow} from '../row'

type Repo = {id: number; name: string; type: 'public' | 'private'; tags: string[]}

const repos: Repo[] = [
  {id: 1, name: 'github', type: 'public', tags: ['core']},
  {id: 2, name: 'enterprise-security', type: 'private', tags: ['security', 'audit']},
]

function buildColumns(): Array<Column<Repo>> {
  const ch = createColumnHelper<Repo>()
  return [ch.column({header: 'Name', field: 'name'}), ch.column({header: 'Type', field: 'type'})]
}

describe('Markdown clipboard export', () => {
  describe('escapeMarkdownCell — security model', () => {
    test.each([
      ['pipe characters are backslash-escaped', 'a|b|c', 'a\\|b\\|c'],
      ['backslashes are doubled first so escaped pipes survive', 'a\\b', 'a\\\\b'],
      ['LF newlines collapse to a single space', 'line1\nline2', 'line1 line2'],
      ['CRLF newlines collapse to a single space', 'line1\r\nline2', 'line1 line2'],
      ['lone CR collapses to a single space', 'line1\rline2', 'line1 line2'],
      ['null bytes are stripped', 'a\u0000b', 'ab'],
      ['ASCII control characters are stripped', 'a\u0001\u0002\u001fb', 'ab'],
      ['DEL is stripped', 'a\u007fb', 'ab'],
      ['C1 control range is stripped', 'a\u0080\u009fb', 'ab'],
      ['leading and trailing whitespace is trimmed', '  hello  ', 'hello'],
      ['the empty string is preserved', '', ''],
    ])('%s', (_label, input, expected) => {
      expect(escapeMarkdownCell(input)).toBe(expected)
    })

    it('strips TAB as part of the control-char policy (consistent for table cells)', () => {
      expect(escapeMarkdownCell('a\tb')).toBe('ab')
    })

    it('does not introduce HTML or break out into Markdown structures', () => {
      // Crafted input that *would* be a table breakout in naive
      // implementations: pipes, newlines, backticks, brackets, asterisks.
      const malicious = '| evil |\n| --- |\n| `cmd` | [link](javascript:alert(1)) | **bold** |'
      const escaped = escapeMarkdownCell(malicious)
      // Pipes are escaped.
      expect(escaped).not.toMatch(/(^|[^\\])\|/)
      // No newlines remain.
      expect(escaped).not.toMatch(/[\r\n]/)
      // Backticks, brackets, asterisks are intentionally NOT escaped — they
      // can't break the table layout. The cell renders as styled text in
      // the consumer's Markdown renderer, which is acceptable. The contract
      // is "cannot break out of the cell" not "renders as plain text".
      expect(escaped).toContain('`cmd`')
    })
  })

  describe('getExportableCellValue', () => {
    it('prefers `column.getExportValue` when provided', () => {
      const col: Column<Repo> = {header: 'Name', field: 'name', getExportValue: row => `<<${row.name}>>`}
      expect(getExportableCellValue(repos[0], col)).toBe('<<github>>')
    })

    it('falls back to the field value when getExportValue is omitted', () => {
      const col: Column<Repo> = {header: 'Name', field: 'name'}
      expect(getExportableCellValue(repos[0], col)).toBe('github')
    })

    it('joins arrays with ", "', () => {
      const col: Column<Repo> = {header: 'Tags', field: 'tags'}
      expect(getExportableCellValue(repos[1], col)).toBe('security, audit')
    })

    it('JSON-stringifies plain objects', () => {
      type T = {id: number; meta: {kind: string}}
      const col: Column<T> = {header: 'Meta', field: 'meta'}
      expect(getExportableCellValue({id: 1, meta: {kind: 'a'}}, col)).toBe('{"kind":"a"}')
    })

    it('returns empty string for null / undefined', () => {
      type T = UniqueRow & {value?: string}
      const col: Column<T> = {header: 'Value', field: 'value'}
      expect(getExportableCellValue({id: 1}, col)).toBe('')
    })

    it('does NOT call renderCell — keeps React output out of the export', () => {
      const renderCell = vi.fn(() => null)
      const col: Column<Repo> = {header: 'Name', field: 'name', renderCell}
      expect(getExportableCellValue(repos[0], col)).toBe('github')
      expect(renderCell).not.toHaveBeenCalled()
    })

    it('handles dotted field paths', () => {
      type T = UniqueRow & {nested: {value: string}}
      const col: Column<T> = {header: 'Nested', field: 'nested.value'} as Column<T>
      expect(getExportableCellValue({id: 1, nested: {value: 'deep'}}, col)).toBe('deep')
    })
  })

  describe('rowsToMarkdown', () => {
    it('produces a well-formed GitHub-flavoured Markdown table', () => {
      const md = rowsToMarkdown(repos, buildColumns())
      expect(md).toBe(
        ['| Name | Type |', '| --- | --- |', '| github | public |', '| enterprise-security | private |'].join('\n'),
      )
    })

    it('escapes pipes and newlines in cell content', () => {
      const data: Array<UniqueRow & {note: string}> = [{id: 1, note: 'a|b\nc'}]
      const ch = createColumnHelper<(typeof data)[number]>()
      const cols = [ch.column({header: 'Note', field: 'note'})]
      const md = rowsToMarkdown(data, cols)
      expect(md.split('\n')[2]).toBe('| a\\|b c |')
    })

    it('escapes pipes in the column header label', () => {
      const data: Array<UniqueRow & {value: string}> = [{id: 1, value: 'x'}]
      const ch = createColumnHelper<(typeof data)[number]>()
      const cols = [ch.column({header: 'Pipe | header', field: 'value'})]
      const md = rowsToMarkdown(data, cols)
      expect(md.split('\n')[0]).toBe('| Pipe \\| header |')
    })

    it('uses the column id when the header is a function', () => {
      const data: Array<UniqueRow & {value: string}> = [{id: 1, value: 'x'}]
      const ch = createColumnHelper<(typeof data)[number]>()
      const cols = [ch.column({id: 'fancy', header: () => null, field: 'value'})]
      const md = rowsToMarkdown(data, cols)
      expect(md.split('\n')[0]).toBe('| fancy |')
    })

    it('returns empty string when there are no columns', () => {
      expect(rowsToMarkdown(repos, [])).toBe('')
    })

    it('still produces header and separator rows for empty data', () => {
      const md = rowsToMarkdown([], buildColumns())
      expect(md).toBe(['| Name | Type |', '| --- | --- |'].join('\n'))
    })
  })

  describe('writeTextToClipboard', () => {
    let originalClipboard: Clipboard | undefined

    beforeEach(() => {
      originalClipboard = navigator.clipboard
    })

    afterEach(() => {
      if (originalClipboard !== undefined) {
        Object.defineProperty(navigator, 'clipboard', {value: originalClipboard, configurable: true})
      }
    })

    it('uses the Clipboard API when available and resolves to true', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {value: {writeText}, configurable: true})
      await expect(writeTextToClipboard('hello')).resolves.toBe(true)
      expect(writeText).toHaveBeenCalledWith('hello')
    })

    it('falls back to execCommand when the Clipboard API throws', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('not allowed'))
      Object.defineProperty(navigator, 'clipboard', {value: {writeText}, configurable: true})
      const execCommand = vi.spyOn(document, 'execCommand').mockReturnValue(true)
      await expect(writeTextToClipboard('hello')).resolves.toBe(true)
      expect(execCommand).toHaveBeenCalledWith('copy')
      execCommand.mockRestore()
    })
  })

  describe('Table.CopyAsMarkdownButton (component)', () => {
    let originalClipboard: Clipboard | undefined

    beforeEach(() => {
      originalClipboard = navigator.clipboard
    })

    afterEach(() => {
      if (originalClipboard !== undefined) {
        Object.defineProperty(navigator, 'clipboard', {value: originalClipboard, configurable: true})
      }
    })

    it('renders a button with the default label', () => {
      render(<Table.CopyAsMarkdownButton rows={repos} columns={buildColumns()} />)
      expect(screen.getByRole('button', {name: /copy as markdown/i})).toBeInTheDocument()
    })

    it('writes the serialised markdown to the clipboard on click', async () => {
      const user = userEvent.setup()
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {value: {writeText}, configurable: true})
      render(<Table.CopyAsMarkdownButton rows={repos} columns={buildColumns()} />)
      await user.click(screen.getByRole('button'))
      expect(writeText).toHaveBeenCalledWith(rowsToMarkdown(repos, buildColumns()))
    })

    it('shows the success label transiently after copying', async () => {
      const user = userEvent.setup()
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {value: {writeText}, configurable: true})
      render(<Table.CopyAsMarkdownButton rows={repos} columns={buildColumns()} successDurationMs={50} />)
      await user.click(screen.getByRole('button'))
      await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-state', 'copied'))
      await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-state', 'idle'), {timeout: 500})
    })

    it('calls onCopy with the markdown payload and success boolean', async () => {
      const user = userEvent.setup()
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {value: {writeText}, configurable: true})
      const onCopy = vi.fn()
      render(<Table.CopyAsMarkdownButton rows={repos} columns={buildColumns()} onCopy={onCopy} />)
      await user.click(screen.getByRole('button'))
      const expected = rowsToMarkdown(repos, buildColumns())
      expect(onCopy).toHaveBeenCalledWith(expected, true)
    })

    it('respects a custom button label via children', () => {
      render(
        <Table.CopyAsMarkdownButton rows={repos} columns={buildColumns()}>
          Export as MD
        </Table.CopyAsMarkdownButton>,
      )
      expect(screen.getByRole('button', {name: /export as md/i})).toBeInTheDocument()
    })
  })
})
