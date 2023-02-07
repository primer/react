import React from 'react'
import styled from 'styled-components'
import {COMMON, SystemCommonProps, SystemTypographyProps, TYPOGRAPHY} from './constants'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from './utils/polymorphic'
import sx, {SxProp} from './sx'

const allowedElements = [
  'span',
  'p',
  'b',
  'i',
  'em',
  'small',
  'strong',
  'u',
  'code',
  'q',
  's',
  'label',
  'ins',
  'del',
  'mark',
  'kbd',
  'abbr',
] as const

const StyledText = styled.span<SystemTypographyProps & SystemCommonProps & SxProp>`
  ${TYPOGRAPHY};
  ${COMMON};
  ${sx};
`

export type TextProps = {
  as?: typeof allowedElements[number]
} & React.ComponentProps<'span' & typeof StyledText>

const Text = React.forwardRef(({children, as = 'span', ...rest}, forwardedRef) => {
  if (__DEV__) {
    if (!allowedElements.includes(as)) {
      // eslint-disable-next-line no-console
      console.warn(
        `The usage of \`as\` on the \`<Text>\` component can only be one of following element types: <${allowedElements.join(
          '>, <',
        )}>. Defaults to \`<span>\`.`,
      )
    }
  }

  return (
    <StyledText ref={forwardedRef} as={allowedElements.includes(as) ? as : undefined} {...rest}>
      {children}
    </StyledText>
  )
}) as PolymorphicForwardRefComponent<'span', TextProps>

export default Text
