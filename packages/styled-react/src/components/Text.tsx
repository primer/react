import {type SxProp, Text as PrimerText, type TextProps as PrimerTextProps} from '@primer/react'
import {sx} from '../sx'
import styled from 'styled-components'
import type React from 'react'

type TextProps = PrimerTextProps & SxProp

const StyledText = styled(PrimerText).withConfig<TextProps>({
  shouldForwardProp: prop => (prop as keyof TextProps) != 'sx',
})<TextProps>`
  ${sx}
`

const Text = ({as, ...props}: TextProps) => {
  return <StyledText {...props} {...(as ? {forwardedAs: as as React.ElementType} : {})} />
}

export {Text, type TextProps}
