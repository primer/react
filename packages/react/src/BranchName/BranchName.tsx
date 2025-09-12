import type React from 'react'
import {clsx} from 'clsx'
import classes from './BranchName.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'

type BranchNameProps<As extends React.ElementType = 'a'> = PolymorphicProps<
  As,
  'a',
  {
    className?: string
  }
>

const BranchName = fixedForwardRef<HTMLAnchorElement, BranchNameProps<React.ElementType>>(function BranchName<
  As extends React.ElementType = 'a',
>(props: BranchNameProps<As>, ref: React.Ref<HTMLAnchorElement>) {
  const {as: Component = 'a', className, children, ...rest} = props
  return (
    <Component {...rest} ref={ref} className={clsx(className, classes.BranchName)}>
      {children}
    </Component>
  )
})

Object.assign(BranchName, {displayName: 'BranchName'})

export type {BranchNameProps}

export default BranchName
