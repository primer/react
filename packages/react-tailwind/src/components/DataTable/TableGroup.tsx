'use client'

import {ChevronRightIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {ButtonBase} from '../Button'
import {Checkbox} from '../Checkbox'
import {VisuallyHidden} from '../VisuallyHidden'
import {TableRow} from './Table'
import {TableGroupContext} from './TableGroupContext'

const bodyClassName = 'grid grid-cols-subgrid [grid-column:-1/1]'

export interface TableGroupProps {
  /** Class name for the group header section. */
  className?: string
  /** Stable identifier exposed on both group sections as `data-group-id`. */
  id: string | number
  /** Visible label for the group header. */
  label: string
  /** Number of member rows in the group, announced alongside the label. */
  rowCount: number
  /** Accessible name for the group header, for when the visible label needs more context. */
  'aria-label'?: string
  /** Number of columns the group header spans. */
  colSpan: number
  /** Member rows of the group. */
  children?: React.ReactNode
  /** Adds a disclosure button that shows and hides the member rows. */
  collapsible?: boolean
  /** Whether the member rows are shown, for when the caller owns the expanded state. */
  expanded?: boolean
  /** Whether the member rows are shown on first render, when the group owns its expanded state. */
  defaultExpanded?: boolean
  /** Called with the requested expanded state when the disclosure button is activated. */
  onExpandedChange?: (details: {expanded: boolean}) => void
  /** Whether all, some, or none of the group's selectable rows are selected. Renders a group checkbox when set. */
  selection?: 'all' | 'some' | 'none'
  /** Prevents toggling the group checkbox, for when the group has no selectable rows. */
  selectionDisabled?: boolean
  /** Called when the reader asks to select or clear every selectable row in the group. */
  onToggleSelect?: () => void
}

/** A labelled, optionally collapsible section of table rows. Renders a header body followed by a member body. */
export function TableGroup({
  'aria-label': ariaLabel,
  children,
  className,
  colSpan,
  collapsible = false,
  defaultExpanded = true,
  expanded: controlledExpanded,
  id,
  label,
  onExpandedChange,
  onToggleSelect,
  rowCount,
  selection,
  selectionDisabled,
}: TableGroupProps) {
  const headerId = React.useId()
  const bodyId = React.useId()
  const headerRef = React.useRef<HTMLTableCellElement>(null)
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded)
  const expanded = controlledExpanded ?? uncontrolledExpanded
  const isExpanded = !collapsible || expanded
  const rowCountLabel = `${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`

  const toggleExpanded = () => {
    if (controlledExpanded === undefined) setUncontrolledExpanded(!expanded)
    onExpandedChange?.({expanded: !expanded})
  }

  // Restore focus during the collapse commit, including externally controlled changes.
  const bodyRef = (body: HTMLTableSectionElement | null) => {
    if (!isExpanded && body?.contains(body.ownerDocument.activeElement)) {
      headerRef.current?.querySelector<HTMLElement>('[data-component="Table.Group.Toggle"]')?.focus()
    }
  }

  return (
    <>
      <tbody data-component="Table.Group" data-group-id={id} className={cn(bodyClassName, className)}>
        <TableRow>
          <th
            ref={headerRef}
            id={headerId}
            aria-label={collapsible || selection !== undefined ? (ariaLabel ?? label) : ariaLabel}
            colSpan={colSpan}
            data-component="Table.Group.Header"
            role="columnheader"
            scope="colgroup"
            className={cn(
              'col-span-full flex items-center gap-x-6 border-x border-b border-default bg-muted px-4 py-2 text-start text-muted',
              'group-data-[cell-padding=condensed]:gap-x-4 group-data-[cell-padding=condensed]:py-1 group-data-[cell-padding=spacious]:gap-x-8 group-data-[cell-padding=spacious]:py-3',
              // Round the header when it closes the table because its members are hidden or absent.
              "[[data-component='Table.OverflowWrapper']:last-child_tbody:has(+tbody:is([hidden],:empty):last-child)>tr>&]:rounded-b-md",
            )}
          >
            {selection !== undefined ? (
              <Checkbox
                aria-label={`Select ${ariaLabel ?? label}`}
                checked={selection === 'all'}
                className="shrink-0"
                disabled={selectionDisabled || !onToggleSelect}
                indeterminate={selection === 'some'}
                onCheckedChange={() => onToggleSelect?.()}
              />
            ) : null}
            <span data-selection={selection} className="flex items-center gap-x-[inherit] data-[selection]:gap-x-2">
              {collapsible ? (
                <ButtonBase
                  type="button"
                  aria-controls={bodyId}
                  aria-description={rowCountLabel}
                  aria-expanded={isExpanded}
                  aria-label={ariaLabel ?? label}
                  data-component="Table.Group.Toggle"
                  onClick={toggleExpanded}
                  className="-mx-1 -my-0.5 size-6 min-w-0 shrink-0 justify-center self-center rounded-sm border-0 bg-transparent p-0 text-default hover:bg-neutral-muted aria-expanded:[&>svg]:rotate-90"
                >
                  <ChevronRightIcon aria-hidden="true" />
                </ButtonBase>
              ) : null}
              <span aria-hidden={collapsible || undefined} className="flex items-baseline gap-x-2">
                <span className="font-semibold text-default">
                  {label}
                  <VisuallyHidden>,</VisuallyHidden>
                </span>
                <span className="text-muted">
                  {rowCount}
                  <VisuallyHidden>{rowCount === 1 ? ' row' : ' rows'}</VisuallyHidden>
                </span>
              </span>
            </span>
          </th>
        </TableRow>
      </tbody>
      <tbody
        ref={bodyRef}
        id={bodyId}
        hidden={!isExpanded}
        data-component="Table.Group.Body"
        data-group-id={id}
        data-selection={collapsible ? selection : undefined}
        className={cn(
          bodyClassName,
          '[&[hidden]]:hidden',
          // Indent member rows under the group label, past the disclosure button.
          "data-[selection]:[&>tr>:nth-child(2)]:before:flex-[0_0_--spacing(6)] data-[selection]:[&>tr>:nth-child(2)]:before:content-['']",
        )}
      >
        <TableGroupContext.Provider value={{headerId}}>{children}</TableGroupContext.Provider>
      </tbody>
    </>
  )
}
