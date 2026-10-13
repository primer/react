import {clsx} from 'clsx'
import type React from 'react'
import {useId, useMemo, useRef} from 'react'
import {ChevronRightIcon} from '@primer/octicons-react'
import {VisuallyHidden} from '../VisuallyHidden'
import {Button} from '../internal/components/ButtonReset'
import {useControllableState} from '../hooks/useControllableState'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {TableRow} from './Table'
import {TableGroupContext} from './TableGroupContext'
import classes from './Table.module.css'

export type TableGroupProps = {
  /**
   * Provide a custom class name for the group header section
   */
  className?: string

  /**
   * Provide a stable identifier exposed on both group sections as `data-group-id`
   */
  id: string | number

  /**
   * Provide a label for the group header
   */
  label: string

  /**
   * Specify the number of member rows in the group
   */
  rowCount: number

  /**
   * Provide an accessible name for the group header
   */
  'aria-label'?: string

  /**
   * Specify the number of columns spanned by the group header
   */
  colSpan: number

  children?: React.ReactNode
  /** Whether the group has a disclosure control. Defaults to false. */
  collapsible?: boolean
  /** Controls whether member rows are displayed. */
  expanded?: boolean
  /** Initial expanded state. Defaults to true. */
  defaultExpanded?: boolean
  /** Handles requests to change the expanded state. */
  onExpandedChange?: ({expanded}: {expanded: boolean}) => void
}

function TableGroup({
  className,
  id,
  label,
  rowCount,
  colSpan,
  children,
  'aria-label': ariaLabel,
  collapsible = false,
  expanded: controlledExpanded,
  defaultExpanded = true,
  onExpandedChange,
}: TableGroupProps) {
  const headerId = useId()
  const bodyId = useId()
  const headerRef = useRef<HTMLTableCellElement>(null)
  const bodyRef = useRef<HTMLTableSectionElement>(null)
  const [expanded, setExpanded] = useControllableState({
    name: 'Table.Group expanded',
    value: controlledExpanded,
    defaultValue: defaultExpanded,
    onChange: value => onExpandedChange?.({expanded: value}),
  })
  const isExpanded = !collapsible || expanded
  const contextValue = useMemo(() => ({headerId}), [headerId])

  // Controlled changes can hide a focused member without activating the disclosure.
  useIsomorphicLayoutEffect(() => {
    const body = bodyRef.current
    if (!isExpanded && body?.contains(body.ownerDocument.activeElement)) {
      headerRef.current?.querySelector('button')?.focus()
    }
  }, [isExpanded])

  return (
    <>
      <tbody
        className={clsx('TableGroupHeaderBody', classes.TableGroupHeaderBody, className)}
        role="rowgroup"
        data-component="Table.Group"
        data-group-id={id}
      >
        <TableRow>
          <th
            id={headerId}
            ref={headerRef}
            className={clsx('TableGroupHeaderCell', classes.TableGroupHeaderCell)}
            scope="colgroup"
            colSpan={colSpan}
            role="columnheader"
            aria-label={collapsible ? (ariaLabel ?? label) : ariaLabel}
            data-component="Table.Group.Header"
          >
            {collapsible ? (
              <Button
                className={classes.TableGroupToggle}
                data-component="Table.Group.Toggle"
                aria-label={ariaLabel ?? label}
                aria-description={`${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`}
                aria-expanded={isExpanded}
                aria-controls={bodyId}
                onClick={() => {
                  setExpanded(!expanded)
                }}
              >
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            ) : null}
            <span
              className={clsx('TableGroupHeaderContent', classes.TableGroupHeaderContent)}
              aria-hidden={collapsible || undefined}
            >
              <span className={clsx('TableGroupHeaderLabel', classes.TableGroupHeaderLabel)}>
                {label}
                <VisuallyHidden>,</VisuallyHidden>
              </span>
              <span className={clsx('TableGroupHeaderCount', classes.TableGroupHeaderCount)}>
                {rowCount}
                <VisuallyHidden>{rowCount === 1 ? ' row' : ' rows'}</VisuallyHidden>
              </span>
            </span>
          </th>
        </TableRow>
      </tbody>
      <tbody
        id={bodyId}
        ref={bodyRef}
        hidden={!isExpanded}
        className={clsx('TableBody', classes.TableBody)}
        role="rowgroup"
        data-component="Table.Group.Body"
        data-group-id={id}
      >
        <TableGroupContext.Provider value={contextValue}>{children}</TableGroupContext.Provider>
      </tbody>
    </>
  )
}

export {TableGroup}
