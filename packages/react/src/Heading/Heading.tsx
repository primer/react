import React, {forwardRef, useEffect} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type StyledHeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & SxProp

const StyledHeading = styled.h2<StyledHeadingProps>`
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.5')};
  margin: 0;
  ${sx};
`
const Heading = forwardRef(({as: Component = 'h2', ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLHeadingElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  if (__DEV__) {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (innerRef.current && !(innerRef.current instanceof HTMLHeadingElement)) {
        // eslint-disable-next-line no-console
        console.warn('This Heading component should be an instanceof of h1-h6')
      }
    }, [innerRef])
  }

  return (
    <StyledHeading
      as={Component}
      {...props}
      // @ts-ignore shh
      ref={innerRef}
    />
  )
}) as PolymorphicForwardRefComponent<'h2', StyledHeadingProps>

Heading.displayName = 'Heading'

export type HeadingProps = ComponentProps<typeof Heading>
export default Heading
