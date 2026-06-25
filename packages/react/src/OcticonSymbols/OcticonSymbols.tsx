import type {PropsWithChildren} from 'react'

type OcticonSymbolsProps = PropsWithChildren<Record<string, never>>

function OcticonsSymbols({children}: OcticonSymbolsProps) {
  return <>{children}</>
}

export {OcticonsSymbols}
export type {OcticonSymbolsProps}
