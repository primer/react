import {Heading as PrimerHeading} from '@primer/react'
import {sx, type HeadingProps as PrimerHeadingProps} from '@primer/react'
import type {ForwardRefComponent} from '../polymorphic'
import type {SxProp} from '../sx'
import styled from 'styled-components'

type HeadingProps = PrimerHeadingProps & SxProp

const Heading: ForwardRefComponent<'h2', HeadingProps> = styled(PrimerHeading).withConfig({
  shouldForwardProp: prop => (prop as keyof HeadingProps) !== 'sx',
})<HeadingProps>`
  ${sx}
`

export {Heading, type HeadingProps}
