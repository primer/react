import type {PropsWithChildren, ReactElement} from 'react'

type OcticonSymbolsProps = PropsWithChildren<{
  symbols: Array<ReactElement<any>>
}>

function OcticonSymbols({children, symbols}: OcticonSymbolsProps) {
  return (
    <>
      <svg aria-hidden="true" height={0} width={0} display="none">
        {symbols}
      </svg>
      {children}
    </>
  )
}

export {OcticonSymbols}
export type {OcticonSymbolsProps}
