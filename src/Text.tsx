import React from 'react'
import styled from 'styled-components'
import {COMMON, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from './utils/polymorphic'
import sx, {SxProp} from './sx'

const restrictedAs = {
  inlineText: ['span', 'p', 'b', 'i', 'em', 'small', 'strong', 'u', 'code', 'q', 's', 'label', 'div'],
} as const

const StyledText = styled.span<SystemTypographyProps & SystemCommonProps & SxProp>`
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export type TextProps = {
  as?: typeof restrictedAs.inlineText[number]
} & React.ComponentProps<'span' & typeof StyledText>

const Text = React.forwardRef(({children, as = 'span', ...rest}, forwardedRef) => {
  if (__DEV__ && !restrictedAs.inlineText.includes(as)) {
    console.warn(
      `The usage of \`as\` on the \`<Text>\` component can only be one of following element types: <${restrictedAs.inlineText.join(
        '>, <',
      )}>. Defaults to \`<span>\`.`,
    )
  }

  return (
    <StyledText ref={forwardedRef} as={restrictedAs.inlineText.includes(as) ? as : undefined} {...rest}>
      {children}
    </StyledText>
  )
}) as PolymorphicForwardRefComponent<'span', TextProps>

export default Text
