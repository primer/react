import {clsx} from 'clsx'
import React, {forwardRef} from 'react'
import {useDevOnlyEffect} from '../internal/hooks/useDevOnlyEffect'
import {useMergedRefs} from '../hooks'
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
  const mergedRef = useMergedRefs(forwardedRef, innerRef)

  useDevOnlyEffect(() => {
    if (innerRef.current && !(innerRef.current instanceof HTMLHeadingElement)) {
      // eslint-disable-next-line no-console
      console.warn('This Heading component should be an instanceof of h1-h6')
    }
  }, [innerRef])

  return (
    <Component
      className={clsx(className, classes.Heading)}
      data-variant={variant}
      data-component="Heading"
      {...props}
      ref={mergedRef}
    />
  )
}) as PolymorphicForwardRefComponent<HeadingLevels, StyledHeadingProps>

Heading.displayName = 'Heading'

export type HeadingProps = ComponentProps<typeof Heading>
export default Heading
