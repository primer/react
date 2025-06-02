import React, {type ForwardedRef} from 'react'
import {clsx} from 'clsx'
import type {SxProp} from '../sx'
import classes from './BranchName.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

type BranchNameProps<As extends React.ElementType> = {
  as?: As
} & DistributiveOmit<React.ComponentPropsWithRef<React.ElementType extends As ? 'a' : As>, 'as'> &
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode

const fixedForwardRef = React.forwardRef as FixedForwardRef

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any ? Omit<T, TOmitted> : never

BranchName.displayName = 'BranchName'

export type {BranchNameProps}
export default fixedForwardRef(BranchName)
