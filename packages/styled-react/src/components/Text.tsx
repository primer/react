import {Text as PrimerText, type TextProps as PrimerTextProps} from '@primer/react'
import {sx, type SxProp} from '../sx'
import styled from 'styled-components'
import type React from 'react'
import {type StyledComponent} from 'styled-components'
import {forwardRef} from 'react'

type TextProps = PrimerTextProps & SxProp

const StyledText = styled(PrimerText).withConfig<TextProps>({
  shouldForwardProp: prop => (prop as keyof TextProps) !== 'sx',
})<TextProps>`
  ${sx}
`

const Text = forwardRef<'span', TextProps>(({as, ...props}, ref) => {
  return <StyledText {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as StyledComponent<'span', any, TextProps, never>

export {Text, type TextProps}
