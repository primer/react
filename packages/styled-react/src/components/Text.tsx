import {Text as PrimerText, type TextProps as PrimerTextProps} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type React from 'react'
import {forwardRef} from 'react'
import type {ForwardRefComponent} from '../polymorphic'

type TextProps = PrimerTextProps & SxProp

const StyledText = styled(PrimerText).withConfig<TextProps>({
  shouldForwardProp: prop => (prop as keyof TextProps) !== 'sx',
})<TextProps>`
  ${sx}
`

const Text = forwardRef<HTMLElement, TextProps>(({as, ...props}, ref) => {
  return <StyledText {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'span', TextProps>

export {Text, type TextProps}
