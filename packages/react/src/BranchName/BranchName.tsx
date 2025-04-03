import React, {type ForwardedRef} from 'react'
import {clsx} from 'clsx'
import type {SxProp} from '../sx'
import classes from './BranchName.module.css'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'

type BranchNameProps<As extends React.ElementType> = {
  as?: As
} & DistributiveOmit<React.ComponentPropsWithRef<React.ElementType extends As ? 'a' : As>, 'as'> &
  Omit<SxProp, 'sx'> & {sx?: React.CSSProperties | undefined}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BranchName<As extends React.ElementType>(props: BranchNameProps<As>, ref: ForwardedRef<any>) {
  const {as: Component = 'a', className, children, ...rest} = props

  const BaseComponent = toggleSxComponent(Component)

  return (
    <BaseComponent {...rest} ref={ref} className={clsx(className, classes.BranchName)}>
      {children}
    </BaseComponent>
  )
}

// eslint-disable-next-line @typescript-eslint/ban-types
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode

const fixedForwardRef = React.forwardRef as FixedForwardRef

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any ? Omit<T, TOmitted> : never

BranchName.displayName = 'BranchName'

export type {BranchNameProps}
export default fixedForwardRef(BranchName)
