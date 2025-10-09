import {clsx} from 'clsx'
import React, {type ForwardedRef} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Text.module.css'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode

const fixedForwardRef = React.forwardRef as FixedForwardRef

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any ? Omit<T, TOmitted> : never

export type TextProps<As extends React.ElementType = 'span'> = {
  size?: 'large' | 'medium' | 'small'
  weight?: 'light' | 'normal' | 'medium' | 'semibold'
  as?: As
  className?: string
} & DistributiveOmit<React.ComponentPropsWithRef<React.ElementType extends As ? 'span' : As>, 'as'>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Text<As extends React.ElementType>(props: TextProps<As>, ref: ForwardedRef<any>) {
  const {as: Component = 'span', className, size, weight, ...rest} = props
  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(ref, innerRef)

  return (
    <Component
      className={clsx(className, classes.Text)}
      data-size={size}
      data-weight={weight}
      {...rest}
      ref={innerRef}
    />
  )
}

Text.displayName = 'Text'

export default fixedForwardRef(Text)
