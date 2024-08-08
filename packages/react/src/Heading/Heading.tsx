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
  variant?: 'large' | 'medium' | 'small'
} & SxProp

const StyledHeading = styled.h2<StyledHeadingProps>`
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.5')};
  margin: 0;

  &:where([data-variant='large']) {
    font: var(--text-title-shorthand-large, 600 32px / 1.5 ${get('fonts.normal')});
  }

  &:where([data-variant='medium']) {
    font: var(--text-title-shorthand-medium, 600 20px / 1.6 ${get('fonts.normal')});
  }

  &:where([data-variant='small']) {
    font: var(--text-title-shorthand-small, 600 16px / 1.5 ${get('fonts.normal')});
  }
  ${sx};
`

/**
 * @primerid heading
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export const Heading = forwardRef(({as: Component = 'h2', variant, ...props}, forwardedRef) => {
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
      data-variant={variant}
    />
  )
}) as PolymorphicForwardRefComponent<'h2', StyledHeadingProps>

Heading.displayName = 'Heading'

export type HeadingProps = ComponentProps<typeof Heading>
