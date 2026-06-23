import {createContext, Fragment, useMemo, useState} from 'react'
import type {PropsWithChildren} from 'react'

type OcticonSymbolsProps = PropsWithChildren<Record<string, never>>

type OcticonSymbolsContextValue = {
  registerSymbol(id: string, symbol: React.ReactNode): void
}

const OcticonSymbolsContext = createContext<OcticonSymbolsContextValue | null>(null)

function OcticonSymbols({children}: OcticonSymbolsProps) {
  const [symbols, setSymbols] = useState<Map<string, React.ReactNode>>(() => {
    return new Map()
  })
  const value: OcticonSymbolsContextValue = useMemo(() => {
    return {
      registerSymbol(id, symbol) {
        setSymbols(symbols => {
          if (!symbols.has(id)) {
            const nextSymbols = new Map(symbols)
            nextSymbols.set(id, symbol)
            return nextSymbols
          }
          return symbols
        })
      },
    }
  }, [])

  return (
    <OcticonSymbolsContext.Provider value={value}>
      {children}
      <svg aria-hidden="true" height={0} width={0} display="none">
        {Array.from(symbols.entries()).map(([id, symbol]) => {
          return <Fragment key={id}>{symbol}</Fragment>
        })}
      </svg>
    </OcticonSymbolsContext.Provider>
  )
}

export {OcticonSymbols, OcticonSymbolsContext}
export type {OcticonSymbolsProps}
