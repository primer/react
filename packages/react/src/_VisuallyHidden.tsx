import classes from './_VisuallyHidden.module.css'
import {clsx} from 'clsx'
import type {PolymorphicProps} from './utils/modern-polymorphic'
import type {ElementType} from 'react'

type VisuallyHiddenProps<As extends ElementType = 'span'> = PolymorphicProps<
  As,
  'span',
  {
    isVisible?: boolean
  }
>

function VisuallyHidden<As extends ElementType = 'span'>({
  isVisible,
  children,
  as,
  className,
  ...rest
}: VisuallyHiddenProps<As>) {
  const Component = as || 'span'
  return (
    <Component {...rest} className={clsx(className, {[classes.InternalVisuallyHidden]: !isVisible})}>
      {children}
    </Component>
  )
}

export default VisuallyHidden
