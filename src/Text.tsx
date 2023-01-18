import React from 'react'
import styled from 'styled-components'
import {COMMON, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'

const RestrictedAs = {
  inlineText: ['span', 'p', 'b', 'i', 'em', 'small', 'strong', 'u', 'code', 'q', 's', 'label', 'div'],
} as const

const StyledText = styled.span<SystemTypographyProps & SystemCommonProps & SxProp>`
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export type TextProps = {
  as?: typeof RestrictedAs.inlineText[number]
} & ComponentProps<typeof StyledText>

const Text = ({children, as = 'span', ...rest}: TextProps) => {
  return (
    <StyledText as={RestrictedAs.inlineText.includes(as) ? as : undefined} {...rest}>
      {children}
    </StyledText>
  )
}

export default Text
