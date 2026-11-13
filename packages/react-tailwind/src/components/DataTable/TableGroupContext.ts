'use client'

import React from 'react'

export interface TableGroupContextValue {
  headerId: string
}

/** Carries the enclosing group header id so member cells can reference it through `headers`. */
export const TableGroupContext = React.createContext<TableGroupContextValue | undefined>(undefined)
