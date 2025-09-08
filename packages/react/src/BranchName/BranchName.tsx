import type React from 'react'
import type {ForwardedRef} from 'react'
import {clsx} from 'clsx'
import type {SxProp} from '../sx'
import classes from './BranchName.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'

type BranchNameProps<As extends React.ElementType = 'a'> = {
  as?: As
} & PolymorphicProps<As, 'a'> &
  Omit<SxProp, 'sx'> &
  SxProp

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BranchName<As extends React.ElementType>(props: BranchNameProps<As>, ref: ForwardedRef<any>) {
  const {as: Component = 'a', className, children, ...rest} = props
  return (
    <BoxWithFallback as={Component} {...rest} ref={ref} className={clsx(className, classes.BranchName)}>
      {children}
    </BoxWithFallback>
  )
}

BranchName.displayName = 'BranchName'

export type {BranchNameProps}
export default fixedForwardRef(BranchName)
