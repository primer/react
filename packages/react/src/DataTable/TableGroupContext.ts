import {createContext} from 'react'

export interface TableGroupContextValue {
  headerId: string
  columnHeaderIds: ReadonlyArray<string>
}

export const TableGroupContext = createContext<TableGroupContextValue | undefined>(undefined)
export const TableRowColumnIndexContext = createContext<number | undefined>(undefined)
