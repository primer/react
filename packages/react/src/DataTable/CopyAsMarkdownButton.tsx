import {clsx} from 'clsx'
import React, {useCallback, useRef, useState} from 'react'
import {CopyIcon, CheckIcon} from '@primer/octicons-react'
import {Button} from '../Button'
import type {Column} from './column'
import type {UniqueRow} from './row'
import {rowsToMarkdown, writeTextToClipboard} from './clipboard'
import {useDataTableSnapshot} from './snapshotContext'
import classes from './CopyAsMarkdownButton.module.css'

export type CopyAsMarkdownButtonProps<Data extends UniqueRow> = {
  /**
   * Rows to serialise. When the button is rendered inside a
   * `<Table.Container>` that contains a sibling `<DataTable>`, the button
   * automatically reads the visible rows from context (after sort, filter,
   * and pagination have been applied). Provide this prop explicitly when
   * using the button standalone, or to override the context-sourced rows.
   */
  rows?: ReadonlyArray<Data>

  /**
   * Columns to serialise. Like `rows`, the button reads columns from the
   * sibling `<DataTable>` context when available. Provide this prop
   * explicitly when using the button standalone.
   */
  columns?: ReadonlyArray<Column<Data>>

  /** Override the label shown on the button. */
  children?: React.ReactNode

  /**
   * Override the transient success label (defaults to "Copied").
   * The label reverts to `children` after `successDurationMs`.
   */
  copiedLabel?: React.ReactNode

  /**
   * Override the transient failure label (defaults to "Copy failed").
   * The label reverts to `children` after `successDurationMs`.
   */
  errorLabel?: React.ReactNode

  /** How long to show the copied/error label in ms. Default 2000. */
  successDurationMs?: number

  /** Called with the markdown string and the success status of the copy. */
  onCopy?: (markdown: string, success: boolean) => void

  /** Optional additional class name. */
  className?: string
}

type CopyState = 'idle' | 'copied' | 'error'

/**
 * Slot-style button that serialises the visible rows of a sibling
 * `<DataTable>` as a GitHub-flavoured Markdown table and writes the
 * result to the system clipboard. Designed for composition inside
 * `<Table.Actions>`:
 *
 * ```tsx
 * <Table.Container>
 *   <Table.Title id="repositories">Repositories</Table.Title>
 *   <Table.Actions>
 *     <Table.CopyAsMarkdownButton />
 *   </Table.Actions>
 *   <DataTable data={repos} columns={columns} />
 * </Table.Container>
 * ```
 *
 * The button reads the rows currently displayed by the sibling
 * `<DataTable>` via React context — *after* the table's internal sort,
 * filter, and pagination have been applied — so the clipboard payload
 * matches what the user is looking at. Standalone usage outside a
 * `<Table.Container>` still works by passing `rows` and `columns` as
 * explicit props.
 *
 * Serialisation explicitly does NOT call `renderCell`. Cell values are
 * projected via `column.getExportValue` (preferred) or the field value,
 * then escaped (pipes, backslashes, angle brackets, newlines, control
 * characters). See `clipboard.ts` for the full security model.
 */
export function CopyAsMarkdownButton<Data extends UniqueRow>({
  rows: rowsProp,
  columns: columnsProp,
  children = 'Copy as Markdown',
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
  successDurationMs = 2000,
  onCopy,
  className,
}: CopyAsMarkdownButtonProps<Data>) {
  const snapshot = useDataTableSnapshot<Data>()
  // Explicit props override the context snapshot so standalone usage and
  // override scenarios both keep working. Wrapped in useMemo so the
  // useCallback below has stable dependencies — without this the `??`
  // chain creates a new fallback array on every render.
  const rows = React.useMemo(() => rowsProp ?? snapshot?.rows ?? [], [rowsProp, snapshot?.rows])
  const columns = React.useMemo(() => columnsProp ?? snapshot?.columns ?? [], [columnsProp, snapshot?.columns])

  const [state, setState] = useState<CopyState>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = useCallback(async () => {
    const markdown = rowsToMarkdown(rows, columns)
    const ok = await writeTextToClipboard(markdown)
    setState(ok ? 'copied' : 'error')
    onCopy?.(markdown, ok)
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setState('idle')
      timeoutRef.current = null
    }, successDurationMs)
  }, [rows, columns, onCopy, successDurationMs])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const label = state === 'copied' ? copiedLabel : state === 'error' ? errorLabel : children
  const icon = state === 'copied' ? CheckIcon : CopyIcon

  return (
    <Button
      className={clsx(classes.CopyAsMarkdownButton, className)}
      data-component="Table.CopyAsMarkdownButton"
      data-state={state}
      leadingVisual={icon}
      onClick={handleClick}
      type="button"
    >
      {label}
    </Button>
  )
}
