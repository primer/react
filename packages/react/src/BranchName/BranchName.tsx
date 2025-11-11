import type React from 'react'
import type {ForwardedRef} from 'react'
import {clsx} from 'clsx'
import classes from './BranchName.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'

export type BranchNameProps<As extends React.ElementType = 'a'> = PolymorphicProps<
  As,
  'a',
  {
    className?: string
  }
> &
  (As extends 'a' ? {href: string} : {href?: never})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BranchName<As extends React.ElementType = 'a'>(props: BranchNameProps<As>, ref: ForwardedRef<any>) {
  const {as: Component = 'a', className, children, ...rest} = props
  return (
    <Component {...rest} ref={ref} className={clsx(className, classes.BranchName)}>
      {children}
    </Component>
  )
}

BranchName.displayName = 'BranchName'

export default fixedForwardRef(BranchName)
