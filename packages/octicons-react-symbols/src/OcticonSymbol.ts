import type {ReactNode} from 'react'

interface OcticonSymbol {
  readonly id: string
  readonly definition: ReactNode
}

function createOcticonSymbol({id, definition}: OcticonSymbol): OcticonSymbol {
  return {
    id,
    definition,
  }
}

export {createOcticonSymbol}
export type {OcticonSymbol}
