import {Truncate as PrimerTruncate, type TruncateProps as PrimerTruncateProps} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type {PropsWithChildren} from 'react'
import type {ForwardRefComponent} from '../polymorphic'

export type TruncateProps = PropsWithChildren<PrimerTruncateProps> & SxProp

export const Truncate: ForwardRefComponent<'div', TruncateProps> = styled(PrimerTruncate).withConfig<TruncateProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Truncate.__SLOT__ = PrimerTruncate.__SLOT__
