import {clsx} from 'clsx'
import React, {forwardRef, useEffect} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {ComponentProps} from '../utils/types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import classes from './Heading.module.css'
import {warning} from '../utils/warning'

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type StyledHeadingProps = {
  as?: HeadingLevels
  variant?: 'large' | 'medium' | 'small'
}

const Heading = forwardRef(({as: Component = 'h2', className, variant, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLHeadingElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  useEffect(() => {
    warning(
      innerRef.current != null && !(innerRef.current instanceof HTMLHeadingElement),
      'This Heading component should be an instanceof of h1-h6',
    )
  }, [innerRef])

  return <Component className={clsx(className, classes.Heading)} data-variant={variant} {...props} ref={innerRef} />
}) as PolymorphicForwardRefComponent<HeadingLevels, StyledHeadingProps>

Heading.displayName = 'Heading'

export type HeadingProps = ComponentProps<typeof Heading>
export default Heading
