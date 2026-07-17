import type {ReactNode} from 'react'

interface OcticonSymbol {
  /**
   * The unique identifier for the symbol. This is used to reference the symbol in the SVG `<use>` element.
   */
  readonly id: string

  /**
   * The SVG definition of the symbol. This is the SVG content that will be rendered when the symbol is used.
   */
  readonly definition: ReactNode
}

/**
 * Creates an OcticonSymbol object with the given id and definition. This allows
 * custom symbols to be created and used in the OcticonSymbols component.
 */
function createOcticonSymbol({id, definition}: OcticonSymbol): OcticonSymbol {
  return {
    id,
    definition,
  }
}

export {createOcticonSymbol}
export type {OcticonSymbol}
