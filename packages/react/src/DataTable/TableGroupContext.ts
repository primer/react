import {createContext} from 'react'

export interface TableGroupContextValue {
  headerId: string
}

export const TableGroupContext = createContext<TableGroupContextValue | undefined>(undefined)
