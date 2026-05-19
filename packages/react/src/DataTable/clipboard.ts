import type {Column} from './column'
import type {UniqueRow} from './row'

// ---------------------------------------------------------------------------
// Markdown export
// ---------------------------------------------------------------------------
//
// Security model: the contents copied to the clipboard are always
// `text/plain`. Cell values are projected to strings using the following
// resolution order — never `renderCell`, which can emit React nodes:
//   1. `column.getExportValue(row)` if provided
//   2. The value at `column.field` (recursively stringified for arrays /
//      JSON.stringify for objects)
//   3. Empty string
//
// Each projected string is then escaped so it cannot break out of a Markdown
// table cell:
//   - `\` → `\\`
//   - `|` → `\|`
//   - CR/LF → single space
//   - ASCII / Unicode control characters → removed
//
// Output is never HTML. There is no fall-through to inline-HTML escape
// hatches like `<br>` (which would let cell content emit markup if a
// downstream renderer chose to honour it).

// Intentional regex that matches ASCII and C1 control characters; the
// no-control-regex lint rule is the wrong tool for this since stripping
// these is exactly the goal.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f]/g

export function escapeMarkdownCell(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(CONTROL_CHARACTERS, '')
    .trim()
}

/**
 * Resolve a cell's exportable string. Intentionally bypasses `renderCell`
 * to keep React/JSX/HTML out of the clipboard payload.
 */
export function getExportableCellValue<Data extends UniqueRow>(row: Data, column: Column<Data>): string {
  if (column.getExportValue) {
    // Cast through `unknown` because the typed return is `string` but the
    // runtime contract should remain forgiving (some callers project from
    // unknown sources and may legitimately return `null`/`undefined`).
    return String((column.getExportValue(row) as unknown) ?? '')
  }
  if (column.field === undefined) return ''
  // We intentionally re-implement field traversal here (rather than import
  // `useTable`'s `get`) to keep this file dependency-light.
  const path = String(column.field).split('.')
  let value: unknown = row
  for (const key of path) {
    if (value === null || value === undefined) break
    value = (value as Record<string, unknown>)[key]
  }
  return stringifyForExport(value)
}

function stringifyForExport(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (Array.isArray(value)) {
    return value.map(v => stringifyForExport(v)).join(', ')
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return ''
    }
  }
  return String(value)
}

/**
 * Serialize a set of rows as a GitHub-flavoured Markdown table. Columns are
 * rendered in the order they're provided; the column header is the literal
 * `header` string (callable `header` functions fall back to the column id).
 */
export function rowsToMarkdown<Data extends UniqueRow>(
  rows: ReadonlyArray<Data>,
  columns: ReadonlyArray<Column<Data>>,
): string {
  if (columns.length === 0) return ''
  const headerLabels = columns.map(column => (typeof column.header === 'string' ? column.header : (column.id ?? '')))
  const headerLine = `| ${headerLabels.map(label => escapeMarkdownCell(label)).join(' | ')} |`
  const separatorLine = `| ${columns.map(() => '---').join(' | ')} |`
  const bodyLines = rows.map(
    row => `| ${columns.map(column => escapeMarkdownCell(getExportableCellValue(row, column))).join(' | ')} |`,
  )
  return [headerLine, separatorLine, ...bodyLines].join('\n')
}

/**
 * Copy text to the system clipboard. Returns a promise that resolves to
 * `true` on success. Prefers the asynchronous Clipboard API; falls back to
 * the synchronous `document.execCommand('copy')` path for non-secure
 * contexts (HTTP, sandboxed iframes) where `navigator.clipboard` is
 * undefined.
 */
export async function writeTextToClipboard(text: string): Promise<boolean> {
  if (
    typeof navigator !== 'undefined' &&
    // navigator.clipboard is undefined in non-secure contexts even though
    // the typings claim it's always defined; the runtime check is a real
    // guard. The eslint disable is necessary because the typed value is
    // not nullable.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Some browsers reject in non-focused contexts; fall through to the
      // execCommand fallback rather than surfacing the error.
    }
  }

  if (typeof document === 'undefined') {
    return false
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-1000px'
  textarea.style.left = '-1000px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  try {
    textarea.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}
