import {type SxProp, Text as PrimerText, type TextProps as PrimerTextProps} from '@primer/react'
import type {ForwardRefComponent} from '../polymorphic'
import {sx} from '../sx'
import styled from 'styled-components'

type TextProps = PrimerTextProps & SxProp

const Text: ForwardRefComponent<'span' | React.ComponentType<any> | keyof JSX.IntrinsicElements, TextProps> = styled(
  PrimerText,
).withConfig<TextProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`
export {Text, type TextProps}
