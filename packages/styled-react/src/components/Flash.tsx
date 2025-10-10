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

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Flash.__SLOT__ = PrimerFlash.__SLOT__

export {Flash}
export type {FlashProps}
