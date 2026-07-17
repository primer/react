import {createContext, Fragment, useContext} from 'react'
import type {FC, ReactNode} from 'react'
import type {OcticonSymbol} from './OcticonSymbol'

interface OcticonSymbolsProps {
  children?: ReactNode
  symbols: ReadonlyArray<OcticonSymbol>
}

const OcticonSymbolsContext = createContext<ReadonlySet<string>>(new Set())

const OcticonSymbols: FC<OcticonSymbolsProps> = ({children, symbols}) => {
  const inheritedSymbolIds = useContext(OcticonSymbolsContext)
  const registeredSymbolIds = new Set(inheritedSymbolIds)
  const symbolsToRender: Array<OcticonSymbol> = []

  for (const symbol of symbols) {
    if (!registeredSymbolIds.has(symbol.id)) {
      registeredSymbolIds.add(symbol.id)
      symbolsToRender.push(symbol)
    }
  }

  return (
    <OcticonSymbolsContext.Provider value={registeredSymbolIds}>
      {symbolsToRender.length > 0 ? (
        <svg aria-hidden="true" height={0} width={0} display="none">
          {symbolsToRender.map(symbol => {
            return <Fragment key={symbol.id}>{symbol.definition}</Fragment>
          })}
        </svg>
      ) : null}
      {children}
    </OcticonSymbolsContext.Provider>
  )
}

export {OcticonSymbols}
export type {OcticonSymbolsProps}
