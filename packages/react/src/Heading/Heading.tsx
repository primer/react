import {clsx} from 'clsx'
import React, {forwardRef, useEffect} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {ComponentProps} from '../utils/types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './Heading.module.css'

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type StyledHeadingProps = {
  as?: HeadingLevels
  variant?: 'large' | 'medium' | 'small'
}

const Heading = forwardRef(({as: Component = 'h2', className, variant, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLHeadingElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  if (__DEV__) {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (innerRef.current && !(innerRef.current instanceof HTMLHeadingElement)) {
        // eslint-disable-next-line no-console
        console.warn('This Heading component should be an instanceof of h1-h6')
      }
    }, [innerRef])
  }

  return <Component className={clsx(className, classes.Heading)} data-variant={variant} {...props} ref={innerRef} />
}) as PolymorphicForwardRefComponent<HeadingLevels, StyledHeadingProps>

Heading.displayName = 'Heading'

export type HeadingProps = ComponentProps<typeof Heading>
export default Heading
