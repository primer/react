import {type FlashProps as PrimerFlashProps, Flash as PrimerFlash} from '@primer/react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'

type FlashProps = PrimerFlashProps & SxProp

const Flash: ForwardRefComponent<'div', FlashProps> = styled(PrimerFlash).withConfig<FlashProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

export {Flash}
export type {FlashProps}
