import type {PropsWithChildren} from 'react'

type OcticonSymbolsProps = PropsWithChildren<{}>

function OcticonSymbols({children}: OcticonSymbolsProps) {
  return (
    <svg aria-hidden="true" height={0} width={0} display="none">
      {children}
    </svg>
  )
}

export {OcticonSymbols}
export type {OcticonSymbolsProps}
