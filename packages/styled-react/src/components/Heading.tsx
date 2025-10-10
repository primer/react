import {Heading as PrimerHeading} from '@primer/react'
import {type HeadingProps as PrimerHeadingProps} from '@primer/react'
import type {ForwardRefComponent} from '../polymorphic'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type HeadingProps = PrimerHeadingProps & SxProp

const Heading: ForwardRefComponent<HeadingLevels, HeadingProps> = styled(PrimerHeading).withConfig({
  shouldForwardProp: prop => (prop as keyof HeadingProps) !== 'sx',
})<HeadingProps>`
  ${sx}
`

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Heading.__SLOT__ = PrimerHeading.__SLOT__

export {Heading, type HeadingProps}
