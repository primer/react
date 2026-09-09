import {clsx} from 'clsx'
import type React from 'react'
import {useId, useMemo} from 'react'
import {VisuallyHidden} from '../VisuallyHidden'
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
}

function TableGroup({className, id, label, rowCount, colSpan, children, 'aria-label': ariaLabel}: TableGroupProps) {
  const headerId = useId()
  const accessibleName = `${label}, ${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`
  const contextValue = useMemo(() => ({headerId}), [headerId])

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
            className={clsx('TableGroupHeaderCell', classes.TableGroupHeaderCell)}
            scope="colgroup"
            colSpan={colSpan}
            role="columnheader"
            aria-label={ariaLabel}
            data-component="Table.Group.Header"
          >
            <VisuallyHidden>{accessibleName}</VisuallyHidden>
            <span aria-hidden="true" className={clsx('TableGroupHeaderContent', classes.TableGroupHeaderContent)}>
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
