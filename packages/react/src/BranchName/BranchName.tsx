import type React from 'react'
import {clsx} from 'clsx'
import classes from './BranchName.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'

type BranchNameProps<As extends React.ElementType = 'a'> = {
  as?: As
  className?: string
} & PolymorphicProps<As, 'a'>

function BranchName<As extends React.ElementType = 'a'>(
  props: BranchNameProps<As>,
  ref: React.ForwardedRef<React.ElementRef<As>>,
) {
  const {as: Component = 'a', className, children, ...rest} = props
  return (
    <Component {...rest} ref={ref} className={clsx(className, classes.BranchName)}>
      {children}
    </Component>
  )
}

BranchName.displayName = 'BranchName'

export type {BranchNameProps}
export default fixedForwardRef(BranchName)
