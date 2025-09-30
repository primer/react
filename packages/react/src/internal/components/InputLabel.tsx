import {clsx} from 'clsx'
import type React from 'react'
import type {ElementType} from 'react'
import classes from './InputLabel.module.css'
import type {PolymorphicProps} from '../../utils/modern-polymorphic'

type InputLabelProps<As extends ElementType = 'label'> = PolymorphicProps<
  As,
  'label',
  {
    disabled?: boolean
    required?: boolean
    requiredText?: string
    requiredIndicator?: boolean
    visuallyHidden?: boolean
  }
> &
  React.PropsWithChildren

export type LabelProps = InputLabelProps<'label'>
export type LegendOrSpanProps = InputLabelProps<'legend' | 'span'>

function InputLabel<As extends ElementType = 'label'>({
  children,
  disabled,
  htmlFor,
  id,
  required,
  requiredText,
  requiredIndicator,
  visuallyHidden,
  as,
  className,
  ...props
}: InputLabelProps<As>) {
  const Component = as || 'label'
  return (
    <Component
      data-control-disabled={disabled ? '' : undefined}
      data-visually-hidden={visuallyHidden ? '' : undefined}
      htmlFor={htmlFor}
      id={id}
      className={clsx(className, classes.Label)}
      {...props}
    >
      {required || requiredText ? (
        <span className={classes.RequiredText}>
          <span>{children}</span>
          <span aria-hidden={requiredIndicator ? undefined : true}>{requiredText ?? '*'}</span>
        </span>
      ) : (
        children
      )}
    </Component>
  )
}

export {InputLabel}
