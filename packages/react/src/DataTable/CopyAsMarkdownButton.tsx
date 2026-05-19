import {clsx} from 'clsx'
import React, {useCallback, useRef, useState} from 'react'
import {CopyIcon, CheckIcon} from '@primer/octicons-react'
import {Button} from '../Button'
import type {Column} from './column'
import type {UniqueRow} from './row'
import {rowsToMarkdown, writeTextToClipboard} from './clipboard'
import classes from './CopyAsMarkdownButton.module.css'

export type CopyAsMarkdownButtonProps<Data extends UniqueRow> = {
  /** Rows to serialise. Usually the same array passed to `<DataTable>`. */
  rows: ReadonlyArray<Data>

  /** Columns to serialise. Usually the same array passed to `<DataTable>`. */
  columns: ReadonlyArray<Column<Data>>

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
 * Slot-style button that serialises the given rows and columns to a
 * GitHub-flavoured Markdown table and writes the result to the system
 * clipboard. Intended to be composed inside `<Table.Actions>`:
 *
 * ```tsx
 * <Table.Container>
 *   <Table.Title id="repositories">Repositories</Table.Title>
 *   <Table.Actions>
 *     <Table.CopyAsMarkdownButton rows={repos} columns={columns} />
 *   </Table.Actions>
 *   <DataTable data={repos} columns={columns} />
 * </Table.Container>
 * ```
 *
 * The serialisation explicitly does NOT call `renderCell`. Cell values are
 * projected via `column.getExportValue` (preferred) or the field value,
 * then escaped. See `clipboard.ts` for the full security model.
 */
export function CopyAsMarkdownButton<Data extends UniqueRow>({
  rows,
  columns,
  children = 'Copy as Markdown',
  copiedLabel = 'Copied',
  errorLabel = 'Copy failed',
  successDurationMs = 2000,
  onCopy,
  className,
}: CopyAsMarkdownButtonProps<Data>) {
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
