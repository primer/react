import {clsx} from 'clsx'
import React from 'react'
import {type SxProp} from '../../sx'
import classes from './InputLabel.module.css'
import {toggleSxComponent} from '../utils/toggleSxComponent'

type BaseProps = SxProp & {
  disabled?: boolean
  required?: boolean
  requiredText?: string
  requiredIndicator?: boolean
  visuallyHidden?: boolean
  id?: string
  className?: string
}

export type LabelProps = BaseProps & {
  htmlFor?: string
  as?: 'label'
}

export type LegendOrSpanProps = BaseProps & {
  as: 'legend' | 'span'
  htmlFor?: undefined
}

type Props = React.PropsWithChildren<LabelProps | LegendOrSpanProps>

function InputLabel({
  children,
  disabled,
  htmlFor,
  id,
  required,
  requiredText,
  requiredIndicator,
  visuallyHidden,
  sx,
  as = 'label',
  className,
  ...props
}: Props) {
  const Label = toggleSxComponent({sx}, as) as React.ComponentType<Props>
  return (
    <Label
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
    </Label>
  )
}

export {InputLabel}
