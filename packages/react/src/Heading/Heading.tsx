import cx from 'clsx'
import React, {forwardRef, useEffect} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './Heading.module.css'
import {useFeatureFlag} from '../FeatureFlags'
import Box from '../Box'

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

const Heading = forwardRef(({as: Component = 'h2', className, variant, ...props}, forwardedRef) => {
  const enabled = useFeatureFlag('primer_react_css_modules')
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

  if (enabled) {
    if (props.sx) {
      return (
        <Box
          as={Component}
          className={cx(className, classes.Heading)}
          data-variant={variant}
          {...props}
          // @ts-ignore shh
          ref={innerRef}
        />
      )
    }
    return <Component className={cx(className, classes.Heading)} data-variant={variant} {...props} ref={innerRef} />
  }

  return (
    <StyledHeading
      as={Component}
      className={className}
      data-variant={variant}
      sx={sx}
      {...props}
      // @ts-ignore shh
      ref={innerRef}
    />
  )
}) as PolymorphicForwardRefComponent<'h2', StyledHeadingProps>

Heading.displayName = 'Heading'

export type HeadingProps = ComponentProps<typeof Heading>
export default Heading
