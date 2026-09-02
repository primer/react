import {clsx} from 'clsx'
import type React from 'react'
import {useId, useMemo} from 'react'
import {TableRow} from './Table'
import {TableGroupContext} from './TableGroupContext'
import classes from './Table.module.css'

// ----------------------------------------------------------------------------
// TableGroup
// ----------------------------------------------------------------------------

export type TableGroupProps = {
  /**
   * A stable identifier exposed on both group sections as `data-group-id`.
   * The group header's DOM id is generated separately so it is safe for use
   * in `headers`.
   */
  id: string | number

  /**
   * The visible label for the group, shown in the group header and included
   * in its accessible name along with the row count.
   */
  label: string

  /**
   * The number of member rows in the group. Combined with `label` to build
   * the group header's accessible name, for example "Admins, 2 rows".
   */
  rowCount: number

  /**
   * Override the group header's accessible name, for example to localize its
   * row count description.
   */
  'aria-label'?: string

  /**
   * The DOM ids assigned to the table's `Table.Header` elements, in the same
   * order as each member row's direct `Table.Cell` children. Supplying the
   * ids explicitly keeps the associations available during server rendering.
   */
  columnHeaderIds: ReadonlyArray<string>

  /**
   * The group's member rows, typically a list of `Table.Row` elements.
   */
  children?: React.ReactNode
}

function TableGroup({id, label, rowCount, columnHeaderIds, children, 'aria-label': ariaLabel}: TableGroupProps) {
  const headerId = useId()
  const accessibleName = ariaLabel ?? `${label}, ${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`
  const contextValue = useMemo(() => ({headerId, columnHeaderIds}), [headerId, columnHeaderIds])

  return (
    <>
      <tbody
        className={clsx('TableGroupHeaderBody', classes.TableGroupHeaderBody)}
        role="rowgroup"
        data-component="Table.Group"
        data-group-id={id}
      >
        <TableRow>
          <th
            id={headerId}
            className={clsx('TableGroupHeaderCell', classes.TableGroupHeaderCell)}
            scope="colgroup"
            colSpan={columnHeaderIds.length}
            role="columnheader"
            aria-label={accessibleName}
            data-component="Table.Group.Header"
          >
            <span className={clsx('TableGroupHeaderContent', classes.TableGroupHeaderContent)}>
              <span className={clsx('TableGroupHeaderLabel', classes.TableGroupHeaderLabel)}>{label}</span>
              <span className={clsx('TableGroupHeaderCount', classes.TableGroupHeaderCount)}>{rowCount}</span>
            </span>
          </th>
        </TableRow>
      </tbody>
      <tbody
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
